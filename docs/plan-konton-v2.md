# Plan: konton och familj, version 2

Ersätter det rörigaste i `docs/plan-familj.md`: inloggningen, kopplingen mellan spel och konto, och de
många ingångarna till familjeläget. Databasen (familjer, medlemmar, RLS, PIN med spärr, låsta
inloggningar) behålls – det är flödena och var spelet "bor" som byggs om.

## Vad som är fel i dag

| Problem                                                         | Varför det händer                                                                                                                                                                                                                                                                                                |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framsteg försvinner när webbläsarens data töms**, trots konto | Inloggningen _och_ kopplingen spel ↔ konto sparas bara i `localStorage`. Töms den startar spelet som en ny lokal spelare, och inget hämtar tillbaka kontots spel – man måste själv hitta "Ditt eget spel" i föräldraläget. Har man hunnit spela väljer man mellan två spel och kan råka skriva över det sparade. |
| **Ingen inloggning på startsidan**                              | Första skärmen är "Tere! Vad heter du?" – den skapar alltid en lokal spelare. Konton nås bara inifrån profilen.                                                                                                                                                                                                  |
| **Otydligt för nya**: lokalt eller konto?                       | Inget val visas. Kontot är ett tillägg man hittar senare.                                                                                                                                                                                                                                                        |
| **Otydligt för den som har konto**: hur loggar jag in?          | Vuxna loggar in med e-postlänk/kod i `/parent`, barn med familjekod i `/join` – två olika vägar, inga lösenord.                                                                                                                                                                                                  |
| **Vuxna kan inte se eller spela som andra i familjen**          | Föräldraläget visar barnens framsteg i en flik, men man kan inte öppna ett barns spel eller byta till det.                                                                                                                                                                                                       |
| **Svårt att förstå vem som ingår i familjen**                   | Barn, vuxna, enheter och koder ligger på olika kort; vuxna syns bara som "inbjudna".                                                                                                                                                                                                                             |
| **Många ingångar**                                              | Familj-kortet i profilen (i både Vue och legacy), Vanemale, "Lägg till" i Vem spelar?, `/parent`, `/join`, `/connect`, `/invite`.                                                                                                                                                                                |

## Vad Lyckoplan gör (och vad vi tar)

Lyckoplan: familjen är kontot. Första skärmen är en grind: **"Skapa familj" / "Logga in"** (familjenamn

- lösenord) och längst ner **"Är du ett barn med en familjekod?"**. Barn: kod → **"Vem är du?"** →
  **"Hej Luna!"** + PIN. All data ligger på servern; töms webbläsaren loggar man bara in igen och allt
  finns kvar. En enda flik **Familjen** visar alla medlemmar som kort. En vuxen kan **lämna över**
  enheten till ett barn ("Barnvy") utan barnets PIN; barnets "Logga ut" går tillbaka till den låsta
  vuxenvyn. Inställningar är en enda vy med flikar (Familj · Åtkomst · Konto).

| Tar vi                                                                                                                        | Tar vi inte                                                              |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Grind först: skapa / logga in / barnkod (vi lägger logga in som default före skapa till skillnad från hur det är i Lyckoplan) | Familjenamnet som globalt användarnamn (läcker vilka familjer som finns) |
| Barn: kod → Vem är du? → PIN, plus **direktlänk/QR per barn** som hoppar över väljaren                                        | Ingen återställning av lösenord (vi har e-post via Supabase)             |
| Servern är källan; enheten är bara en cache                                                                                   | Inloggning = admin på enheten i 30 dagar                                 |
| En flik/sida Familjen med alla medlemmar                                                                                      | Ingen spärr mot gissningar (vi har redan 5 fel → 15 min)                 |
| "Lämna över till Luna" i stället för separat lås                                                                              | Hemlig "Logga in som admin"-länk inne i PIN-rutan                        |
| En rad förklaring per kod (lösenord, barnkod, barnets PIN, vuxen-PIN)                                                         |                                                                          |

Siilikool ska dessutom fungera **utan konto och utan nät** – det gör inte Lyckoplan. Därför blir det
lokala spelet ett tydligt eget val på grinden, inte något man hamnar i av misstag.

## Så upplevs det (förslaget)

**Första gången (ny enhet, inget sparat):** en välkomstskärm med Siiri, före allt annat:

> **Tere!** Hur vill du spela?
>
> - **🔑 Logga in** – vuxen (e-post + lösenord) eller **Jag är ett barn** (barnkod)
> - **🏠 Skapa familjekonto** – spelen sparas och följer med mellan enheter, de vuxna lägger in glosor
> - **Spela utan konto** – sparas bara på den här enheten (går att koppla till ett konto senare)

