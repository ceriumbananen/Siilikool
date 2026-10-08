# Plan: familjekonto

Ersätter kopplingen "en enhet + engångskod → ett barn" med **en familj där alla är medlemmar**.
Vuxna loggar in med e-postlänk, barn med **familjekod → "Vem spelar?" → (valfri) PIN**.
Inspirerat av Lyckoplan, men med behörigheten i databasen (Supabase RLS).

## Beslut

| Fråga              | Beslut                                                                                                                                                                            |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PIN för barn       | **Valfri** per barn                                                                                                                                                               |
| Glosor             | **Både och**: en lista gäller ett barn eller alla barn                                                                                                                            |
| Förälderns spel    | **Eget spel som synkas** mellan förälderns enheter (vuxen medlem)                                                                                                                 |
| Lås på delad enhet | **B: låst session i databasen.** "Lås" låser den här enhetens inloggning; databasen nekar då allt vuxet. Vuxen-PIN (5 fel → spärr 15 min) låser upp. Andra enheter påverkas inte. |

## Så upplevs det

**Vuxen (första gången):** `/parent` → e-post → länk/kod → "Skapa familj" (familjenamn) → lägg till barn
(namn, figur, valfri PIN) → välj vuxen-PIN för låset → få **familjekoden** (6 tecken, t.ex. `ABC-234`) och en QR-kod.
Förälderns eget spel på enheten blir hans/hennes medlemsspel i familjen.

**Fler vuxna:** inbjudningslänk från föräldraläget → e-postlänk → med i familjen.

**Barn (vilken enhet som helst):** Profil → **Familj** → "Jag har en familjekod" → skriv koden
(eller skanna QR) → **"Vem spelar?"** (familjens barn med namn och figur) → PIN om barnet har en → spelet
hämtas. Enheten kommer ihåg barnet.

- **Stängt fliken/rensat webbläsaren/ny enhet:** samma sak igen – familjekod + namn. Föräldern behöver inte göra något.
- **Flera barn på samma enhet:** "Vem spelar?" visar barnen som valts på enheten + "Lägg till spelare".
- **Byta spelare:** Profil → Spelare (som idag, men med familjens namn).

**Delad familje-iPad:** vuxen inloggad → allt syns. **Lås** → enhetens inloggning markeras som låst i
databasen: föräldrafunktionerna försvinner och databasen nekar allt vuxet (glosor, barn, familjekod, andra
barns spel), även om någon fipplar i webbläsaren. "Vem spelar?" visar barnen (med deras PIN om de har en).
**Lås upp** → vuxen-PIN, som kontrolleras av databasen (5 fel → spärr 15 min). Förälderns telefon påverkas
inte – det är bara iPadens inloggning som är låst.

**Vad som syns var**

|                                          | Vuxen (olåst) | Vuxen (låst) / barn         |
| ---------------------------------------- | ------------- | --------------------------- |
| Eget spel                                | ✅            | ✅ (barnets)                |
| Barnens framsteg                         | ✅            | –                           |
| Skapa/ta bort glosor                     | ✅            | – (barnet övar och lyssnar) |
| Familjekod, barn, PIN, enheter, inbjudan | ✅            | –                           |
| Vanemale, Admin                          | ✅            | –                           |

## Databas (ersätter `profiles`, `device_links`, `pair_codes`)

| Tabell            | Innehåll                                                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `families`        | `id`, `name`, `child_code` (unik, kan bytas), `adult_pin_hash`, `created_at`                                                                                             |
| `family_adults`   | `user_id` (vuxen inloggning) → `family_id`                                                                                                                               |
| `members`         | `id`, `family_id`, `kind` (`adult`/`child`), `user_id` (vuxens inloggning, för vuxna), `name`, `avatar`, `pin_hash` (valfri, barn), `data` (spelet), `ver`, `updated_at` |
| `device_members`  | `session_id` (enhetens inloggning – anonym på barnenhet eller låst vuxen) + `member_id`, `label`, `created_at` – vilka barn som valts på enheten (flera per enhet)       |
| `word_lists`      | `id`, `family_id`, `member_id` (**null = alla barn**), `name`, `words`, `days`, `created_at`                                                                             |
| `invites`         | `token`, `family_id`, `expires_at` – för fler vuxna                                                                                                                      |
| `locked_sessions` | `session_id`, `family_id`, `locked_at` – vuxna inloggningar som är låsta                                                                                                 |
| `pin_attempts`    | felräkning per barn/familj: 5 fel → spärr 15 min                                                                                                                         |

**Behörighet (RLS)**

- Vuxen i familjen: läser och skriver allt i familjen.
- Barnenhet **och låst vuxen inloggning**: läser och sparar bara spelet för barnen som valts på enheten,
  läser deras glosor (egna + "alla barn"). Kan aldrig skriva glosor, familj eller andra barn. Varje vuxen
  regel kräver att inloggningen inte är låst (`session_id` i `auth.jwt()` finns inte i `locked_sessions`).
