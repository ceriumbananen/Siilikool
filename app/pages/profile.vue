<script setup lang="ts">
/* Profilen - porterat från profileScreen() i public/legacy/app.js (rad 8225-8550).
   UiAppShell ger samma toppfält/nivåmätare/bottennav som spelets egna skärmar, se
   app/components/ui/AppShell.vue. "me" markerad som vald flik.

   Siiri-portträttet (siilSVG/wearSVG, med kittel-/guld-/nys-hemligheterna) är portat, se
   app/components/ui/SiiriPortrait.vue och app/utils/siiri-portrait.ts.

   Medvetet utelämnat tills vidare, med samma motivering som Skattkammaren
   (app/pages/trophy.vue): "ord att öva"-statistiken (hardWords()), som kräver att hela
   ordförrådet (THEMES/TRIP, ~1600 rader) porteras till TS först -
   mycket större jobb än själva statistikraden, så det får vänta tills vokabuläret ändå
   porteras för någon annan skärm. "Hör Siiri säga ditt namn" är däremot portad (se
   app/utils/name-audio.ts) - namnbanken (public/audio/names-*.js) är liten och fristående,
   ingen vokabulärdata behövs. Inledande "Tere," spelas också upp - det klippet
   (audio/clips/normal/tere.mp3) ligger i basljudbanken som alltid finns
   (public/legacy/data.js, LEADS.tere), ingen temafil behöver hämtas för det.

   Länkar till skärmar som ännu inte flyttats till Vue (rummet, läxorna, "för vuxna", redigera
   namn/figur, marknaden, ordlistan) går till / och hoppar direkt till rätt skärm där - se
   app/utils/legacy-nav.ts och uppstartssekvensen allra sist i app.js. Skattkammaren är redan
   en egen sida och länkas dit på riktigt. Familjekortet och spelarväxlaren återanvänder
   useCloudStore() och WhoPlays.vue rakt av - de är redan riktiga Vue-byggstenar, inget att
   portera.

   Adminläget (tidigare: fem snabba klick på "Seaded · Inställningar" inom 3,5s, se setttl i
   git-historiken för profileScreen) är medvetet utan ljudsignalen de gamla klicken gav -
   den kommer från tone(), som hör till ljudmotorn i app.js och inte är laddad här. */

const profile = useProfileStore();
const { L, TL, tgt, nat, tgtLang, isEt } = useLang();
/* estniskt läge är under uppbyggnad - rutan syns bara där det slagits på i Admin (samma
   flagga som språkvalet vid första start, LANG_BETA_KEY i public/legacy/app.js) eller för en
   spelare som redan är i estniskt läge */
const langBeta = ref(false);
onMounted(() => {
  try {
    langBeta.value = localStorage.getItem("siiri-lang-beta") === "1";
  } catch {
    /* privat läge o.d. */
  }
});
/* byter språkriktning (S.home, se app/utils/lang.ts) - spelets gamla motor läser valet när den
   startar, så sidan laddas om på startsidan */
function setHome(home: "sv" | "et") {
  if ((profile.state.home === "et" ? "et" : "sv") === home) return;
  profile.state.home = home;
  profile.state.homePicked = 1;
  profile.save();
  location.href = "/";
}
const cloud = useCloudStore();
const { busy: playBusy, err: playErr, run: runPlay } = useBusy();

const ri = computed(() => rankIndex(profile.state.xp));
const rank = computed(() => RANKS[ri.value]!);
const nextRank = computed(() => RANKS[ri.value + 1]);

const GREETING_CLIP = "/audio/clips/normal/tere.mp3"; /* LEADS.tere, se filens topp-kommentar */
/* genom Siiris röst, så att munnen rör sig medan hon säger det */
const voice = useSiiriVoice();
const nameClipUrl = ref<string | null>(null);
watch(
  () => profile.state.name,
  name => {
    nameClipUrl.value = null;
    if (name)
      findNameClip(name).then(url => {
        nameClipUrl.value = url;
        if (url) voice.preload([GREETING_CLIP, `/${url}`]); /* så att hälsningen kommer direkt */
      });
  },
  { immediate: true },
);
function playName() {
  if (!nameClipUrl.value) return;
  voice.say([GREETING_CLIP, `/${nameClipUrl.value}`]);
}

