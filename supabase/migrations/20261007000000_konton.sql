-- Siilikool: föräldrakonton, barnprofiler, läxlistor och koppling av barnens enheter.
-- Körs en gång i Supabase: SQL Editor → klistra in → Run (eller `supabase db push`).
--
-- Modell
--   * En förälder loggar in (e-postlänk) och äger barnprofilerna (profiles.parent_id).
--   * Barnets enhet loggar in anonymt och kopplas till en profil med en kod (device_links).
--   * Läxlistor skapas av föräldern och läses av barnets enhet (school_lists).
--   * Spelets data (S i appen) ligger i profiles.data; ver räknas upp vid varje sparning så
--     att två enheter som sparar samtidigt upptäcks (appen slår ihop och försöker igen).

-- ============ tabeller ============

create table public.profiles (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null default '' check (char_length(name) <= 40),
  avatar      text not null default '🦔' check (char_length(avatar) <= 16),
  data        jsonb not null default '{}'::jsonb,
  ver         integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index profiles_parent_idx on public.profiles (parent_id);

create table public.school_lists (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  name        text not null default 'Veckans ord' check (char_length(name) <= 40),
  words       jsonb not null default '[]'::jsonb
              check (jsonb_typeof(words) = 'array' and jsonb_array_length(words) <= 40),
  days        integer not null default 14 check (days between 3 and 60),
  created_at  timestamptz not null default now()
);
create index school_lists_profile_idx on public.school_lists (profile_id, created_at desc);

create table public.device_links (
  device_user uuid primary key references auth.users (id) on delete cascade,
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  label       text not null default '' check (char_length(label) <= 60),
  created_at  timestamptz not null default now()
);
create index device_links_profile_idx on public.device_links (profile_id);

-- kopplingskoder läses och skrivs bara av funktionerna nedan
create table public.pair_codes (
  code        text primary key,
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  expires_at  timestamptz not null
);

create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ============ hjälpfunktioner för behörighet ============

create function public.is_anonymous() returns boolean
language sql stable set search_path = '' as $$
  select coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false);
$$;

create function public.is_parent_of(p uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = p and parent_id = auth.uid());
$$;

