# Föräldrakonton (Supabase)

Föräldrar loggar in med e-post, lägger till sina barn, skickar läxlistor och kopplar barnens
enheter med en kod. Barnets spel sparas i kontot och följer med mellan enheter. Utan Supabase-
nycklar fungerar appen precis som förut, bara utan konton.

## Hur det hänger ihop

| Del                                                    | Fil                                                            |
| ------------------------------------------------------ | -------------------------------------------------------------- |
| Tabeller, behörighet (RLS) och funktioner              | `supabase/migrations/20261007000000_konton.sql`                |
| Supabase-klienten                                      | `app/utils/supabase.ts`                                        |
| Synk av spelet och läxlistor (hämta, skicka, slå ihop) | `app/stores/cloud.ts`, `app/utils/save-merge.ts`               |
| Föräldraläget                                          | `app/pages/parent.vue`, `app/components/parent/ChildPanel.vue` |
| Koppla barnets enhet                                   | `app/pages/connect.vue`                                        |
| Den gamla appen ↔ synken                               | `window.SiiriCloud` (`app/plugins/cloud.client.ts`)            |

- **Förälder:** inloggad med e-post. Äger barnprofilerna (`profiles.parent_id`).
- **Barnets enhet:** anonym inloggning, kopplad till en profil med en kod (`device_links`).
  Koden skapas av föräldern, har 6 tecken, gäller 10 minuter och kan bara användas en gång.
- **Föräldern** har alltid sitt eget spel på sin enhet; inloggningen i föräldraläget rör det aldrig.
  Barnens framsteg (ord som sitter/vacklar, läxlistan, svåraste orden) läses under **📊 Framsteg**.
- **Synk:** spelet sparas lokalt som förut. Ändringar skickas till kontot 2 sekunder efter
  senaste sparning, och när appen läggs i bakgrunden. Appen hämtar från kontot vid start, när
  den får fokus och när nätet kommer tillbaka. Har två enheter sparat samtidigt slås de ihop
  (se `app/utils/save-merge.ts`).
- **Läxlistor:** den senaste listan från föräldern blir barnets glosor nästa gång appen öppnas.
- **Nollställ allt** på barnets enhet kopplar bort enheten först. Kontots kopia av spelet
  lämnas orörd, så ett barn kan inte radera den av misstag. Föräldern raderar data i föräldraläget.

## Sätta upp Supabase (en gång)

1. Skapa ett projekt på supabase.com. Välj regionen **Europe (Stockholm, eu-north-1)**.
   Under **Security** när projektet skapas:
   - **Enable Data API**: på. Appen använder `supabase-js`.
   - **Automatically expose new tables**: av, som Supabase rekommenderar. Migreringen ger
     själv exakt de rättigheter som behövs.
   - **Enable automatic RLS**: på, som extra skydd. Migreringen slår också på RLS för sina tabeller.
2. **SQL Editor:** klistra in hela `supabase/migrations/20261007000000_konton.sql` och kör den.
3. **Authentication → Sign In / Providers**
   - **Email**: på.
   - **Allow anonymous sign-ins**: på. Det behövs för barnens enheter.
4. **Authentication → URL Configuration**
   - **Site URL**: `https://siilikool.pages.dev`
   - **Redirect URLs**: lägg till `https://siilikool.pages.dev/parent`,
     `http://localhost:3000/parent` och förhandsadresserna, till exempel `https://*.siilikool.pages.dev/parent`.
5. **E-post (SMTP).** Supabases inbyggda e-post skickar bara till medlemmar i projektet och några
   mejl i timmen, och mallarna går inte att ändra utan egen SMTP. Det räcker för att testa själv
   (inloggning via länken fungerar). Innan andra föräldrar använder appen: koppla en SMTP-tjänst under
   **Authentication → Emails → SMTP Settings**, till exempel Resend (kräver egen domän), Brevo eller Gmail
   med app-lösenord.

   Lägg sedan till koden i **Magic Link**-mallen, så att inloggning fungerar även när appen körs från
   hemskärmen (där länken öppnas i Safari och inte i appen):

   ```html
   <h2>Logga in på Siilikool</h2>
   <p><a href="{{ .ConfirmationURL }}">Logga in</a></p>
   <p>Eller skriv koden i appen: <strong>{{ .Token }}</strong></p>
   ```

   Gör samma ändring i mallen **Confirm signup**, eftersom första inloggningen skapar kontot.

6. **Project Settings → API**: kopiera **Project URL** och den **publika** nyckeln
   (anon/publishable). Använd aldrig `service_role`/`secret`-nyckeln i appen.

## Lokalt

```bash
cp .env.example .env
```

Fyll i `NUXT_PUBLIC_SUPABASE_URL` och `NUXT_PUBLIC_SUPABASE_KEY` i `.env` och starta om `yarn dev`.

## Cloudflare Pages

Lägg till samma två variabler under **Settings → Environment variables**, för både
Production och Preview. De byggs in i appen vid `yarn generate`, så en ny build behövs
när de ändras.