- Utloggad: ingenting.

**Funktioner (RPC)**

| Funktion                                                     | Vem                | Gör                                                               |
| ------------------------------------------------------------ | ------------------ | ----------------------------------------------------------------- |
| `create_family(name)`                                        | vuxen              | familj + vuxen medlem + familjekod                                |
| `family_lookup(code)`                                        | barnenhet (anonym) | familjens namn + barnens namn, figur och om de har PIN            |
| `choose_member(code, member, pin)`                           | barnenhet          | kontrollerar kod + PIN (med spärr), lägger till barnet på enheten |
| `lock_session()`                                             | vuxen              | låser den här enhetens inloggning                                 |
| `unlock_session(pin)`                                        | låst vuxen         | kontrollerar vuxen-PIN (med spärr) och låser upp                  |
| `rotate_child_code()`, `set_member_pin()`, `set_adult_pin()` | vuxen              | inställningar                                                     |
| `create_invite()`, `accept_invite(token)`                    | vuxen              | fler vuxna                                                        |
| `delete_my_account()`                                        | vuxen              | sista vuxna → hela familjen raderas                               |

## Appen

**Sidor**

- `/parent` – föräldraläget: logga in, skapa familj, barn (framsteg, glosor, PIN, enheter), familjekod + QR,
  inbjudan, vuxen-PIN, lås, konto.
- `/join` – familjekod → "Vem spelar?" → PIN (ersätter `/connect`).
- `/invite?t=…` – vuxen tar emot inbjudan.

**I spelet (den gamla appen)**

- Profil → kortet **Familj**: utloggad: "Jag är vuxen" / "Jag har en familjekod". Barnenhet: familjens namn
  och "Byt spelare". Vuxen: "Föräldraläget" och "Lås"/"Lås upp".
- "Vanemale", "Admin" och glosinklistringen visas bara för vuxen i olåst läge (eller på en enhet utan familj,
  som idag).
- Profilplatserna (3 per enhet) blir familjens spelare på enheten.

## Återanvänds / tas bort

| Återanvänds                                                                       | Tas bort                                                                     |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Synken (`app/stores/cloud.ts`): hämta, skicka, `ver`, sammanslagning vid konflikt | Engångskoder per enhet (`pair_codes`, `create_pair_code`, `claim_pair_code`) |
| `app/utils/save-merge.ts`, `app/utils/progress.ts`, `app/utils/word-list.ts`      | `device_links` (ersätts av `device_members`)                                 |
| Framstegsfliken och läxlistorna i `ChildPanel.vue` (anpassas)                     | `/connect` (ersätts av `/join`)                                              |
| `LinkChoice.vue` – när ett barn väljs på en enhet där det redan spelats           |                                                                              |
| Testmiljön (PGlite + låtsas-Supabase + Chrome)                                    |                                                                              |

Inget av det nuvarande kontosystemet är i bruk hos riktiga användare, så tabellerna kan göras om fritt.
Spel som bara finns lokalt påverkas inte.

## Ordning och tid

| #   | Steg                                                                                                   | Tid     |
| --- | ------------------------------------------------------------------------------------------------------ | ------- |
| 1   | Migrering: tabeller, RLS, funktioner, låsta sessioner, PIN-spärr + tester i PGlite                     | 1,5–2 d |
| 2   | Synken byggs om till medlemmar (en enhet kan ha flera barn)                                            | 0,5 d   |
| 3   | Föräldraläget: skapa familj, barn, PIN, familjekod/QR, glosor (barn/alla), framsteg, enheter, inbjudan | 1,5 d   |
| 4   | `/join`, "Vem spelar?", lås/lås upp                                                                    | 1 d     |
| 5   | Den gamla appen: Familj-kortet, dölja föräldradelar, spelare = medlemmar, glosor från familjen         | 0,5–1 d |
| 6   | Hela flödet testat med flera enheter, delad iPad, låsning, flera vuxna                                 | 1 d     |

**Totalt cirka 6–7 dagar.**

## Att känna till

- **Låset (B)** gäller en inloggning, inte hela kontot. Glömd vuxen-PIN: logga ut och in igen med e-postlänk
  (ny inloggning = olåst), och byt PIN i föräldraläget. Barnenheter (familjekod) har aldrig vuxenrättigheter.
- **Kräver att Supabase skickar `session_id` i inloggningen** (gör det som standard) – kontrolleras i steg 1.
- **Familjekoden** ger den som har den barnens förnamn och figurer. Den kan bytas i föräldraläget; enheter som
  redan valt ett barn påverkas inte förrän föräldern tar bort dem.
- **Utan PIN** kan syskon spela på varandras profiler på samma enhet.
- **Högst tre spelare per enhet** (den gamla appens profilplatser) – kan utökas senare.