const themesDone = computed(
  () => Object.values((profile.state.best as Record<string, number> | undefined) || {}).filter(v => v > 0).length,
);

const badgeRows = computed(() =>
  BADGES.map(badge => ({
    badge,
    earned: (profile.state.badges as string[]).includes(badge.id),
    progress: badgeProgress(badge, profile.state as unknown as BadgeProfile),
  })),
);

const secretsFound = computed(() => (profile.state.secrets as string[] | undefined) || []);

/* vad Siiri kommit ihåg genom samtal och rummet (favoritfärg, husdjurets namn) plus hur
   länge ni spelat ihop - utspritt över Jutt Siiriga/rummet/hemskärmen annars, aldrig
   samlat på ett ställe för barnet att se. */
const favColor = computed(() => (profile.state.favColor as string | undefined) || "");
const petName = computed(() => (profile.state.petName as string | undefined) || "");
const petKind = computed(() => {
  const id = (profile.state.room as Record<string, string> | undefined)?.pet;
  return nat(FURN.find(f => f.id === id)).toLowerCase();
});
const daysPlayed = computed(() => (profile.state.daysPlayed as number | undefined) || 0);
const hasFacts = computed(() => !!(favColor.value || petName.value || daysPlayed.value));

/** Alla spelare på enheten (familjens medlemmar och lokala spelare) - "➕ Ny spelare" lägger till en. */
const players = computed(() =>
  profile.players
    .filter(key => cloud.links[key] || profile.playerUsed(key))
    .map(key => {
      const current = key === profile.current;
      const info = current
        ? { name: profile.state.name, avatar: profile.state.avatar, xp: profile.state.xp, stars: profile.state.stars }
        : profile.playerInfo(key);
      const link = cloud.links[key];
      const kind = !link ? "" : link.kind === "child" ? (link.pin ? "child-pin" : "child") : "adult";
      return { key, info, current, kind, name: info?.name || link?.name || "" };
    }),
);

function toggleSound() {
  profile.state.sound = !profile.state.sound;
  profile.save();
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme");
  const isDark = cur ? cur === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  const next = isDark ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  profile.state.theme = next;
  profile.save();
}
function toggleAmbience() {
  profile.state.amb = profile.state.amb ? 0 : 1;
  profile.save();
}
function toggleSecrets() {
  profile.state.secretsOpen = profile.state.secretsOpen ? 0 : 1;
  profile.save();
}

/* inloggad vuxen: familjens medlemmar som inte spelar på enheten än - "Spela som" byter till dem
   (samma som i Familjen). Barnen och den vuxnas eget spel; inte andra vuxnas. */
const family = ref<Member[]>([]);
watch(
  () => cloud.isAdult,
  async adult => {
    family.value = [];
    if (!adult) return;
    try {
      const uid = cloud.session?.user.id;
      family.value = (await useParentApi().members()).filter(
        m => !profile.players.includes(memberKey(m.id)) && (m.kind === "child" || m.user_id === uid),
      );
    } catch {
      /* offline: bara spelarna på enheten */
    }
  },
  { immediate: true },
);
const playAs = (m: Member) => runPlay(() => cloud.playAs(m));

/* Hemligt adminläge: fem klick på rubriken nedan inom 3,5s, precis som setttl gjorde i
 * profileScreen (se app/utils/legacy-nav.ts för hur hoppet till app.js görs). */
let adminTaps = 0;
let adminTapTimer: ReturnType<typeof setTimeout> | undefined;
function tapSettingsTitle() {
  adminTaps++;
  clearTimeout(adminTapTimer);
  adminTapTimer = setTimeout(() => {
    adminTaps = 0;
  }, 3500);
  if (adminTaps >= 5) {
    adminTaps = 0;
    markLegacyScreen("admin");
    location.href = "/";
  }
}
</script>

