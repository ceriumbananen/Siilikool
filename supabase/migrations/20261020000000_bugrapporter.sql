-- Buggrapporter: en liten 🐛-knapp i spelet (alla profiler, barn som vuxna) som skickar en
-- rapport hit. Ingen i appen kan läsa tillbaka rapporter - det är en brevlåda, inte en lista.
-- Jag (Claude) läser dem med service-role-nyckeln via ett lokalt skript (scripts/buggar.mjs),
-- aldrig via klientens anon-nyckel.

create table public.bug_reports (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  reporter_user_id  uuid references auth.users (id) on delete set null,
  profile_name      text not null default '' check (char_length(profile_name) <= 40),
  category          text not null check (category in ('confused', 'sound', 'image', 'stuck', 'other')),
  note              text check (char_length(note) <= 2000),
  screen            text not null default '' check (char_length(screen) <= 80),
  last_audio        text check (char_length(last_audio) <= 200),
  console_errors    jsonb not null default '[]'::jsonb check (jsonb_typeof(console_errors) = 'array'),
  device            jsonb not null default '{}'::jsonb check (jsonb_typeof(device) = 'object'),
  status            text not null default 'open' check (status in ('open', 'done'))
);
create index bug_reports_status_idx on public.bug_reports (status, created_at desc);

alter table public.bug_reports enable row level security;

-- Börjar från noll (se 20261007000000_konton.sql för samma mönster). Måste gå att skicka in
-- även helt utan Supabase-session: "Spela utan konto" (usePlayLocal.ts) skapar aldrig någon
-- inloggning alls, inte ens anonym - då går anropet som rollen "anon". reporter_user_id blir
-- då null (går inte att förfalska någon annans id: kollas mot auth.uid(), null mot null).
-- Ingen får läsa, ändra eller radera en rapport - det görs bara med service-role-nyckeln,
-- utanför RLS (scripts/buggar.mjs).
revoke all on public.bug_reports from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant insert on public.bug_reports to anon, authenticated;

create policy "buggrapporter: skicka in" on public.bug_reports for insert to anon, authenticated
  with check (reporter_user_id is not distinct from auth.uid());
