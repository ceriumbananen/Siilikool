/* Synk mellan enheten och föräldrakontot (Supabase).

   På barnets enhet kan en lokal profilplats (0–2) kopplas till barnets profil i kontot: enheten
   loggas in anonymt och kopplas med förälderns kod (sidan /connect). Förälderns egen enhet kopplas
   aldrig – föräldern har alltid sitt eget spel och läser barnens framsteg i föräldraläget.
   Kopplingen sparas lokalt (siiri-eesti-cloud). localStorage är fortfarande det som spelet läser
   och skriver – det här lagret skickar upp ändringar och hämtar ner andras, så appen fungerar
   precis som förut utan nät och utan konto. */

const LINKS_KEY = "siiri-eesti-cloud";
const PUSH_DELAY = 2000;

function readLinks(): Record<string, CloudLink> {
  try {
    const all: Record<string, CloudLink & { mode?: string }> =
      JSON.parse(localStorage.getItem(LINKS_KEY) || "{}") || {};
    /* kopplingar från det borttagna "spela som" på förälderns enhet släpps – spelet finns kvar lokalt */
    for (const k of Object.keys(all)) if (all[k]!.mode === "parent") delete all[k];
    return all;
  } catch {
    return {};
  }
}

const today0 = () => Math.floor(Date.now() / 86400000); /* samma dagräkning som den gamla appen */