<template>
  <UiAppShell active="me">
    <main class="profile-page">
      <UiPageHero
        emoji="🦔"
        :title="TL('Minu profiil', 'Min profil')"
        :subtitle="L('Min profil', 'Minu profiil')"
        tone="violet"
      />

      <UiAppCard class="profile-page__section profile-page__me">
        <UiSiiriPortrait />
        <p class="profile-page__name">{{ profile.state.name || L("Ingen spelare än", "Mängijat veel pole") }}</p>
        <div v-if="nameClipUrl || profile.state.name" class="profile-page__name-audio">
          <UiAppButton v-if="nameClipUrl" variant="ghost" @click="playName">{{
            L("🔊 Hör Siiri säga ditt namn", "🔊 Kuula, kuidas Siiri su nime ütleb")
          }}</UiAppButton>
          <p v-else class="profile-page__rank-sv">
            {{
              L(
                "Siiri kan inte säga just det namnet högt än, men skriver det överallt.",
                "Siiri ei oska seda nime veel valjusti öelda, aga kirjutab selle igale poole.",
              )
            }}
          </p>
        </div>
        <UiMedalBadge :rank="rank" :locked="false" :medal-style="medalStyleOf(profile.state.mstyle, rank.id)" />
        <p class="profile-page__rank-name" :lang="tgtLang()">{{ tgt(rank) }}</p>
        <p class="profile-page__rank-sv">{{ nat(rank) }}</p>
        <p v-if="nextRank && isEt()">Järgmise märgini veel {{ nextRank.xp - profile.state.xp }} punkti</p>
        <p v-else-if="nextRank">Nästa märke om {{ nextRank.xp - profile.state.xp }} poäng</p>
        <p v-else>{{ L("Alla märken tagna!", "Kõik märgid käes!") }}</p>
      </UiAppCard>

      <UiAppCard class="profile-page__section">
        <h2>{{ L("Dina siffror", "Sinu numbrid") }}</h2>
        <div class="profile-page__stats">
          <div class="profile-page__stat">
            <b>{{ profile.state.xp }}</b
            ><span>{{ L("poäng", "punkti") }}</span>
          </div>
          <div class="profile-page__stat">
            <b>{{ profile.state.stars }}</b
            ><span>{{ L("stjärnor", "tähte") }}</span>
          </div>
          <div class="profile-page__stat">
            <b>{{ profile.state.correct }}</b
            ><span>{{ L("rätta svar", "õiget vastust") }}</span>
          </div>
          <div class="profile-page__stat">
            <b>{{ profile.state.bestcombo || 0 }}</b
            ><span>{{ L("bästa kombo", "parim seeria") }}</span>
          </div>
          <div class="profile-page__stat">
            <b>{{ themesDone }} / {{ THEMES_LENGTH }}</b
            ><span>{{ L("teman klara", "teemat läbitud") }}</span>
          </div>
          <div class="profile-page__stat">
            <b>{{ profile.state.flames || 0 }} 🌟</b
            ><span>{{ L("dagsutmaningar klarade", "päevaülesannet tehtud") }}</span>
          </div>
          <div class="profile-page__stat">
            <b>{{ profile.state.spoken }}</b
            ><span>{{ L("sagt högt", "valjusti öeldud") }}</span>
          </div>
          <div class="profile-page__stat">
            <b>{{ profile.state.typed }}</b
            ><span>{{ L("skrivna ord", "kirjutatud sõna") }}</span>
          </div>
        </div>
      </UiAppCard>

      <UiAppCard class="profile-page__section">
        <h2>{{ L("Dina bragder", "Sinu saavutused") }}</h2>
        <UiBadgeChip
          v-for="row in badgeRows"
          :key="row.badge.id"
          :badge="row.badge"
          :earned="row.earned"
          :progress="row.progress"
        />
      </UiAppCard>

      <UiAppCard class="profile-page__section">
        <h2>{{ L("Om dig och Siiri", "Sinust ja Siirist") }}</h2>
        <ul v-if="hasFacts" class="profile-page__facts">
          <li v-if="favColor">
            {{ L("🎨 Din favoritfärg är", "🎨 Sinu lemmikvärv on") }} <b>{{ favColor }}</b>
          </li>
          <li v-if="petName">
            {{ L("🐾 Husdjuret i rummet heter", "🐾 Toa lemmiklooma nimi on") }} <b>{{ petName }}</b
            ><template v-if="petKind"> ({{ petKind }})</template>
          </li>
          <li v-if="daysPlayed && isEt()">
            💛 Te olete koos mänginud <b>{{ daysPlayed }}</b> {{ daysPlayed === 1 ? "päev" : "päeva" }}
          </li>
          <li v-else-if="daysPlayed">
            💛 Ni har spelat ihop i <b>{{ daysPlayed }}</b> {{ daysPlayed === 1 ? "dag" : "dagar" }}
          </li>
        </ul>
        <p v-else class="profile-page__facts-empty">
          {{
            L(
              "Ju mer ni pratar och leker, desto mer lär Siiri känna dig!",
              "Mida rohkem te räägite ja mängite, seda paremini Siiri sind tundma õpib!",
            )
          }}
        </p>
      </UiAppCard>

      <div v-if="profile.state.secretsOpen" class="profile-page__secrets">
        <h3 @click="toggleSecrets">
          🤫 {{ secretsFound.length }} {{ L("av", "/") }} {{ SECRETS.length }}
          <span class="profile-page__secrets-close">{{ L("✕ dölj", "✕ peida") }}</span>
        </h3>
        <div
          v-for="secret in SECRETS"
          :key="secret.id"
          class="profile-page__secret"
          :class="{ 'profile-page__secret--hidden': !secretsFound.includes(secret.id) }"
        >
          <span aria-hidden="true">{{ secretsFound.includes(secret.id) ? secret.em : "❔" }}</span>
          <span>
            <template v-if="secretsFound.includes(secret.id)">{{ L(secret.sv, secret.et) }}</template>
            <i v-else>{{ L(secret.hint, secret.hintEt) }}</i>
            <small>{{ secretsFound.includes(secret.id) ? L("Hittad", "Leitud") : "" }}</small>
          </span>
        </div>
        <p class="profile-page__secrets-note">
          {{
            L(
              "Siiri gömmer saker i appen. Vissa hittar man av en slump.",
              "Siiri peidab äppi asju. Mõned leiad juhuslikult.",
            )
          }}
        </p>
      </div>

      <UiAppCard class="profile-page__section">
        <h2>{{ L("Mängijad · Spelare", "Spelare · Mängijad") }}</h2>
        <p>
          {{
            L(
              "Varje spelare har egna poäng, egen figur och egen garderob.",
              "Igal mängijal on oma punktid, oma tegelane ja oma riidekapp.",
            )
          }}
        </p>
        <div class="profile-page__slots">
          <button
            v-for="s in players"
            :key="s.key"
            class="profile-page__slot"
            :class="{ 'profile-page__slot--on': s.current }"
            @click="cloud.requestPlayer(s.key)"
          >
            <span aria-hidden="true">{{ s.info?.avatar || "🦔" }}</span>
            <b>{{ s.name || L("Namnlös", "Nimetu") }}</b>
            <small v-if="s.info"
              >{{ (s.info.xp || 0).toLocaleString("sv-SE") }} p · ⭐{{
                (s.info.stars || 0).toLocaleString("sv-SE")
              }}</small
            >
            <small v-if="s.kind === 'child-pin'">☁️ 🔒 PIN</small>
            <small v-else-if="s.kind === 'child'">☁️ {{ L("familjen", "pere") }}</small>
            <small v-else-if="s.kind === 'adult'">☁️ {{ L("vuxen", "täiskasvanu") }}</small>
            <small v-if="s.current" class="profile-page__slot-current">{{ L("spelar nu", "mängib praegu") }}</small>
          </button>
          <button v-for="m in family" :key="m.id" class="profile-page__slot" :disabled="playBusy" @click="playAs(m)">
            <span aria-hidden="true">{{ m.avatar }}</span>
            <b>{{ m.name }}</b>
            <small>⭐{{ (m.stars || 0).toLocaleString("sv-SE") }}</small>
            <small>{{ L("▶ spela som", "▶ mängi temana") }}</small>
          </button>
          <button class="profile-page__slot" @click="profile.newLocalPlayer('/')">
            <span aria-hidden="true">➕</span>
            <b>{{ L("Ny spelare", "Uus mängija") }}</b>
            <small>{{ L("utan konto", "ilma kontota") }}</small>
          </button>
        </div>
        <p v-if="playErr" role="alert">{{ playErr }}</p>
      </UiAppCard>
      <WhoPlays />

      <UiAppCard v-if="cloud.enabled" class="profile-page__section">
        <h2>{{ L("Perekond · Familj", "Familj · Perekond") }}</h2>
        <template v-if="cloud.isAdult">
          <p v-if="isEt()">
            Oled sisse loginud täiskasvanuna{{ cloud.familyName ? ` (${cloud.familyName})` : "" }}. Kõik pereliikmed,
            sõnad, koodid ja „Lämna över till barnen” on lehel Pere.
          </p>
          <p v-else>
            Du är inloggad som vuxen{{ cloud.familyName ? ` i ${cloud.familyName}` : "" }}. Alla i familjen, glosor,
            koder och ”Lämna över till barnen” finns i Familjen.
          </p>
          <div class="profile-page__row">
            <a class="profile-page__btn profile-page__btn--green" href="/familj">{{ L("👨‍👩‍👧 Familjen", "👨‍👩‍👧 Pere") }}</a>
          </div>
        </template>
        <template v-else-if="cloud.isFamilyDevice">
          <p v-if="isEt()">
            {{ cloud.isLocked ? "🔒 Täiskasvanu on seadme lukustanud. " : "" }}
            {{ cloud.familyName ? `Te mängite peres „${cloud.familyName}”.` : "Te mängite pere kontoga." }}
            Mäng salvestub pere kontole ja sõnad tulevad täiskasvanutelt.
          </p>
          <p v-else>
            {{ cloud.isLocked ? "🔒 Enheten är låst av en vuxen. " : "" }}
            {{ cloud.familyName ? `Ni spelar i ${cloud.familyName}.` : "Ni spelar i familjen." }}
            Spelet sparas i familjekontot och glosorna kommer från de vuxna.
          </p>
          <div class="profile-page__row">
            <UiAppButton variant="green" @click="cloud.openPicker()">{{
              L("👥 Byt spelare", "👥 Vaheta mängijat")
            }}</UiAppButton>
            <a class="profile-page__btn profile-page__btn--ghost" href="/join">{{
              L("➕ Lägg till spelare", "➕ Lisa mängija")
            }}</a>
            <a v-if="cloud.isLocked" class="profile-page__btn profile-page__btn--ghost" href="/familj">{{
              L("🔓 Lås upp", "🔓 Ava lukk")
            }}</a>
          </div>
        </template>
        <template v-else-if="cloud.session">
          <p>
            {{ L("Du är inloggad men inte med i någon familj än.", "Oled sisse loginud, aga pole veel üheski peres.") }}
          </p>
          <div class="profile-page__row">
            <a class="profile-page__btn profile-page__btn--green" href="/familj">{{
              L("👨‍👩‍👧 Skapa familjen", "👨‍👩‍👧 Loo pere")
            }}</a>
          </div>
        </template>
        <template v-else-if="cloud.link?.kind === 'adult'">
          <p>
            {{
              L(
                "Spelet hör till ditt konto, men du är utloggad. Logga in igen så sparas det som vanligt.",
                "Mäng kuulub sinu kontole, aga sa oled välja logitud. Logi uuesti sisse, siis salvestub kõik nagu tavaliselt.",
              )
            }}
          </p>
          <div class="profile-page__row">
            <a class="profile-page__btn profile-page__btn--green" href="/">{{ L("🔑 Logga in", "🔑 Logi sisse") }}</a>
          </div>
        </template>
        <template v-else>
          <p v-if="isEt()">
            {{
              cloud.link
                ? "Mäng kuulub perele, aga seade on välja logitud. Kirjuta perekood uuesti, siis salvestub kõik nagu tavaliselt."
                : "Mängi koos perega: mäng salvestub pere kontole ja liigub kaasa teistesse seadmetesse ning sõnad tulevad täiskasvanutelt. Kas sul on juba konto? Vajuta „Täiskasvanutele”, et sisse logida – seal on ka edusammud, kooli sõnad ja varukoopia."
            }}
          </p>
          <p v-else>
            {{
              cloud.link
                ? "Spelet hör till familjen, men enheten är utloggad. Skriv familjekoden igen så sparas det som vanligt."
                : `Spela med familjen: spelet sparas i familjekontot och följer med till andra enheter, och glosorna kommer
            från de vuxna. Har du redan ett konto? Tryck på För vuxna för att logga in - där finns också
            framsteg, skolans glosor och säkerhetskopia.`
            }}
          </p>
          <div class="profile-page__row">
            <a class="profile-page__btn profile-page__btn--green" href="/join">{{
              L("🔑 Jag har en familjekod", "🔑 Mul on perekood")
            }}</a>
            <a class="profile-page__btn profile-page__btn--ghost" href="/familj">{{
              L("🔐 För vuxna · logga in", "🔐 Täiskasvanutele · logi sisse")
            }}</a>
          </div>
        </template>
      </UiAppCard>

      <!-- språkriktningen (app/utils/lang.ts): vilket språk barnet pratar och vilket det lär sig -->
      <UiAppCard v-if="langBeta || profile.state.home === 'et'" class="profile-page__section">
        <h2>Keel · Språk</h2>
        <div class="profile-page__langs">
          <button
            class="profile-page__lang"
            :class="{ 'profile-page__lang--on': profile.state.home !== 'et' }"
            @click="setHome('sv')"
          >
            <span aria-hidden="true">🇸🇪</span><b>Jag pratar svenska</b><small>och lär mig estniska</small>
          </button>
          <button
            class="profile-page__lang"
            :class="{ 'profile-page__lang--on': profile.state.home === 'et' }"
            @click="setHome('et')"
          >
            <span aria-hidden="true">🇪🇪</span><b lang="et">Ma räägin eesti keelt</b
            ><small lang="et">ja õpin rootsi keelt</small>
          </button>
        </div>
        <p>Det du redan lärt dig och dina stjärnor finns kvar när du byter.</p>
      </UiAppCard>

      <UiAppCard class="profile-page__section">
        <h2 class="profile-page__secret-tap" @click="tapSettingsTitle">
          {{ L("Seaded · Inställningar", "Inställningar · Seaded") }}
        </h2>
        <div class="profile-page__row">
          <UiAppButton variant="ghost" @click="toggleSound">{{
            profile.state.sound ? L("🔊 Ljud på", "🔊 Heli sees") : L("🔇 Ljud av", "🔇 Heli väljas")
          }}</UiAppButton>
          <UiAppButton variant="ghost" @click="toggleTheme">{{ L("🌙 Ljust / mörkt", "🌙 Hele / tume") }}</UiAppButton>
          <UiAppButton variant="ghost" @click="toggleAmbience">{{
            profile.state.amb
              ? L("🎵 Ljudmiljö på", "🎵 Taustahelid sees")
              : L("🎵 Ljudmiljö av", "🎵 Taustahelid väljas")
          }}</UiAppButton>
        </div>
        <p v-if="isEt()">Siiri räägib rootsi keelt Sofie häälega. 🐢 loeb sama sõna aeglasemalt ette.</p>
        <p v-else>
          Siiri talar med den estniska rösten Mari, byggd på studioinspelningar från Tartu universitet. 🐢 ger en
          långsammare inläsning av samma ord.
        </p>
      </UiAppCard>

      <section class="profile-page__actions">
        <button
          v-if="!profile.state.secretsOpen"
          class="profile-page__peek"
          :aria-label="L('Visa dolda hemligheter', 'Näita peidetud saladusi')"
          @click="toggleSecrets"
        >
          🤫
        </button>

        <a class="profile-page__btn profile-page__btn--wide" href="/room">{{
          L("🏠 Siiri tuba · välj Siiris färg och kläder", "🏠 Siiris rum · vali Siiri värv ja riided")
        }}</a>
        <a class="profile-page__btn profile-page__btn--wide" href="/" @click="markLegacyScreen('edit')">{{
          L("✏️ Ändra namn, figur och färg", "✏️ Muuda nime, tegelast ja värvi")
        }}</a>
        <!-- Tillfälligt utkommenterade tills vi vet vad vi vill göra med denna actions meny -->
        <!-- <a class="profile-page__btn profile-page__btn--wide profile-page__btn--ghost" href="/shop"
            >🎪 Laat · Marknaden</a> -->
        <a class="profile-page__btn profile-page__btn--wide profile-page__btn--ghost" href="/trophy">{{
          L("🏆 Skattkammaren", "🏆 Aarded")
        }}</a>
        <!-- Tillfälligt utkommenterade tills vi vet vad vi vill göra med denna actions meny -->
        <!-- <a class="profile-page__btn profile-page__btn--wide profile-page__btn--ghost" href="/"
              @click="markLegacyScreen('words')">📖 Sõnastik · Ordlistan</a> -->
        <!-- utan familjekonton finns Familj-kortet inte: då är det här ingången till det vuxna -->
        <a
          v-if="!cloud.enabled"
          class="profile-page__btn profile-page__btn--wide profile-page__btn--ghost"
          href="/familj"
        >
          {{ L("🔐 För vuxna", "🔐 Täiskasvanutele") }}
        </a>
        <a v-if="profile.state.school" class="profile-page__bigcard" href="/" @click="markLegacyScreen('school')">
          <span class="profile-page__bigcard-emoji" aria-hidden="true">📝</span>
          <span class="profile-page__bigcard-text">
            <b>{{ L("Läxorden · ▶️ Öva", "Koolisõnad · ▶️ Harjuta") }}</b>
            <small>{{ profile.state.school.name }}</small>
          </span>
          <span aria-hidden="true">›</span>
        </a>
      </section>
    </main>
  </UiAppShell>
