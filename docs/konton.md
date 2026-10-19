# Konton och familjen (Supabase)

En familj har vuxna och barn. Varje vuxen har ett eget konto (e-post + lösenord). Barnen har inga
konton – de spelar på enheter som går in med familjens **familjekod**. Allt som spelas sparas på
medlemmen i familjen och följer med mellan enheter. Utan Supabase-nycklar fungerar appen precis som
förut, bara utan konton. Planen och besluten bakom: `docs/plan-konton-v2.md`.

## Så fungerar det

**Första gången** (ny enhet, inget sparat) visas välkomstskärmen före spelet: **Logga in** (förvalt),
**Skapa konto**, **Är du ett barn med en familjekod?** och **Spela utan konto** (sparas bara på
enheten). En vuxen som loggat ut ser välkomstskärmen igen – hens spel visas bara inloggat.

**Vuxna** loggar in med e-post och lösenord. "Glömt lösenordet?" skickar en länk som leder till
Familjen → Konto, där man väljer ett nytt. Konton som bara loggat in med kod i mejlet tidigare väljer
ett lösenord där. Direkt efter inloggningen spelar den vuxna sitt eget spel: finns det på enheten
byts det till det, annars hämtas det från kontot. Ett annat spel som redan fanns på enheten ligger
kvar som en egen spelare.

**Barn** går in med familjekoden → **Vem spelar?** → PIN (om barnet har en). Barnets egen länk (Familjen →
Koder) hoppar över Vem spelar?. Flera barn kan spela på samma enhet.

**Familjen** (`/familj`) är den enda ingången för vuxna – i spelet via **Profil → Familj**. Tre flikar:

- **Familjen:** alla medlemmar som kort. Ett kort öppnar medlemmens sida: **▶ Spela som** (enheten
  byter till medlemmens spel, utan barnets PIN – det som spelas räknas på medlemmen), framsteg, och
  för barn glosor, PIN, enheter, namn och figur. Här finns också Lägg till barn, **Lämna över till
  barnen**, glosor för alla barn och Bjud in en vuxen.
- **Koder:** vad varje kod är till för, familjekoden med QR, barnens egna länkar och vuxen-PIN.
- **Konto:** lösenord, logga ut och radera kontot.

**För vuxna** (Profil → Familj → 🔐 För vuxna, samma `/familj`): utloggad väljer man logga in eller
**Utan konto: spelet på den här enheten** – framsteg (tema för tema, ord att öva), skolans glosor och
säkerhetskopia som kod för spelaren som inte är med i något familjekonto. Inloggad finns samma framsteg
på varje medlems sida, och en lokal spelare på enheten får ett eget kort i Familjen.

**Lämna över till barnen** låser enhetens inloggning: Familjen-sidan försvinner, databasen nekar allt
vuxet och barnen väljer vem som spelar. Den vuxnas eget spel syns inte. Vuxen-PIN låser upp.

**Spelare på enheten:** varje spelare sparas för sig – en medlem (`m:<id>`) eller en lokal spelare
utan konto (`l:<slump>`). Byte sker i **Vem spelar?** (enheter där barnen spelar) eller under
**Profil → Spelare**, där en inloggad vuxen också ser familjens barn som inte spelar på enheten än.

**Synk:** spelet sparas lokalt som förut. Ändringar skickas till kontot 2 sekunder efter senaste
sparning och när appen läggs i bakgrunden. Appen hämtar från kontot vid start, när den får fokus och
när nätet kommer tillbaka. Har två enheter sparat samtidigt slås de ihop (`app/utils/save-merge.ts`).
Glosor från de vuxna blir barnets glosor nästa gång appen öppnas.

## Var det finns