**Vuxen, återkommande:** Logga in → e-post + lösenord ("Glömt lösenordet?" skickar en
länk). Direkt efter inloggning hämtas den vuxnas spel – inget att koppla. Finns det redan ett lokalt
spel på enheten frågar appen en gång: _slå ihop_ (förvalt) eller _använd kontots_.

**Barn:** "Jag är ett barn" → skriv barnkoden (eller skanna QR) → **Vem är du?** → (PIN om barnet har en)
→ spelet hämtas. QR/direktlänk per barn hoppar över väljaren.

**Töms webbläsaren:** välkomstskärmen igen → logga in → allt är tillbaka. Ett barns enhet: barnkoden igen.

**Familjen – en enda ingång.** Profil-chipet/avataren uppe till vänster öppnar **Familjen**:

- alla medlemmar som kort (vuxna och barn, med figur, namn, märke, senast spelat)
- vuxen (olåst) trycker på ett kort → **medlemssidan**: framsteg, glosor, PIN, enheter, ändra namn/figur,
  och **▶ Spela som Luna** (enheten byter till Lunas spel direkt – inga koder)
- **🔒 Lämna över till barnen**: låser enheten (vuxen-PIN för att låsa upp) och visar Vem spelar?
- **+ Lägg till** barn eller vuxen (vuxen = inbjudningslänk), **Koder och inloggning** (barnkod, QR,
  direktlänkar, vuxen-PIN) och **Konto** (lösenord, logga ut, radera) – som flikar på samma sida

**Byta spelare** sker alltid via **Vem spelar?** (samma ruta överallt): familjens medlemmar på enheten,
"Lägg till" och – för en olåst vuxen – hela familjen.

## Tekniskt

| Del                          | Ändring                                                                                                                                                                                                                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Inloggning, vuxen**        | Supabase **e-post + lösenord** (inbyggt; e-postlänken blir "glömt lösenordet"). Befintliga konton (bara e-postlänk) får "Välj lösenord" efter nästa inloggning.                                                                                                                                               |
| **Inloggning, barn**         | Som i dag (anonym inloggning + `family_lookup` + `choose_member`), plus direktlänk `?kod=ABC234&barn=<id>` som hoppar över väljaren.                                                                                                                                                                          |
| **Spelet "bor" i medlemmen** | I dag: tre lokala profilplatser + länkar i `siiri-eesti-cloud`. Nytt: enheten har en **cache per medlem** (`siiri-member-<id>`) och en lokal spelare utan konto (`siiri-local`). Vem spelar? listar medlemmarna; profilplatserna försvinner som begrepp. Den gamla appens `S` pekar på den medlem som spelar. |
| **Hämta vid inloggning**     | `init()`/inloggning: hämta den vuxnas medlem och de barn som valts på enheten; är cachen tom → ladda kontots spel, finns båda → slå ihop (`mergeSaves`). Ingen manuell "Spara mitt spel".                                                                                                                     |
| **Spela som**                | Olåst vuxen läser/skriver redan alla medlemmar i familjen (RLS `is_adult_of`). "Spela som Luna" laddar Lunas medlem i cachen och synkar mot den.                                                                                                                                                              |
| **Lämna över**               | Befintligt lås (`lock_session`) + öppna Vem spelar? med barnen. Lås upp = vuxen-PIN, som i dag.                                                                                                                                                                                                               |
| **Sidor**                    | `/` (spelet, med välkomstgrind), `/familj` (ersätter `/parent`), `/join` (barnkod, QR), `/invite`. `/connect` och `/parent` blir omdirigeringar. Legacy: Familj-kortet och Vanemale-länken tas bort.                                                                                                          |
| **Databas**                  | Ny migrering: `members.last_played` (för korten i Familjen). Inget annat i RLS behöver ändras.                                                                                                                                                                                                                |

## Ordning