export const useCloudStore = defineStore("cloud", () => {
  const sb = getSupabase();
  const profile = useProfileStore();

  const enabled = !!sb;
  const session = ref<Session | null>(null);
  const links = reactive<Record<string, CloudLink>>(readLinks());
  const status = ref<"av" | "synkar" | "klar" | "offline" | "fel">(enabled ? "klar" : "av");
  const lastError = ref("");

  const isParent = computed(() => !!session.value && !session.value.user.is_anonymous);
  const isDevice = computed(() => !!session.value && !!session.value.user.is_anonymous);
  const link = computed<CloudLink | null>(() => links[String(profile.slot)] || null);
  /* kopplad, men inloggningen är borta (t.ex. föräldern loggade ut) – synken står still */
  const needsLogin = computed(() => !!link.value && !session.value);

  function persist() {
    try {
      localStorage.setItem(LINKS_KEY, JSON.stringify(toRaw(links)));
    } catch {
      /* full */
    }
  }

  function fail(e: unknown) {
    const msg = e instanceof Error ? e.message : (e as { message?: string })?.message || String(e);
    lastError.value = msg;
    status.value = navigator.onLine === false || /fetch|network/i.test(msg) ? "offline" : "fel";
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
  async function pull(): Promise<void> {
    const l = link.value;
    if (!sb || !l || !session.value) return;
    status.value = "synkar";
    const { data, error } = await sb.from("profiles").select("id, name, data, ver").eq("id", l.id).maybeSingle();
    if (error) return fail(error);
    if (!data) {
      /* profilen är raderad eller enheten bortkopplad av föräldern – spelet finns kvar lokalt */
      delete links[String(profile.slot)];
      persist();
      status.value = "klar";
      return;
    }
    if (data.ver !== l.ver && data.data && Object.keys(data.data).length) {
      const remote = migrate(data.data);
      apply(l.dirty ? mergeSaves(l.base ? JSON.parse(l.base) : null, toRaw(profile.state), remote) : remote);
      l.base = JSON.stringify(remote);
    }
    l.ver = data.ver;
    l.name = data.name;
    persist();
    await pullSchoolList(l.id);
    if (l.dirty && conflictRuns < 3) {
      conflictRuns++;
      await push();
    }
    if (status.value === "synkar") status.value = "klar";
  }

  /* förälderns senaste läxlista blir barnets glosor (om den inte redan lagts in eller gått ut) */
  async function pullSchoolList(profileId: string) {
    if (!sb) return;
    const { data, error } = await sb
      .from("school_lists")
      .select("id, name, words, days, created_at")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) return;
    const s = profile.state;
    if (!data) {
      /* föräldern har tagit bort listan */
      if (s.school && s.school.cloudId) {
        s.school = null;
        profile.save();
      }
      return;
    }
    const added = Math.floor(new Date(data.created_at).getTime() / 86400000);
    if (s.schoolCloudId === data.id || added + data.days < today0()) return;
    s.school = {
      name: data.name,
      added,
      days: data.days,
      cloudId: data.id,
      words: (data.words as Word[]).map(w => ({ et: w.et, sv: w.sv, em: "📝", hint: w.et, school: true })),
    };
    s.schoolCloudId = data.id;
    profile.save();
  }

  /* ---------- skicka ---------- */
  let pushing = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  async function push(): Promise<void> {
    const l = link.value;
    if (!sb || !l || !session.value || pushing) return;
    if (navigator.onLine === false) {
      status.value = "offline";
      return;
    }
    pushing = true;
    status.value = "synkar";
    try {
      const data = JSON.parse(JSON.stringify(toRaw(profile.state)));
      const { data: rows, error } = await sb
        .from("profiles")
        .update({
          data,
          ver: l.ver + 1,
          name: String(data.name || "").slice(0, 40),
          avatar: String(data.avatar || "🦔").slice(0, 16),
        })
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

  /* ---------- koppla och koppla bort ---------- */

  /* Kopplar profilplatsen som spelas nu (på barnets enhet) till barnets profil. Har både enheten och
     kontot ett spel måste man välja (choice) – annars returneras "needs-choice". En reservkopia tas alltid först. */
  async function linkSlot(profileId: string, choice?: LinkChoice): Promise<"ok" | "needs-choice"> {
    if (!sb) throw new Error("Konton är inte påslagna");
    const { data, error } = await sb.from("profiles").select("id, name, data, ver").eq("id", profileId).single();
    if (error) throw error;
    const remote = data.data && Object.keys(data.data).length ? migrate(data.data) : null;
    const remoteHas = hasProgress(remote),
      localHas = hasProgress(profile.state);
    if (remoteHas && localHas && !choice) return "needs-choice";

    profile.autoBackup("före koppling");
    const l: CloudLink = {
      id: data.id,
      name: data.name,
      ver: data.ver,
      base: remote ? JSON.stringify(remote) : null,
      dirty: false,
    };
    links[String(profile.slot)] = l;
    persist();

    if (remoteHas && (!localHas || choice === "remote")) apply(remote!);
    else if (remoteHas && choice === "merge") {
      apply(mergeSaves(null, toRaw(profile.state), remote!));
      links[String(profile.slot)]!.dirty = true;
    } else links[String(profile.slot)]!.dirty = true; /* enhetens spel laddas upp */
    persist();
    if (links[String(profile.slot)]!.dirty) await push();
    await pullSchoolList(data.id);
    return "ok";
  }

  /* barnets enhet: logga in anonymt och lös in förälderns kod. Returnerar barnprofilens id. */
  async function claimCode(code: string, label: string): Promise<string> {
    if (!sb) throw new Error("Konton är inte påslagna");
    if (isParent.value) throw new Error("parent-signed-in");
    if (!session.value) {
      const { data, error } = await sb.auth.signInAnonymously();
      if (error) throw error;
      session.value = data.session;
    }
    const { data, error } = await sb.rpc("claim_pair_code", { p_code: code, p_label: label });
    if (error)
      throw new Error(error.code === "P0002" ? "Koden stämmer inte eller har gått ut. Be om en ny." : error.message);
    return data as string;
  }

  /* kopplar bort profilplatsen. Spelet finns kvar på enheten; kopplingen i kontot tas också bort
     och den anonyma inloggningen avslutas. */
  async function unlink(slot = profile.slot) {
    const l = links[String(slot)];
    if (!l) return;
    delete links[String(slot)];
    persist(); /* lokalt först – det ska gälla även utan nät */
    if (sb && session.value?.user.is_anonymous) {
      try {
        await sb.from("device_links").delete().eq("device_user", session.value.user.id);
        await sb.auth.signOut();
      } catch {
        /* offline: föräldern kan ta bort enheten från sin sida */
      }
    }
  }

  /* föräldern loggar ut (förälderns eget spel på enheten påverkas inte) */
  async function signOut() {
    if (!sb) return;
    await sb.auth.signOut();
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
        session.value = s;
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
      if (link.value && session.value) await pull().catch(fail);
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
    links,
    link,
    status,
    lastError,
    isParent,
    isDevice,
    needsLogin,
    init,
    whenReady,
    pull,
    push,
    linkSlot,
    claimCode,
    unlink,
    signOut,
  };
});