-- föräldern, eller en enhet som är kopplad till profilen
create function public.can_access_profile(p uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.is_parent_of(p)
      or exists (select 1 from public.device_links where profile_id = p and device_user = auth.uid());
$$;

-- ============ behörighet (row level security) ============

alter table public.profiles     enable row level security;
alter table public.school_lists enable row level security;
alter table public.device_links enable row level security;
alter table public.pair_codes   enable row level security;

-- ============ rättigheter ============
-- Börjar från noll och ger inloggade exakt det appen behöver – samma resultat oavsett om
-- projektet ger nya tabeller rättigheter automatiskt ("Automatically expose new tables") eller
-- inte. Utloggade (anon) får ingenting. Vilka rader som får läsas och ändras avgörs av reglerna nedan.
revoke all on public.profiles, public.school_lists, public.device_links, public.pair_codes from anon, authenticated;
grant usage on schema public to authenticated;
grant select, insert, delete on public.profiles to authenticated;
grant update (name, avatar, data, ver) on public.profiles to authenticated;   -- ägaren (parent_id) kan aldrig ändras
grant select, insert, update, delete on public.school_lists to authenticated;
grant select, delete on public.device_links to authenticated;                -- nya kopplingar bara via claim_pair_code
-- pair_codes: inga rättigheter alls – bara funktionerna nedan rör tabellen

-- profiler: föräldern och kopplade enheter läser och sparar; bara föräldern skapar och raderar.
-- parent_id prövas direkt på raden: en ny rad (insert … returning) syns inte än för hjälpfunktionen.
create policy "profiler: läsa" on public.profiles for select to authenticated
  using (parent_id = auth.uid() or public.can_access_profile(id));
create policy "profiler: skapa" on public.profiles for insert to authenticated
  with check (parent_id = auth.uid() and not public.is_anonymous());
create policy "profiler: spara" on public.profiles for update to authenticated
  using (parent_id = auth.uid() or public.can_access_profile(id))
  with check (parent_id = auth.uid() or public.can_access_profile(id));
create policy "profiler: radera" on public.profiles for delete to authenticated
  using (parent_id = auth.uid());

-- läxlistor: barnets enhet läser, föräldern skriver
create policy "läxlistor: läsa" on public.school_lists for select to authenticated
  using (public.can_access_profile(profile_id));
create policy "läxlistor: skapa" on public.school_lists for insert to authenticated
  with check (public.is_parent_of(profile_id) and not public.is_anonymous());
create policy "läxlistor: ändra" on public.school_lists for update to authenticated
  using (public.is_parent_of(profile_id)) with check (public.is_parent_of(profile_id));
create policy "läxlistor: radera" on public.school_lists for delete to authenticated
  using (public.is_parent_of(profile_id));

-- kopplade enheter: enheten själv och föräldern ser och kan ta bort kopplingen.
-- Nya kopplingar skapas bara via claim_pair_code.
create policy "enheter: läsa" on public.device_links for select to authenticated
  using (device_user = auth.uid() or public.is_parent_of(profile_id));
create policy "enheter: ta bort" on public.device_links for delete to authenticated
  using (device_user = auth.uid() or public.is_parent_of(profile_id));

-- ============ funktioner som appen anropar ============

-- föräldern skapar en kod (6 tecken, giltig 10 minuter) för att koppla ett barns enhet
create function public.create_pair_code(p_profile uuid) returns text
language plpgsql security definer set search_path = '' as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   -- inga 0/O, 1/I som går att blanda ihop
  v_code text;
  v_rand bytea;
begin
  if auth.uid() is null or public.is_anonymous() or not public.is_parent_of(p_profile) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  delete from public.pair_codes where profile_id = p_profile or expires_at < now();
  loop
    v_rand := uuid_send(gen_random_uuid());        -- de första sex byten är slumpmässiga
    v_code := '';
    for i in 0..5 loop
      v_code := v_code || substr(alphabet, (get_byte(v_rand, i) % 32) + 1, 1);
    end loop;
    begin
      insert into public.pair_codes (code, profile_id, expires_at)
        values (v_code, p_profile, now() + interval '10 minutes');
      exit;
    exception when unique_violation then
      -- koden fanns redan: ta en ny
    end;
  end loop;
  return v_code;
end $$;

-- barnets enhet (anonym inloggning) löser in koden och kopplas till profilen
create function public.claim_pair_code(p_code text, p_label text default '') returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_profile uuid;
begin
  if auth.uid() is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  delete from public.pair_codes
    where code = upper(replace(trim(p_code), ' ', '')) and expires_at > now()
    returning profile_id into v_profile;
  if v_profile is null then
    raise exception 'invalid or expired code' using errcode = 'P0002';
  end if;
  insert into public.device_links (device_user, profile_id, label)
    values (auth.uid(), v_profile, left(coalesce(p_label, ''), 60))
    on conflict (device_user) do update
      set profile_id = excluded.profile_id, label = excluded.label, created_at = now();
  return v_profile;
end $$;

-- föräldern raderar sitt konto: profiler, läxlistor och kopplingar försvinner med det
create function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or public.is_anonymous() then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  delete from auth.users where id = auth.uid();
end $$;

-- funktionerna får bara anropas av inloggade
revoke all on function
  public.is_anonymous(), public.is_parent_of(uuid), public.can_access_profile(uuid),
  public.create_pair_code(uuid), public.claim_pair_code(text, text), public.delete_my_account()
  from public, anon;
grant execute on function
  public.is_anonymous(), public.is_parent_of(uuid), public.can_access_profile(uuid),
  public.create_pair_code(uuid), public.claim_pair_code(text, text), public.delete_my_account()
  to authenticated;
