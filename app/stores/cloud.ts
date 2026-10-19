/* Synk mellan enheten och familjekontot (Supabase), se docs/plan-familj.md och plan-konton-v2.md.

   Varje spelare på enheten (app/stores/profile.ts) som är en medlem i familjen har nyckeln
   "m:<medlemmens id>" och en koppling här:
   - en vuxen: inloggad med e-post - spelet hämtas automatiskt när hen loggar in
   - ett barn: enheten loggas in anonymt, familjekoden skrivs in och barnet väljs ("Vem spelar?").
     En enhet kan ha hur många barn som helst - var och en är en egen spelare.
   En vuxen kan låsa enhetens inloggning; då fungerar den som en barnenhet tills vuxen-PIN låser upp.
   Kopplingarna sparas lokalt (siiri-links, nyckel = spelaren). localStorage är det som spelet läser
   och skriver – det här lagret skickar upp ändringar och hämtar ner andras, så appen fungerar
   precis som förut utan nät och utan konto. */

const FAMILY_KEY = "siiri-eesti-family"; /* barnenhet: familjekoden, så att fler barn kan läggas till */
const PENDING_KEY = "siiri-pending-link"; /* ny spelare som ska kopplas när den laddats */
const CHOSEN_KEY = "siiri-eesti-chosen"; /* "Vem spelar?" är besvarad i den här fliken (sessionStorage) */
const PUSH_DELAY = 2000;

function readJson<T>(key: string, empty: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? empty;
  } catch {
    return empty;
  }
}
function writeJson(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* full eller blockerad */
  }
}

/* kopplingar utan kind (från den allra första modellen) släpps; spelen finns kvar lokalt */
function readLinks(): Record<string, CloudLink> {
  const all = readJson<Record<string, CloudLink>>(LINKS_KEY, {});
  for (const k of Object.keys(all)) if (!all[k]?.kind) delete all[k];
  return all;
}