</template>

<style lang="scss" scoped>
.profile-page__langs {
  display: grid;
  gap: $spacing-2;
  margin-bottom: $spacing-2;
}

.profile-page__lang {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: $spacing-3;
  align-items: center;
  text-align: left;
  padding: $spacing-2 $spacing-3;
  border-radius: $radius-md;
  border: $border-width solid var(--line);
  background: var(--card);
  color: var(--ink);
  font: inherit;
  cursor: pointer;
  @include focus-visible;

  span {
    grid-row: span 2;
    font-size: 2rem;
  }

  small {
    color: var(--muted);
  }

  &--on {
    border-color: var(--moss);
    box-shadow: 0 0 0 0.125rem var(--moss);
  }
}

// Bredd-begränsningen kommer från UiAppShell:s __content-omslag, inte härifrån.
.profile-page {
  &__section {
    margin-top: $spacing-3;
    text-align: left;

    h2 {
      font-size: $font-size-lg;
      margin: 0 0 $spacing-1;
    }

    p {
      margin: 0 0 $spacing-1;
    }
  }

  &__secret-tap {
    cursor: pointer;
    user-select: none;
  }

  &__me {
    text-align: center;
  }

  &__name {
    font-size: 1.625rem; // 26px
    font-weight: 700;
    margin: 0.125rem 0; // 2px
  }

  &__name-audio {
    margin: 0.5rem 0; // 8px
  }

  &__rank-name {
    font-size: $font-size-lg;
    font-weight: 700;
    margin: 0.25rem 0; // 4px
  }

  &__rank-sv {
    color: var(--muted);
    margin: 0;
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(5.75rem, 1fr)); // 92px
    gap: 0.5rem; // 8px
    margin-top: 0.5rem; // 8px
  }

  &__facts {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem; // 8px

    li {
      background: var(--bg2);
      border-radius: $radius-md;
      padding: 0.5rem 0.75rem;
    }
  }

  &__facts-empty {
    color: var(--muted);
    margin: 0;
  }

  &__stat {
    background: var(--bg2);
    border-radius: $radius-md;
    padding: 0.5rem 0.25rem; // 8px, 4px
    text-align: center;

    b {
      display: block;
      font-size: $font-size-xl;
      line-height: 1.1;
    }

    span {
      font-size: $font-size-xs;
      color: var(--muted);
    }
  }

  &__secrets {
    background: linear-gradient(150deg, #6b4fd8, #39236f);
    color: #fff;
    border-radius: $radius-card;
    padding: $spacing-4;
    box-shadow: $shadow-3;
    margin-top: $spacing-3;
    text-align: left;

    h3 {
      margin: 0 0 0.25rem; // 4px
      font-size: $font-size-md;
      cursor: pointer;
    }
  }

  &__secrets-close {
    float: right;
    opacity: 0.65;
    font-weight: 500;
  }

  &__secrets-note {
    color: #c9bcef;
    margin-top: 0.5rem; // 8px
  }

  &__secret {
    display: flex;
    align-items: center;
    gap: 0.5rem; // 8px
    padding: 0.5rem 0; // 8px
    font-weight: 600;

    > span:first-child {
      font-size: $font-size-xl;
      width: 1.875rem; // 30px
      text-align: center;
    }

    small {
      display: block;
      font-weight: 500;
      opacity: 0.8;
      font-size: $font-size-xs;
    }

    &--hidden > span:first-child {
      filter: grayscale(1);
      opacity: 0.5;
    }
  }

  &__slots {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(6rem, 1fr)); // 96px
    gap: 0.625rem; // 10px
    margin-top: 0.5rem; // 8px
  }

  &__slot {
    background: var(--bg2);
    border: $border-width solid var(--line);
    border-radius: $radius-md;
    padding: 0.625rem 0.375rem; // 10px, 6px
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.0625rem; // 1px
    color: var(--ink);
    font: inherit;
    @include focus-visible;

    > span:first-child {
      font-size: $font-size-2xl;
      line-height: 1.1;
    }

    b {
      font-size: $font-size-sm;
    }

    small {
      font-size: $font-size-xs;
      color: var(--muted);
    }

    &--on {
      border-color: var(--moss);
      background: color-mix(in srgb, var(--moss) 14%, var(--card));
    }
  }

  &__slot-current {
    color: var(--moss) !important;
  }

  &__row {
    display: flex;
    gap: 0.5rem; // 8px
    flex-wrap: wrap;
    margin-top: $spacing-3;
  }

  &__peek {
    display: block;
    margin: $spacing-4 auto 0.25rem; // 4px
    background: none;
    border: none;
    font-size: $font-size-lg;
    opacity: 0.28;
    cursor: pointer;
    padding: 0.25rem 0.75rem; // 4px, 12px
    line-height: 1;
    @include focus-visible;

    &:active {
      opacity: 0.7;
    }
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-1;
    border-radius: $radius-md;
    padding: 0.75rem $spacing-4; // 12px, 18px
    font-weight: 600;
    text-decoration: none;
    background: var(--blue);
    color: var(--on-accent);
    box-shadow: 0 0.3125rem 0 var(--blue-ink); // 5px
    @include focus-visible;

    &--green {
      background: var(--moss);
      box-shadow: 0 0.3125rem 0 color-mix(in srgb, var(--moss) 60%, black); // 5px
    }

    &--ghost {
      background: var(--card);
      color: var(--ink);
      border: $border-width solid var(--line);
      box-shadow: $shadow-2;
    }

    &--wide {
      width: 100%;
    }
  }

  &__bigcard {
    display: flex;
    align-items: center;
    gap: 0.75rem; // 12px
    width: 100%;
    text-align: left;
    text-decoration: none;
    padding: 0.875rem 1rem; // 14px, 16px
    margin-top: $spacing-3;
    border-radius: $radius-lg;
    border: $border-width solid var(--honey);
    background: linear-gradient(160deg, #fff3d2, #ffe4a8);
    color: #4a3200;
    box-shadow: 0 0.3125rem 0 rgba(0, 0, 0, 0.14); // 5px
    @include focus-visible;
  }

  &__bigcard-emoji {
    font-size: 2rem; // 32px
    line-height: 1;
  }

  &__bigcard-text {
    flex: 1;
    min-width: 0;

    b {
      display: block;
      font-size: $font-size-lg;
    }

    small {
      display: block;
      font-size: $font-size-sm;
      opacity: 0.8;
    }
  }

  &__actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: $spacing-3;
  }
}
</style>