| Del                                              | Fil                                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Tabeller, behörighet (RLS) och funktioner        | `supabase/migrations/` (familj, familj_spelare, spela_som)                           |
| Supabase-klienten                                | `app/utils/supabase.ts`                                                              |
| Spelarna på enheten (sparning, flytt, byte)      | `app/stores/profile.ts`                                                              |
| Synk, inloggning, Vem spelar?, Spela som, lås    | `app/stores/cloud.ts`, `app/utils/save-merge.ts`                                     |
| Välkomstskärmen (startsidan, Familjen, inbjudan) | `app/components/WelcomeGate.vue`, `app/pages/index.vue`                              |
| Familjen                                         | `app/pages/familj.vue`, `app/components/parent/*`, `app/composables/useParentApi.ts` |
| Barnens enheter: familjekod → Vem spelar?        | `app/pages/join.vue`, `app/components/WhoPlays.vue`                                  |
| Inbjudan till en vuxen                           | `app/pages/invite.vue`                                                               |
| Gamla adresser (omdirigeras)                     | `app/pages/parent.vue` → `/familj`, `app/pages/connect.vue` → `/join`                |
| Den gamla appen ↔ synken                         | `window.SiiriCloud` (`app/plugins/cloud.client.ts`)                                  |
| Tester (låtsas-Supabase + Chrome)                | `tests/fake-supabase.mjs`, `tests/e2e/` – `yarn test:e2e`                            |

## Sätta upp Supabase (en gång)

1. Skapa ett projekt på supabase.com. Välj regionen **Europe (Stockholm, eu-north-1)**.
   Under **Security** när projektet skapas:
   - **Enable Data API**: på. Appen använder `supabase-js`.
   - **Automatically expose new tables**: av, som Supabase rekommenderar. Migreringarna ger
     själva exakt de rättigheter som behövs.
   - **Enable automatic RLS**: på, som extra skydd. Migreringarna slår också på RLS för sina tabeller.
2. **Migreringarna:** kör filerna i `supabase/migrations/` i namnordning (`supabase db push`, eller
   klistra in dem i **SQL Editor**). Nya migreringar måste köras innan koden som behöver dem publiceras.
3. **Authentication → Sign In / Providers**
   - **Email**: på. **Confirm email** avgör om ett nytt konto måste bekräftas via mejl innan det
     loggas in – appen klarar båda.
   - **Allow anonymous sign-ins**: på. Det behövs för barnens enheter.
4. **Authentication → URL Configuration**
   - **Site URL**: `https://siilikool.pages.dev`
   - **Redirect URLs**: `https://siilikool.pages.dev/**`, `http://localhost:3000/**` och
     förhandsadresserna (`https://*.siilikool.pages.dev/**`). Länkarna i mejlen leder till `/familj`
     (nytt konto, glömt lösenord) och `/invite` (inbjudan). Gamla länkar till `/parent` omdirigeras.
5. **E-post (SMTP).** Supabases inbyggda e-post skickar bara till medlemmar i projektet och några
   mejl i timmen, och mallarna går inte att ändra utan egen SMTP. Det räcker för att testa själv.
   Innan andra använder appen: koppla en SMTP-tjänst under **Authentication → Emails → SMTP Settings**,
   till exempel Resend (kräver egen domän), Brevo eller Gmail med app-lösenord.

   Lägg till koden i mallarna **Magic Link** och **Confirm signup**, så att inloggning med kod fungerar
   även när appen körs från hemskärmen (där länken öppnas i Safari och inte i appen):

   ```html
   <h2>Logga in på Siilikool</h2>
   <p><a href="{{ .ConfirmationURL }}">Logga in</a></p>
   <p>Eller skriv koden i appen: <strong>{{ .Token }}</strong></p>
   ```

6. **Project Settings → API**: kopiera **Project URL** och den **publika** nyckeln
   (anon/publishable). Använd aldrig `service_role`/`secret`-nyckeln i appen.

## Lokalt

```bash
cp .env.example .env
```

Fyll i `NUXT_PUBLIC_SUPABASE_URL` och `NUXT_PUBLIC_SUPABASE_KEY` i `.env` och starta om `yarn dev`.
Webbläsartesterna (`yarn test:e2e`) använder en egen låtsas-Supabase och rör aldrig det riktiga projektet.

## Cloudflare Pages

Lägg till samma två variabler under **Settings → Environment variables**, för både
Production och Preview. De byggs in i appen vid `yarn generate`, så en ny build behövs
när de ändras.