/* inloggningens id står i token och avgör vilka barn som valts på just den här enheten */
function sessionIdOf(s: Session | null): string | null {
  try {
    const part = s?.access_token.split(".")[1];
    return part ? (JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")))?.session_id ?? null) : null;
  } catch {
    return null;
  }
}

const today0 = () => Math.floor(Date.now() / 86400000); /* samma dagräkning som den gamla appen */
const MEMBER_COLS = "id, family_id, kind, name, avatar, has_pin, data, ver";
type PlayerResult = { ok: true } | { ok: false; error: string; until?: string };

export const useCloudStore = defineStore("cloud", () => {
  const sb = getSupabase();
  const profile = useProfileStore();

  const enabled = !!sb;
  const session = ref<Session | null>(null);
  const me = ref<MySession | null>(null);
  const links = reactive<Record<string, CloudLink>>(readLinks());
  const family = ref<StoredFamily | null>(readJson<StoredFamily | null>(FAMILY_KEY, null));
  const status = ref<"av" | "synkar" | "klar" | "offline" | "fel">(enabled ? "klar" : "av");
  const lastError = ref("");

  const isAnonymous = computed(() => !!session.value?.user.is_anonymous);
  /* inloggad med e-post (vuxen) – med eller utan familj än */
  const isEmailUser = computed(() => !!session.value && !isAnonymous.value);
  /* vuxen som inte har låst enheten: föräldrafunktionerna syns */
  const isAdult = computed(() => !!session.value && !isAnonymous.value && !!me.value?.adult && !me.value.locked);
  const isLocked = computed(() => !!me.value?.locked);
  /* enhet där barnen spelar: barnenhet (familjekod) eller låst vuxen enhet – här finns "Vem spelar?" */
  const isFamilyDevice = computed(() => !!session.value && (isAnonymous.value || isLocked.value));
  /* familjens namn: sparat på barnenheten, eller hämtat för en låst enhet */
  const familyName = ref(family.value?.name || "");
  const link = computed<CloudLink | null>(() => links[profile.current] || null);
  /* kopplad, men inloggningen är borta – synken står still tills man loggar in eller väljer barnet igen */
  const needsLogin = computed(() => !!link.value && !session.value);

  function persist() {
    writeJson(LINKS_KEY, toRaw(links));
  }

  function fail(e: unknown) {
    const msg = e instanceof Error ? e.message : (e as { message?: string })?.message || String(e);
    lastError.value = msg;
    status.value = navigator.onLine === false || /fetch|network/i.test(msg) ? "offline" : "fel";
  }

  async function refreshSession() {
    if (!sb || !session.value) {
      me.value = null;
      return;
    }
    const { data, error } = await sb.rpc("my_session");
    if (!error) me.value = data as MySession;
    /* olåst vuxen: familjens namn till kortet Familj i spelet */
    if (me.value?.adult && !me.value.locked && me.value.family_id && !familyName.value) {
      const { data: f } = await sb.from("families").select("name").eq("id", me.value.family_id).maybeSingle();
      if (f) familyName.value = f.name;
    }
  }

  /* data som hämtas och läggs in räknas inte som en ny ändring – annars skickar två enheter
     samma data fram och tillbaka i all oändlighet */
  let applying = false;
  function apply(data: Record<string, any>) {
    applying = true;
    try {
      profile.replace(data);
    } finally {
      applying = false;
    }
  }

  /* ---------- hämta ---------- */
  let conflictRuns = 0;
  /* en låst enhet kommer inte åt den vuxnas eget spel – det synkar igen när enheten låses upp */
  const syncable = (l: CloudLink | null): l is CloudLink =>
    !!sb && !!l && !!session.value && !(l.kind === "adult" && isLocked.value);

  async function pull(): Promise<void> {
    const l = link.value;
    if (!syncable(l)) return;
    status.value = "synkar";
    const { data, error } = await sb!.from("members").select(MEMBER_COLS).eq("id", l.id).maybeSingle();
    if (error) return fail(error);
    if (!data) {
      /* medlemmen är borttagen, eller enheten är bortkopplad av en vuxen – spelet finns kvar lokalt,
         som en lokal spelare */
      delete links[profile.current];
      persist();
      profile.rekey(profile.current, newLocalKey());
      status.value = "klar";
      return;
    }
    if (data.ver !== l.ver && data.data && Object.keys(data.data).length) {
      const remote = migrate(data.data);
      apply(l.dirty ? mergeSaves(l.base ? JSON.parse(l.base) : null, toRaw(profile.state), remote) : remote);
      l.base = JSON.stringify(remote);
    }
    /* de vuxna har bytt barnets namn eller figur i Familjen → följer med in i spelet
       (barnets egna ändringar i spelet ligger kvar tills de vuxna ändrar igen) */
    if (l.kind === "child") {
      const s = profile.state;
      let changed = false;
      if (data.name !== l.name && s.name !== data.name) {
        s.name = data.name;
        changed = true;
      }
      if (data.avatar !== l.avatar && s.avatar !== data.avatar) {
        s.avatar = data.avatar;
        changed = true;
      }
      if (changed) profile.save();
    }
    l.ver = data.ver;
    l.name = data.name;
    l.avatar = data.avatar;
    l.pin = data.has_pin;
    persist();
    if (l.kind === "child") await pullWordLists(l.id);
    if (l.dirty && conflictRuns < 3) {
      conflictRuns++;
      await push();
    }
    if (status.value === "synkar") status.value = "klar";
  }

  /* Glosorna från familjen: barnets egen senaste lista och den senaste för alla barn (som inte gått ut)
     blir tillsammans barnets glosor. Nya listor ersätter de gamla; tas alla bort försvinner glosorna. */
  async function pullWordLists(memberId: string) {
    if (!sb) return;
    const cols = "id, name, words, days, created_at";
    const [own, all] = await Promise.all([
      sb.from("word_lists").select(cols).eq("member_id", memberId).order("created_at", { ascending: false }).limit(1),
      sb.from("word_lists").select(cols).is("member_id", null).order("created_at", { ascending: false }).limit(1),
    ]);
    if (own.error || all.error) return;
    const lists = [...(own.data || []), ...(all.data || [])]
      .map(w => ({ ...w, added: Math.floor(new Date(w.created_at).getTime() / 86400000) }))
      .filter(w => w.added + w.days >= today0());
    const s = profile.state;
    const key = lists.map(w => w.id).join("+");
    if (!lists.length) {
      if (s.school && s.school.cloudId) {
        s.school = null;
        s.schoolCloudId = null;
        profile.save();
      }
      return;
    }
    if (s.schoolCloudId === key) return;
    const added = Math.min(...lists.map(w => w.added));
    const end = Math.max(...lists.map(w => w.added + w.days));
    const seen = new Set<string>();
    const words = lists
      .flatMap(w => w.words as Word[])
      .filter(w => !seen.has(w.et) && seen.add(w.et))
      .map(w => ({ et: w.et, sv: w.sv, em: "📝", hint: w.et, school: true }));
    s.school = { name: lists.map(w => w.name).join(" + "), added, days: end - added, cloudId: key, words };
    s.schoolCloudId = key;
    profile.save();
    /* spelet hämtar uttalet till ord som saknar inspelning (public/legacy/app.js, schoolAudio) */
    window.dispatchEvent(new Event("siiri-school"));
  }

  /* ---------- skicka ---------- */
  let pushing = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  async function push(): Promise<void> {
    const l = link.value;
    if (!syncable(l) || pushing) return;
    if (navigator.onLine === false) {
      status.value = "offline";
      return;
    }
    pushing = true;
    status.value = "synkar";
    try {
      const data = JSON.parse(JSON.stringify(toRaw(profile.state)));
      const { data: rows, error } = await sb!
        .from("members")
        /* bara spelet – namn och figur på medlemmen sätts av de vuxna i Familjen */
        .update({ data, ver: l.ver + 1 })
        .eq("id", l.id)
        .eq("ver", l.ver)
        .select("ver");
      if (error) return fail(error);
      if (!rows || !rows.length) {
        /* en annan enhet hann spara först: hämta deras, slå ihop och skicka igen */
        pushing = false;
        if (conflictRuns < 3) {
          conflictRuns++;
          await pull();
        } else status.value = "fel";
        return;
      }
      l.ver = rows[0]!.ver;
      l.base = JSON.stringify(data);
      l.dirty = false;
      persist();
      conflictRuns = 0;
      status.value = "klar";
    } catch (e) {
      fail(e);
    } finally {
      pushing = false;
    }
  }

  function schedulePush() {
    const l = link.value;
    if (!l) return;
    if (!l.dirty) {
      l.dirty = true;
      persist();
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      push();
    }, PUSH_DELAY);
  }

  /* ---------- koppla spelare till medlemmar ---------- */

  /* Gör spelaren som spelar nu till en medlems spelare ("m:<id>") och kopplar den. Har både enheten och
     kontot ett spel måste man välja (choice) – annars returneras "needs-choice". En reservkopia tas
     alltid först. */
  async function linkCurrent(memberId: string, choice?: LinkChoice): Promise<"ok" | "needs-choice"> {
    if (!sb) throw new Error("Konton är inte påslagna");
    const { data, error } = await sb.from("members").select(MEMBER_COLS).eq("id", memberId).single();
    if (error) throw error;
    const remote = data.data && Object.keys(data.data).length ? migrate(data.data) : null;
    const remoteHas = hasProgress(remote),
      localHas = hasProgress(profile.state);
    if (remoteHas && localHas && !choice) return "needs-choice";

    profile.autoBackup("före koppling");
    const key = memberKey(memberId);
    if (links[profile.current] && profile.current !== key) delete links[profile.current];
    profile.rekey(profile.current, key);
    links[key] = {
      id: data.id,
      kind: data.kind,
      name: data.name,
      avatar: data.avatar,
      pin: data.has_pin,
      ver: data.ver,
      base: remote ? JSON.stringify(remote) : null,
      dirty: false,
    };
    if (remoteHas && (!localHas || choice === "remote")) apply(remote!);
    else if (remoteHas && choice === "merge") {
      apply(mergeSaves(null, toRaw(profile.state), remote!));
      links[key]!.dirty = true;
    } else links[key]!.dirty = true; /* enhetens spel laddas upp */
    /* en ny, tom spelare för en vuxen: hen heter som i familjen och slipper välja namn igen */
    if (data.kind === "adult" && !profile.state.name && data.name) {
      profile.state.name = data.name;
      profile.state.setupdone = 1;
      profile.save();
    }
    /* barnet heter och ser ut i spelet som de vuxna har bestämt i familjen */
    if (data.kind === "child" && (profile.state.name !== data.name || profile.state.avatar !== data.avatar)) {
      profile.state.name = data.name;
      profile.state.avatar = data.avatar;
      profile.save();
    }
    persist();
    if (links[key]!.dirty) await push();
    if (data.kind === "child") await pullWordLists(data.id);
    return "ok";
  }

  /* en ny spelare för en medlem: byt till den, kopplingen görs när den laddats (init) */
  function startMemberPlayer(memberId: string, to = "/") {
    const key = memberKey(memberId);
    writeJson(PENDING_KEY, { key, member: memberId });
    profile.switchPlayer(key, to);
  }

  /* ---------- barnens enheter: familjekod → vem spelar? ---------- */

  /* slår upp familjen med koden (loggar in anonymt först). Koden sparas på enheten. */
  async function lookupFamily(code: string): Promise<FamilyLookup> {
    if (!sb) throw new Error("Konton är inte påslagna");
    if (!session.value) {
      const { data, error } = await sb.auth.signInAnonymously();
      if (error) throw error;
      session.value = data.session;
    }
    const { data, error } = await sb.rpc("family_lookup", { p_code: code });
    if (error) throw error;
    const r = data as FamilyLookup;
    if (r.ok) {
      family.value = { code: code.toUpperCase().replace(/[^A-Z0-9]/g, ""), name: r.family_name! };
      familyName.value = r.family_name!;
      writeJson(FAMILY_KEY, family.value);
    }
    return r;
  }

  /* familjens barn för en låst vuxen enhet – utan familjekod */
  async function familyChildren(): Promise<FamilyLookup> {
    if (!sb) throw new Error("Konton är inte påslagna");
    const { data, error } = await sb.rpc("my_family_children");
    if (error) throw error;
    const r = data as FamilyLookup;
    if (r.ok) familyName.value = r.family_name || "";
    return r;
  }

  /* lägger till barnet på enheten – och kontrollerar barnets PIN om det har en (för många fel → spärr).
     Barnenheter visar familjekoden, en låst vuxen enhet behöver den inte. */
  async function chooseMember(memberId: string, pin: string | null): Promise<PlayerResult> {
    const { data, error } = await sb!.rpc("choose_member", {
      p_member: memberId,
      p_pin: pin,
      p_code: family.value?.code ?? null,
      p_label: deviceLabel(),
    });
    if (error) throw error;
    const r = data as { ok: boolean; error?: string; until?: string };
    return r.ok ? { ok: true } : { ok: false, error: r.error || "fel", until: r.until };
  }

  /* Väljer ett barn på enheten (med PIN om barnet har en). Finns barnet redan på enheten byts det
     till; annars blir spelaren som spelas nu barnets om den är lokal och tom eller redan barnets eget
     spel (samma namn), och i övriga fall får barnet en egen, ny spelare. Någon annans spel ska aldrig
     bli barnets. Byter man spelare laddas spelet om. */
  async function addPlayer(
    member: { id: string; name: string },
    pin: string | null,
    choice?: LinkChoice,
  ): Promise<{ ok: true; key: string } | { ok: false; error: string; until?: string } | "needs-choice"> {
    if (!sb) throw new Error("Konton är inte påslagna");
    const key = memberKey(member.id);
    if (profile.current === key) {
      markChosen();
      return { ok: true, key };
    }
    if (!choice) {
      const r = await chooseMember(member.id, pin);
      if (!r.ok) return r;
      await refreshSession();
    }
    markChosen();
    if (profile.players.includes(key)) {
      profile.switchPlayer(key, "/");
      return { ok: true, key };
    }
    const sameName = (profile.state.name || "").trim().toLowerCase() === member.name.trim().toLowerCase();
    if (!link.value && (!hasProgress(profile.state) || sameName)) {
      const r = await linkCurrent(member.id, choice);
      if (r === "needs-choice") return r;
      return { ok: true, key };
    }
    startMemberPlayer(member.id);
    return { ok: true, key };
  }

  /* ---------- "Vem spelar?" på enheter där barnen spelar ---------- */

  const picker = reactive({ open: false, mandatory: false, pinKey: null as string | null });

  function markChosen() {
    try {
      sessionStorage.setItem(CHOSEN_KEY, "1");
    } catch {
      /* blockerad */
    }
  }
  function chosenThisVisit() {
    try {
      return !!sessionStorage.getItem(CHOSEN_KEY);
    } catch {
      return false;
    }
  }

  /* spelarna på enheten. Den vuxnas eget spel visas inte när enheten är låst, och tomma lokala
     spelare (påbörjade men aldrig spelade) visas inte. */
  function devicePlayers(): DevicePlayer[] {
    const out: DevicePlayer[] = [];
    for (const key of profile.players) {
      const l = links[key];
      if (l?.kind === "adult" && isLocked.value) continue;
      if (!l && !profile.playerUsed(key)) continue;
      const info = key === profile.current ? profile.state : profile.playerInfo(key);
      out.push({
        key,
        name: info?.name || l?.name || "",
        avatar: info?.avatar || l?.avatar || "🦔",
        kind: l?.kind || "",
        pin: !!(l?.kind === "child" && l.pin),
        current: key === profile.current,
      });
    }
    return out;
  }

  /* PIN-kod och familjens namn kan ha ändrats sedan barnen valdes – hämta dem (tyst utan nät) */
  async function refreshPlayers() {
    if (!sb || !session.value) return;
    try {
      if (isLocked.value) await familyChildren();
      const ids = Object.values(links)
        .filter(l => l.kind === "child")
        .map(l => l.id);
      if (!ids.length) return;
      const { data } = await sb.from("members").select("id, has_pin").in("id", ids);
      for (const m of data || []) for (const l of Object.values(links)) if (l.id === m.id) l.pin = m.has_pin;
      persist();
    } catch {
      /* offline: det som är sparat gäller */
    }
  }

  function openPicker(opts: { mandatory?: boolean; pinKey?: string } = {}) {
    picker.mandatory = !!opts.mandatory;
    picker.pinKey = opts.pinKey ?? null;
    picker.open = true;
    refreshPlayers();
  }
  function closePicker() {
    if (picker.mandatory) return;
    picker.open = false;
    picker.pinKey = null;
    markChosen();
  }

  /* byter till en spelare. Barn med PIN-kod kräver den (kontrolleras av databasen). */
  async function switchPlayer(key: string, pin: string | null): Promise<PlayerResult> {
    const l = links[key];
    if (l?.kind === "adult" && isLocked.value) return { ok: false, error: "locked_adult" };
    if (l?.kind === "child" && l.pin) {
      const r = await chooseMember(l.id, pin);
      if (!r.ok) return r;
    }
    markChosen();
    picker.open = false;
    picker.mandatory = false;
    picker.pinKey = null;
    if (key !== profile.current) profile.switchPlayer(key, "/");
    return { ok: true };
  }

  /* spelarlistan i profilen: på en familjeenhet går byten till barn med PIN via "Vem spelar?" */
  function requestPlayer(key: string) {
    if (key === profile.current) return;
    const l = links[key];
    if (isFamilyDevice.value && ((l?.kind === "child" && l.pin) || (l?.kind === "adult" && isLocked.value)))
      return openPicker({ pinKey: l.kind === "child" ? key : undefined });
    markChosen();
    profile.switchPlayer(key);
  }

  /* när spelet startar: välj spelare om flera spelar på enheten. På en låst enhet får den vuxnas
     eget spel inte spelas – då måste ett barn väljas. */
  function startPicker() {
    if (!isFamilyDevice.value) return;
    if (isLocked.value && (link.value?.kind === "adult" || !devicePlayers().some(p => p.current)))
      return openPicker({ mandatory: true });
    if (!chosenThisVisit() && devicePlayers().length >= 2) openPicker();
  }

  /* kopplar bort spelaren från familjen. Spelet finns kvar på enheten som en lokal spelare; är det
     sista barnet loggas enheten ut. */
  async function removePlayer(key = profile.current) {
    const l = links[key];
    if (!l) return;
    delete links[key];
    persist(); /* lokalt först – det ska gälla även utan nät */
    profile.rekey(key, newLocalKey());
    if (!sb || !session.value || l.kind !== "child") return;
    try {
      const sid = sessionIdOf(session.value);
      if (sid) await sb.from("device_members").delete().eq("session_id", sid).eq("member_id", l.id);
      if (isAnonymous.value && !Object.values(links).some(x => x.kind === "child")) {
        await sb.auth.signOut();
        family.value = null;
        familyName.value = "";
        writeJson(FAMILY_KEY, null);
      }
      await refreshSession();
    } catch {
      /* offline: en vuxen kan ta bort enheten från sin sida */
    }
  }

  /* barnenhet → vuxen: alla barn släpps från enheten (spelen finns kvar lokalt) och den anonyma inloggningen avslutas */
  async function leaveFamilyDevice() {
    for (const [key, l] of Object.entries(links)) if (l.kind === "child") await removePlayer(key);
    if (sb && isAnonymous.value) await sb.auth.signOut();
    family.value = null;
    familyName.value = "";
    writeJson(FAMILY_KEY, null);
    me.value = null;
  }

  /* ---------- vuxna ---------- */

  /* Efter inloggning: den vuxna spelar sitt eget spel, så att ett konto aldrig "försvinner" när
     webbläsarens data töms (docs/plan-konton-v2.md). Finns den vuxnas spelare redan på enheten byts
     det till den. Annars blir spelaren som spelas nu den vuxnas om den är lokal och tom eller samma
     person (samma namn) - finns spel på båda ställena slås de ihop, inget skrivs över. I övriga fall
     får den vuxna en egen spelare; det lokala spelet ligger kvar i "Vem spelar?".
     "linked" = spelet som spelas nu är kopplat (redan inläst), "switched" = sidan laddas om med den
     vuxnas spelare, false = inget att göra.
     onLogin = false (när sidan bara laddas): byt aldrig bort en spelare som man själv har valt -
     bara en tom, lokal spelare kopplas om den vuxnas spelare inte finns på enheten. */
  let autoLinking: Promise<"linked" | "switched" | false> | null = null;
  function autoLinkOwnGame(onLogin = true): Promise<"linked" | "switched" | false> {
    /* kan startas både av inloggningen och av sidan - körs bara en gång åt gången */
    if (!autoLinking) autoLinking = doAutoLink(onLogin).finally(() => (autoLinking = null));
    return autoLinking;
  }
  async function doAutoLink(onLogin: boolean): Promise<"linked" | "switched" | false> {
    if (!sb || !session.value || isAnonymous.value || !me.value?.adult || me.value.locked) return false;
    const { data } = await sb
      .from("members")
      .select("id, name")
      .eq("user_id", session.value.user.id)
      .eq("kind", "adult")
      .maybeSingle();
    if (!data) return false;
    const key = memberKey(data.id);
    if (profile.current === key) return false;
    if (profile.players.includes(key)) {
      if (!onLogin) return false;
      profile.switchPlayer(key);
      return "switched";
    }
    const sameName = !!data.name && (profile.state.name || "").trim().toLowerCase() === data.name.trim().toLowerCase();
    if (!link.value && (!hasProgress(profile.state) || sameName)) {
      await linkCurrent(data.id, "merge");
      return "linked";
    }
    if (!onLogin) return false;
    startMemberPlayer(data.id, location.pathname + location.search);
    return "switched";
  }

  /* "Spela som" i Familjen: en olåst vuxen byter enheten till en medlems spel – barn utan deras PIN,
     eller sitt eget. Barnet registreras på enheten, så att spelet synkar även när enheten lämnas över.
     Allt som spelas räknas på medlemmen. Sidan laddas om med spelaren. */
  async function playAs(member: { id: string; kind: "adult" | "child" }) {
    if (!sb || !isAdult.value) throw new Error("Logga in som vuxen först");
    if (member.kind === "child") {
      const r = await chooseMember(member.id, null);
      if (!r.ok) throw new Error("Det gick inte att välja barnet på enheten.");
    }
    markChosen();
    const key = memberKey(member.id);
    if (profile.players.includes(key)) profile.switchPlayer(key, "/");
    else startMemberPlayer(member.id, "/");
  }

  /* "Lämna över till barnen": låser enhetens inloggning. Barnen som spelar här registreras på den nya
     inloggningen först – annars når en låst enhet inte deras spel. */
  async function lock() {
    if (!sb) return;
    for (const l of Object.values(links))
      if (l.kind === "child")
        await chooseMember(l.id, null).catch(() => {
          /* barnet kan vara borttaget - det märks vid nästa hämtning */
        });
    const { error } = await sb.rpc("lock_session");
    if (error) throw error;
    try {
      sessionStorage.removeItem(CHOSEN_KEY); /* barnen väljer vem som spelar */
    } catch {
      /* blockerad */
    }
    await refreshSession();
  }

  async function unlock(pin: string): Promise<{ ok: boolean; error?: string; until?: string }> {
    if (!sb) throw new Error("Konton är inte påslagna");
    const { data, error } = await sb.rpc("unlock_session", { p_pin: pin });
    if (error) throw error;
    await refreshSession();
    return data as { ok: boolean; error?: string; until?: string };
  }

  /* vuxen loggar ut: kopplingen till det egna spelet ligger kvar och synkar igen vid nästa inloggning */
  async function signOut() {
    if (!sb) return;
    await sb.auth.signOut();
    me.value = null;
  }

  /* ---------- start ---------- */
  let ready: Promise<void> | null = null;
  function init(): Promise<void> {
    if (ready) return ready;
    ready = (async () => {
      if (!sb) return;
      const { data } = await sb.auth.getSession();
      session.value = data.session;
      sb.auth.onAuthStateChange((_event, s) => {
        const changed = s?.user.id !== session.value?.user.id;
        session.value = s;
        /* nyss inloggad vuxen: hämta hens spel direkt (efter den här händelsen - Supabase vill inte
           att man anropar databasen inifrån sin egen lyssnare) */
        if (changed)
          setTimeout(
            () =>
              refreshSession()
                .then(() => autoLinkOwnGame())
                .catch(fail),
            0,
          );
      });
      /* allt som skriver spelet: save (den gamla koden), och import/nollställning som sparar inifrån */
      const writes = new Set(["save", "replace", "importCode", "wipe"]);
      profile.$onAction(({ name, after }) => {
        if (writes.has(name))
          after(() => {
            if (!applying) schedulePush();
          });
      });
      window.addEventListener("online", () => {
        pull();
      });
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") pull();
        else if (link.value?.dirty) {
          clearTimeout(timer);
          push();
        }
      });
      await refreshSession().catch(fail);
      /* inloggad vuxen vars spel inte finns på enheten (t.ex. efter tömd webbläsare): hämta det.
         Hann spelet starta med det lokala innan svaret kom laddas det om med kontots spel. */
      /* en ny spelare för en medlem (barn som lades till, eller den vuxnas eget spel) – koppla den nu */
      const pending = readJson<{ key: string; member: string } | null>(PENDING_KEY, null);
      if (pending && pending.key === profile.current && session.value) {
        writeJson(PENDING_KEY, null);
        await linkCurrent(pending.member, "remote").catch(fail);
      }
      const auto = await autoLinkOwnGame(false).catch(() => false as const);
      if (auto === "switched") return; /* sidan laddas om */
      if (auto === "linked") {
        if (document.querySelector('script[src="/legacy/app.js"]')) location.reload();
        return;
      }
      if (link.value && session.value) await pull().catch(fail);
      /* diplom m.m. som en tidigare sammanslagning tappade – sparas och skickas upp som vanligt */
      if (link.value) profile.healFromBackup();
      if (isLocked.value) familyChildren().catch(() => {});
      startPicker();
    })();
    return ready;
  }
  /* den gamla appen väntar högst så här länge på första hämtningen innan den startar */
  function whenReady(ms: number) {
    return Promise.race([init(), new Promise<void>(r => setTimeout(r, ms))]);
  }

  return {
    enabled,
    session,
    me,
    links,
    link,
    family,
    status,
    lastError,
    isAnonymous,
    isEmailUser,
    isAdult,
    isLocked,
    isFamilyDevice,
    familyName,
    needsLogin,
    picker,
    init,
    whenReady,
    refreshSession,
    pull,
    push,
    linkCurrent,
    lookupFamily,
    familyChildren,
    addPlayer,
    devicePlayers,
    openPicker,
    closePicker,
    switchPlayer,
    requestPlayer,
    removePlayer,
    leaveFamilyDevice,
    autoLinkOwnGame,
    playAs,
    lock,
    unlock,
    signOut,
  };
});
