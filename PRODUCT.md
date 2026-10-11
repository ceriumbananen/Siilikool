# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

Installerbar PWA (`public/manifest.webmanifest`, porträttläge, standalone), byggd med `nuxt generate` till statiska filer på Cloudflare Pages. Spelas på mobil och surfplatta, ofta en delad iPad i familjen; desktop stöds.

## Users

- **Barnet (huvudanvändare):** 7–10 år, läser själv och kan stava korta svar. Svensktalande barn i Sverige med estnisk släkt som lär sig estniska hemma, för att kunna prata med familjen och klara sig på resor i Estland. Spelar själv, ofta på en enhet som delas med syskon (högst tre spelare per enhet).
- **Föräldern/den vuxna:** skapar familjen, lägger till barn, skickar läxlistor (glosor), följer framsteg och låser vuxendelarna på delade enheter. Har också ett eget spel som synkas.

## Product Purpose

Siilikool lär svensktalande barn estniska genom ett spel med igelkotten Siiri: ord, meningar, uttal och en resa genom Estland. Framgång är att barnet vill komma tillbaka av egen lust, att orden sitter (ordminnet skiljer på ord som sitter och ord som vacklar) och att föräldern kan styra vad barnet övar på.

Publiken är öppen: vilka familjer som helst ska kunna använda appen, inte bara den egna.

## Positioning

- **Förälderns läxord i spelet:** glosor som föräldern skickar vävs in i de vanliga temana, stationerna, Duell och Sõnasadu, inte i en separat övningslista.
- **Svenska → estniska direkt:** inget engelskt mellanspråk; byggt för svensktalande barn.
- **En resa genom Estland:** Teekond med riktiga orter, souvenirer och kultur som kopplar språket till släkten och landet.
- **Siiri som kompis:** motivationen bärs av Siiri (rummet Tuba, kläder, reaktioner, marknaden Laat), inte av streaks eller press.

## Operating Context

- Spelet startar direkt utan konto; framsteg sparas lokalt (localStorage).
- Familjekonto (Supabase, valfritt): vuxen loggar in med e-postlänk/kod, barn ansluter med familjekod → "Vem spelar?" → valfri PIN. Synk mellan enheter med sammanslagning vid konflikt. Se `docs/konton.md` och `docs/plan-familj.md`.
- Lås på delad enhet: vuxen-PIN låser upp föräldradelarna på den enheten.
- Används hemma, i bilen, i sommarstugan och på resa i Estland, ofta utan nät.

## Capabilities and Constraints

- **Innehåll:** 16 teman (bl.a. tere, pere, toit, loomad, värvid, numbrid, kool, riided, sõidukid, tunded), meningar, namn, Teekond-orter, Duell, Sõnasadu, butik/marknad, souvenirer, badges och Siiris rum.
- **Uttal:** varje ord ska ha riktigt estniskt uttal i normal och långsam takt (`public/audio/clips/normal`, `slow`); uttal hämtas för nya glosor när läxlistan uppdateras.
- **Offline:** spelet ska fungera utan nät. Appens filer cachas i förväg av service workern; ljudet (≈18 MB) hämtas vid behov.
- **Konton är valfria:** allt i spelet fungerar utan konto; konton finns för synk, läxor och framsteg.
- **Inga köp och ingen reklam,** varken nu eller senare.
- **Teknik:** Nuxt 4 SPA (`ssr: false`), Vue 3, Pinia. Det mesta av spelet ligger fortfarande i den gamla appen (`public/legacy/app.js`, `data.js`, `style.css`) och flyttas gradvis till Vue; föräldrasidorna (`/parent`, `/join`, `/invite`) är Vue med stil avgränsad till `.page` i `app/assets/css/konto.css`.
- **Gränssnittsspråk:** svenska; lärospråket är estniska.
- **Termer:** Siiri (igelkotten), Tuba (rummet), Laat (Marknaden), Teekond (resan), Duell, Sõnasadu, glosor/läxord, tema, station, souvenir, badge, familjekod, föräldraläget.

## Brand Commitments

- Namnet **Siilikool** och huvudfiguren **Siiri**, en igelkott, är fasta.
- Ton: varm och lekfull mot barnet; tydlig och lugn mot föräldern.

## Evidence on Hand

- Spelets innehåll och ljud: `public/legacy/data.js`, `public/audio/`.
- Ikoner: `public/icons/`.
- Inga användarcitat, recensioner, användarsiffror eller pressomnämnanden finns. Hitta inte på sådana.

## Product Principles

1. **Lust före plikt.** Barnet kommer tillbaka för att Siiri och resan är roliga, inte för att streaks eller skuld driver dem.
2. **Föräldern styr innehållet, barnet styr leken.** Läxorden ska dyka upp naturligt i spelet; föräldraverktygen får aldrig kännas som en skolportal för barnet.
3. **Örat först.** Riktigt estniskt uttal finns överallt där ett ord visas.
4. **Fungerar ändå.** Utan nät, utan konto, på en delad iPad: spelet ska alltid gå att starta och spela.
5. **Barnsäkert på riktigt.** Inga köp, ingen reklam, inga vuxenfunktioner som går att nå av misstag.

## Accessibility & Inclusion

- Läsare på 7–10-årsnivå: korta instruktioner, ljud som stöd för text, stora träffytor för små fingrar.
- Släktskap och familjeformer varierar; flera vuxna och syskon i samma familj stöds.