| #   | Steg                                                                                                                                                                                            | Tid     |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| 0   | **Snabbfix mot dataförlust:** hämta den vuxnas spel automatiskt vid inloggning; "Logga in" på första skärmen; säkrare förval i "Det finns redan ett spel" (slå ihop, aldrig tyst överskrivning) | 0,5–1 d |
| 1   | Välkomstgrind + inloggning med e-post och lösenord + "glömt lösenordet" + "Välj lösenord" för befintliga konton                                                                                 | 1,5 d   |
| 2   | Spelet bor i medlemmen: cache per medlem, Vem spelar? som enda växlare, bort med profilplatser/länkar (flytt av befintliga lokala spel)                                                         | 2–3 d   |
| 3   | Familjen-sidan: medlemskort, medlemssida (framsteg, glosor, PIN, enheter, spela som), lämna över, koder, konto                                                                                  | 2 d     |
| 4   | Städning: en ingång, omdirigeringar, legacy Familj-kort/Vanemale bort, `docs/konton.md` skrivs om                                                                                               | 0,5 d   |
| 5   | Hela flödet testat: ny enhet, tömd webbläsare, barn på egen enhet, delad iPad, spela som, flera vuxna                                                                                           | 1 d     |

**Totalt cirka 8–9 dagar.** Steg 0 går att göra direkt och fristående.

## Beslut

| Fråga                 | Beslut                                                                                               |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| Konto                 | **Ett konto per vuxen** (e-post + lösenord)                                                          |
| Användarnamn          | **E-posten är användarnamnet** – ingen Edge Function behövs                                          |
| Barnets PIN           | **Fortsatt valfri**                                                                                  |
| Spela utan konto      | **Kvar**, men tydligt märkt "sparas bara på den här enheten", med "Koppla till familjen" i profilen  |
| Spela som någon annan | **Allt som görs på ett konto räknas på det kontot** – spelar en vuxen som Luna är det Lunas framsteg |

## Tillägg

Allt görs genom att genomgående inte skapa mer kod i app.js om det går utan via Vue komponenter och composables. Vi vill hellre minska på app.js än att utöka den. Vi använder i så stor utsträckning som möjligt återanvändningsbara komponenter.

## Tester

`yarn test:e2e` bygger appen mot en låtsas-Supabase (`tests/fake-supabase.mjs`: PGlite med projektets
migreringar och RLS) och kör webbläsartesterna i `tests/e2e/` med Chrome: välkomstskärmen, nytt
konto, inloggning på en tömd enhet, en annan spelare på samma enhet, flytten från de gamla
profilplatserna, barnens enheter (flera barn, PIN, Vem spelar?, borttagen enhet), låst enhet, ny
spelare och två enheter som spelar samtidigt, och Familjen-sidan (`familjen.test.mjs`: medlemskort, Spela som,
Lämna över, barnens egna länkar, Koder och Konto, inloggning på sidan). `yarn test:e2e --no-build` återanvänder bygget.

## Gjort i steg 3

- Familjen-sidan ligger kvar på `/parent` tills steg 4 (då blir den `/familj` med omdirigering).
- Flikar: **Familjen** (medlemskort → medlemssidan, lägg till barn, Lämna över, glosor för alla barn, bjud
  in vuxen), **Koder** (en rad per kod, familjekoden, barnens egna länkar, vuxen-PIN), **Konto**.
- **Spela som** kräver migreringen `20261019000000_spela_som.sql`: en olåst vuxen väljer ett barn på sin
  enhet utan barnets PIN, och valet registreras på enheten så att spelet synkar även efter Lämna över.
- `members.last_played` behövdes inte – korten visar `updated_at` (när spelet senast sparades).

## Gjort i steg 4

- Familjen ligger på `/familj`. `/parent` (också länkar i gamla mejl) och `/connect` omdirigeras med
  samma `?…` och `#…`.
- En ingång: **Profil → Familj → 👨‍👩‍👧 Familjen**. Föräldraläget-länken i den gamla appens "För vuxna"
  (Vanemale) och "Lås enheten" i profilen är borttagna – Lämna över finns i Familjen.
- Profil → Spelare visar för en inloggad vuxen också familjens barn som inte spelar på enheten, med
  "spela som".
- Inbjudan använder välkomstskärmen (utan familjenamn, familjekod och Spela utan konto); den gamla
  `LoginCard.vue` är borttagen. Efter att man gått med hämtas den vuxnas eget spel som vid inloggning.
- Ett namn på koden: **familjekod** (tidigare också "barnkod" på välkomstskärmen).
- `docs/konton.md` är omskriven efter hur det fungerar nu.
- Den gamla appens "För vuxna" (`parentScreen`, vuxenfrågan och säkerhetskopian, ~350 rader) är flyttad
  till Vue: `ParentProgressView` (framsteg, tema för tema, ord att öva) på medlemssidan och
  `ParentDevicePanel` (samma, plus skolans glosor och säkerhetskopia) för spelare utan konto. Profilen har
  ingen egen För vuxna-knapp längre när konton är påslagna – Familj-kortet är ingången.
