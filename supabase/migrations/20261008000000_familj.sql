-- Siilikool: familjekonto (docs/plan-familj.md). Ersätter kopplingsmodellen i 20261007000000_konton.sql.
-- Körs i Supabase: SQL Editor → klistra in → Run (eller `supabase db push`).
--
-- Modell
--   * En familj har medlemmar: vuxna (egen inloggning med e-postlänk) och barn (ingen egen inloggning).
--     Alla har sitt eget spel i members.data.
--   * Barnens enheter loggar in anonymt, skriver familjekoden och väljer vem som spelar (valfri PIN).
--     Valet sparas per inloggning (session_id) i device_members – en enhet kan ha flera barn.
--   * En vuxen kan låsa enhetens inloggning (locked_sessions). En låst inloggning har inga
--     vuxenrättigheter alls – bara barnen som valts på enheten – tills vuxen-PIN låser upp.
--   * Glosor (word_lists) gäller ett barn eller alla barn (member_id null) och skrivs bara av olåsta vuxna.
--   * PIN-koder lagras som bcrypt-hash. Fel PIN eller familjekod räknas: för många fel → spärr en stund.

-- ============ bort med kopplingsmodellen (bara testdata) ============

drop table if exists public.pair_codes, public.device_links, public.school_lists, public.profiles cascade;
drop function if exists public.create_pair_code(uuid), public.claim_pair_code(text, text),
  public.can_access_profile(uuid), public.is_parent_of(uuid), public.delete_my_account();

create extension if not exists pgcrypto with schema extensions;

-- ============ tabeller ============

create table public.families (
  id              uuid primary key default gen_random_uuid(),
  name            text not null check (char_length(name) between 1 and 60),
  child_code      text not null unique,
  adult_pin_hash  text,
  created_at      timestamptz not null default now()
);

create table public.members (
  id          uuid primary key default gen_random_uuid(),
  family_id   uuid not null references public.families (id) on delete cascade,
  kind        text not null check (kind in ('adult', 'child')),
  user_id     uuid unique references auth.users (id) on delete cascade,   -- vuxens inloggning
  name        text not null default '' check (char_length(name) <= 40),
  avatar      text not null default '🦔' check (char_length(avatar) <= 16),
  pin_hash    text,                                                       -- barn, valfri
  has_pin     boolean not null default false,
  data        jsonb not null default '{}'::jsonb,                         -- spelet (S i appen)
  ver         integer not null default 0,                                 -- räknas upp vid varje sparning
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (id, family_id),
  check ((kind = 'adult') = (user_id is not null))
);
create index members_family_idx on public.members (family_id);

-- vilka barn som valts på en enhet (per inloggning – anonym på barnens enheter, eller låst vuxen)
create table public.device_members (
  session_id  uuid not null,
  user_id     uuid not null references auth.users (id) on delete cascade,
  member_id   uuid not null references public.members (id) on delete cascade,
  label       text not null default '' check (char_length(label) <= 60),
  created_at  timestamptz not null default now(),
  primary key (session_id, member_id)
);
create index device_members_member_idx on public.device_members (member_id);

create table public.locked_sessions (
  session_id  uuid primary key,
  family_id   uuid not null references public.families (id) on delete cascade,
  locked_at   timestamptz not null default now()
);

create table public.word_lists (
  id          uuid primary key default gen_random_uuid(),
  family_id   uuid not null references public.families (id) on delete cascade,
  member_id   uuid,                                                       -- null = alla barn
  name        text not null default 'Veckans ord' check (char_length(name) <= 40),
  words       jsonb not null default '[]'::jsonb
              check (jsonb_typeof(words) = 'array' and jsonb_array_length(words) <= 40),
  days        integer not null default 14 check (days between 3 and 60),
  created_at  timestamptz not null default now(),
  foreign key (member_id, family_id) references public.members (id, family_id) on delete cascade
);
create index word_lists_family_idx on public.word_lists (family_id, created_at desc);

create table public.invites (
  token       text primary key,
  family_id   uuid not null references public.families (id) on delete cascade,
  expires_at  timestamptz not null
);

-- felräkning för PIN och familjekod: nyckel som 'member:<id>', 'family:<id>', 'lookup:<user>'
create table public.pin_attempts (
  key           text primary key,
  failures      integer not null default 0,
  locked_until  timestamptz
);

create or replace function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;
create trigger members_touch before update on public.members
  for each row execute function public.touch_updated_at();

-- ============ hjälpfunktioner ============

create or replace function public.is_anonymous() returns boolean
language sql stable set search_path = '' as $$
  select coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false);
$$;

-- inloggningens id (Supabase skickar det i varje token); samma så länge enheten är inloggad
create or replace function public.session_id() returns uuid
language sql stable set search_path = '' as $$
  select nullif(auth.jwt() ->> 'session_id', '')::uuid;
$$;

create or replace function public.session_locked() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.locked_sessions where session_id = public.session_id());
$$;

-- den inloggades familj som vuxen (oavsett lås)
create or replace function public.adult_family() returns uuid
language sql stable security definer set search_path = '' as $$
  select family_id from public.members where user_id = auth.uid() and kind = 'adult';
$$;

-- olåst vuxen i familjen: får läsa och ändra allt i den
create or replace function public.is_adult_of(fam uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select fam is not null and fam = public.adult_family() and not public.session_locked();
$$;

-- medlemmen har valts på den här enheten
create or replace function public.on_this_device(m uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.device_members where session_id = public.session_id() and member_id = m);
$$;

create or replace function public.family_of(m uuid) returns uuid
language sql stable security definer set search_path = '' as $$
  select family_id from public.members where id = m;
$$;

-- familjer där den här enheten har valt något barn
create or replace function public.device_family(fam uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.device_members d join public.members m on m.id = d.member_id
    where d.session_id = public.session_id() and m.family_id = fam
  );
$$;

-- Felräkning för PIN och familjekod. Funktionerna som kontrollerar en PIN returnerar fel som svar
-- ({ok: false, ...}) i stället för att kasta dem – ett kastat fel skulle rulla tillbaka uppräkningen.

-- spärrad till (eller null)
create or replace function public.attempts_locked_until(p_key text) returns timestamptz
language sql stable security definer set search_path = '' as $$
  select locked_until from public.pin_attempts where key = p_key and locked_until > now();
$$;

create or replace function public.fail_attempt(p_key text, p_max integer) returns void
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.pin_attempts (key, failures) values (p_key, 1)
    on conflict (key) do update set
      failures = case when public.pin_attempts.locked_until is not null and public.pin_attempts.locked_until <= now()
                      then 1 else public.pin_attempts.failures + 1 end,
      locked_until = case when public.pin_attempts.locked_until is not null and public.pin_attempts.locked_until <= now()
                          then null else public.pin_attempts.locked_until end;
  update public.pin_attempts set locked_until = now() + interval '15 minutes', failures = 0
    where key = p_key and failures >= p_max;
end $$;

create or replace function public.clear_attempts(p_key text) returns void
language sql security definer set search_path = '' as $$
  delete from public.pin_attempts where key = p_key;
$$;

-- familjekod: 6 tecken utan 0/O, 1/I som går att blanda ihop
create or replace function public.new_child_code() returns text
language plpgsql volatile set search_path = '' as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_rand bytea := extensions.gen_random_bytes(6);
  v_code text := '';
begin
  for i in 0..5 loop
    v_code := v_code || substr(alphabet, (get_byte(v_rand, i) % 32) + 1, 1);
  end loop;
  return v_code;
end $$;

-- ============ rättigheter ============
-- Börjar från noll och ger inloggade exakt det appen behöver (fungerar oavsett "Automatically expose
-- new tables"). Utloggade (anon) får ingenting. Vilka rader som syns avgörs av reglerna nedan.

revoke all on public.families, public.members, public.device_members, public.locked_sessions,
  public.word_lists, public.invites, public.pin_attempts from anon, authenticated;
grant usage on schema public to authenticated;
grant select (id, name, child_code, created_at) on public.families to authenticated;     -- aldrig PIN-hashen
grant update (name) on public.families to authenticated;
grant select (id, family_id, kind, user_id, name, avatar, has_pin, data, ver, created_at, updated_at)
  on public.members to authenticated;                                                     -- aldrig PIN-hashen
grant insert (family_id, kind, name, avatar) on public.members to authenticated;
grant update (name, avatar, data, ver) on public.members to authenticated;
grant delete on public.members to authenticated;
grant select, delete on public.device_members to authenticated;
grant select, insert, update, delete on public.word_lists to authenticated;
-- locked_sessions, invites och pin_attempts: inga rättigheter – bara funktionerna nedan

alter table public.families        enable row level security;
alter table public.members         enable row level security;
alter table public.device_members  enable row level security;
alter table public.locked_sessions enable row level security;
alter table public.word_lists      enable row level security;
alter table public.invites         enable row level security;
alter table public.pin_attempts    enable row level security;

-- familjen: vuxna, och enheter som valt någon i familjen (för familjens namn)
create policy "familj: läsa" on public.families for select to authenticated
  using (public.is_adult_of(id) or public.device_family(id));
create policy "familj: byta namn" on public.families for update to authenticated
  using (public.is_adult_of(id)) with check (public.is_adult_of(id));

-- medlemmar: olåsta vuxna ser och ändrar hela familjen; en enhet bara barnen som valts där.
-- Vuxna medlemmar skapas av create_family/accept_invite – här bara barn.
create policy "medlemmar: läsa" on public.members for select to authenticated
  using (public.is_adult_of(family_id) or public.on_this_device(id));
create policy "medlemmar: lägga till barn" on public.members for insert to authenticated
  with check (kind = 'child' and public.is_adult_of(family_id));
create policy "medlemmar: spara" on public.members for update to authenticated
  using (public.is_adult_of(family_id) or public.on_this_device(id))
  with check (public.is_adult_of(family_id) or public.on_this_device(id));
create policy "medlemmar: ta bort barn" on public.members for delete to authenticated
  using (kind = 'child' and public.is_adult_of(family_id));

-- enheter: enheten själv och olåsta vuxna ser och tar bort valen. Nya val bara via choose_member.
create policy "enheter: läsa" on public.device_members for select to authenticated
  using (session_id = public.session_id() or public.is_adult_of(public.family_of(member_id)));
create policy "enheter: ta bort" on public.device_members for delete to authenticated
  using (session_id = public.session_id() or public.is_adult_of(public.family_of(member_id)));

-- glosor: vuxna skriver; en enhet läser listorna för barnen som valts där (egna + "alla barn")
create policy "glosor: läsa" on public.word_lists for select to authenticated
  using (
    public.is_adult_of(family_id)
    or (member_id is null and public.device_family(family_id))
    or (member_id is not null and public.on_this_device(member_id))
  );
create policy "glosor: skapa" on public.word_lists for insert to authenticated
  with check (public.is_adult_of(family_id));
create policy "glosor: ändra" on public.word_lists for update to authenticated
  using (public.is_adult_of(family_id)) with check (public.is_adult_of(family_id));
create policy "glosor: ta bort" on public.word_lists for delete to authenticated
  using (public.is_adult_of(family_id));

-- ============ funktioner som appen anropar ============

-- hur ser den här inloggningen ut? (för att visa rätt saker i appen)
create or replace function public.my_session() returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'family_id', coalesce(public.adult_family(),
      (select m.family_id from public.device_members d join public.members m on m.id = d.member_id
        where d.session_id = public.session_id() limit 1)),
    'adult', public.adult_family() is not null,
    'locked', public.session_locked(),
    'members', coalesce((select jsonb_agg(member_id) from public.device_members where session_id = public.session_id()), '[]'::jsonb)
  );
$$;

-- en vuxen skapar sin familj (och blir dess första vuxna medlem)
create or replace function public.create_family(p_name text, p_adult_name text default '') returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_family uuid;
begin
  if auth.uid() is null or public.is_anonymous() then raise exception 'not allowed' using errcode = '42501'; end if;
  if public.adult_family() is not null then raise exception 'already in a family' using errcode = '23505'; end if;
  loop
    begin
      insert into public.families (name, child_code) values (trim(p_name), public.new_child_code())
        returning id into v_family;
      exit;
    exception when unique_violation then
      -- koden fanns redan: ta en ny
    end;
  end loop;
  insert into public.members (family_id, kind, user_id, name)
    values (v_family, 'adult', auth.uid(), left(trim(coalesce(p_adult_name, '')), 40));
  return v_family;
end $$;

-- barnets enhet: familjens namn och barnen att välja bland. För många fel koder → spärr.
-- Svar: {ok: true, family_name, members: [{id, name, avatar, has_pin}]} eller {ok: false, error, until}
create or replace function public.family_lookup(p_code text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_key text := 'lookup:' || auth.uid();
  v_until timestamptz := public.attempts_locked_until('lookup:' || auth.uid());
  v_family uuid;
  v_name text;
begin
  if auth.uid() is null then raise exception 'not signed in' using errcode = '42501'; end if;
  if v_until is not null then return jsonb_build_object('ok', false, 'error', 'locked', 'until', v_until); end if;
  select f.id, f.name into v_family, v_name from public.families f
    where f.child_code = upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
  if v_family is null then
    perform public.fail_attempt(v_key, 10);
    return jsonb_build_object('ok', false, 'error', 'unknown_code', 'until', public.attempts_locked_until(v_key));
  end if;
  perform public.clear_attempts(v_key);
  return jsonb_build_object('ok', true, 'family_name', v_name, 'members', coalesce((
    select jsonb_agg(jsonb_build_object('id', m.id, 'name', m.name, 'avatar', m.avatar, 'has_pin', m.has_pin)
      order by m.created_at)
    from public.members m where m.family_id = v_family and m.kind = 'child'), '[]'::jsonb));
end $$;

-- väljer vem som spelar på enheten. Med familjekoden (barnens enheter) eller som vuxen i familjen
-- (också låst). Barnets PIN krävs om det har en – för många fel → spärr.
-- Svar: {ok: true, family_id} eller {ok: false, error: wrong_pin|locked, until}
create or replace function public.choose_member(p_member uuid, p_pin text default null, p_code text default null,
  p_label text default '') returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_m public.members;
  v_code text;
begin
  if auth.uid() is null or public.session_id() is null then raise exception 'not signed in' using errcode = '42501'; end if;
  select * into v_m from public.members where id = p_member and kind = 'child';
  if v_m.id is null then raise exception 'unknown member' using errcode = 'P0002'; end if;
  select child_code into v_code from public.families where id = v_m.family_id;
  if public.adult_family() is distinct from v_m.family_id
     and upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g')) is distinct from v_code then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  if v_m.pin_hash is not null then
    if public.attempts_locked_until('member:' || v_m.id) is not null then
      return jsonb_build_object('ok', false, 'error', 'locked', 'until', public.attempts_locked_until('member:' || v_m.id));
    end if;
    if p_pin is null or extensions.crypt(p_pin, v_m.pin_hash) <> v_m.pin_hash then
      perform public.fail_attempt('member:' || v_m.id, 5);
      return jsonb_build_object('ok', false, 'error', 'wrong_pin', 'until', public.attempts_locked_until('member:' || v_m.id));
    end if;
    perform public.clear_attempts('member:' || v_m.id);
  end if;
  insert into public.device_members (session_id, user_id, member_id, label)
    values (public.session_id(), auth.uid(), v_m.id, left(coalesce(p_label, ''), 60))
    on conflict (session_id, member_id) do update set label = excluded.label;
  return jsonb_build_object('ok', true, 'family_id', v_m.family_id);
end $$;

-- låser den här enhetens inloggning: inga vuxenrättigheter förrän vuxen-PIN låser upp
create or replace function public.lock_session() returns void
language plpgsql security definer set search_path = '' as $$
declare v_family uuid := public.adult_family();
begin
  if v_family is null or public.session_id() is null then raise exception 'not allowed' using errcode = '42501'; end if;
  if (select adult_pin_hash from public.families where id = v_family) is null then
    raise exception 'set an adult pin first' using errcode = 'P0004';
  end if;
  insert into public.locked_sessions (session_id, family_id) values (public.session_id(), v_family)
    on conflict (session_id) do nothing;
end $$;

-- Svar: {ok: true} eller {ok: false, error: wrong_pin|locked, until}
create or replace function public.unlock_session(p_pin text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_family uuid := public.adult_family();
  v_key text := 'family:' || public.adult_family();
  v_hash text;
begin
  if v_family is null then raise exception 'not allowed' using errcode = '42501'; end if;
  if public.attempts_locked_until(v_key) is not null then
    return jsonb_build_object('ok', false, 'error', 'locked', 'until', public.attempts_locked_until(v_key));
  end if;
  select adult_pin_hash into v_hash from public.families where id = v_family;
  if v_hash is null or p_pin is null or extensions.crypt(p_pin, v_hash) <> v_hash then
    perform public.fail_attempt(v_key, 5);
    return jsonb_build_object('ok', false, 'error', 'wrong_pin', 'until', public.attempts_locked_until(v_key));
  end if;
  perform public.clear_attempts(v_key);
  delete from public.locked_sessions where session_id = public.session_id();
  return jsonb_build_object('ok', true);
end $$;

-- ---------- inställningar (olåst vuxen) ----------

create or replace function public.rotate_child_code() returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_family uuid := public.adult_family();
  v_code text;
begin
  if not public.is_adult_of(v_family) then raise exception 'not allowed' using errcode = '42501'; end if;
  loop
    v_code := public.new_child_code();
    begin
      update public.families set child_code = v_code where id = v_family;
      exit;
    exception when unique_violation then
    end;
  end loop;
  return v_code;
end $$;

-- barnets PIN: 4–8 siffror, eller null för att ta bort den
create or replace function public.set_member_pin(p_member uuid, p_pin text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_adult_of(public.family_of(p_member)) then raise exception 'not allowed' using errcode = '42501'; end if;
  if p_pin is not null and p_pin !~ '^[0-9]{4,8}$' then raise exception 'pin must be 4–8 digits' using errcode = '22023'; end if;
  update public.members
    set pin_hash = case when p_pin is null then null else extensions.crypt(p_pin, extensions.gen_salt('bf')) end,
        has_pin = p_pin is not null
    where id = p_member and kind = 'child';
  perform public.clear_attempts('member:' || p_member);
end $$;

create or replace function public.set_adult_pin(p_pin text) returns void
language plpgsql security definer set search_path = '' as $$
declare v_family uuid := public.adult_family();
begin
  if not public.is_adult_of(v_family) then raise exception 'not allowed' using errcode = '42501'; end if;
  if p_pin is null or p_pin !~ '^[0-9]{4,8}$' then raise exception 'pin must be 4–8 digits' using errcode = '22023'; end if;
  update public.families set adult_pin_hash = extensions.crypt(p_pin, extensions.gen_salt('bf')) where id = v_family;
  perform public.clear_attempts('family:' || v_family);
end $$;

create or replace function public.has_adult_pin() returns boolean
language sql stable security definer set search_path = '' as $$
  select adult_pin_hash is not null from public.families where id = public.adult_family();
$$;

-- ---------- fler vuxna ----------

create or replace function public.create_invite() returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_family uuid := public.adult_family();
  v_token text := encode(extensions.gen_random_bytes(18), 'hex');
begin
  if not public.is_adult_of(v_family) then raise exception 'not allowed' using errcode = '42501'; end if;
  delete from public.invites where expires_at < now();
  insert into public.invites (token, family_id, expires_at) values (v_token, v_family, now() + interval '7 days');
  return v_token;
end $$;

create or replace function public.accept_invite(p_token text, p_name text default '') returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_family uuid;
begin
  if auth.uid() is null or public.is_anonymous() then raise exception 'not allowed' using errcode = '42501'; end if;
  if public.adult_family() is not null then raise exception 'already in a family' using errcode = '23505'; end if;
  delete from public.invites where token = p_token and expires_at > now() returning family_id into v_family;
  if v_family is null then raise exception 'invalid or expired invite' using errcode = 'P0002'; end if;
  insert into public.members (family_id, kind, user_id, name)
    values (v_family, 'adult', auth.uid(), left(trim(coalesce(p_name, '')), 40));
  return v_family;
end $$;

-- ---------- konto ----------

-- vuxen raderar sitt konto. Sista vuxna i familjen → hela familjen (barn, glosor, enheter) raderas.
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
declare v_family uuid := public.adult_family();
begin
  if auth.uid() is null or public.is_anonymous() then raise exception 'not allowed' using errcode = '42501'; end if;
  if v_family is not null and public.session_locked() then raise exception 'session is locked' using errcode = '42501'; end if;
  if v_family is not null and not exists (
    select 1 from public.members where family_id = v_family and kind = 'adult' and user_id <> auth.uid()
  ) then
    delete from public.families where id = v_family;
  end if;
  delete from auth.users where id = auth.uid();
end $$;

-- funktionerna får bara anropas av inloggade; de interna hjälparna av ingen utifrån
revoke all on all functions in schema public from public, anon;
grant execute on function
  public.is_anonymous(), public.session_id(), public.session_locked(), public.adult_family(),
  public.is_adult_of(uuid), public.on_this_device(uuid), public.family_of(uuid), public.device_family(uuid),
  public.my_session(), public.create_family(text, text), public.family_lookup(text),
  public.choose_member(uuid, text, text, text), public.lock_session(), public.unlock_session(text),
  public.rotate_child_code(), public.set_member_pin(uuid, text), public.set_adult_pin(text), public.has_adult_pin(),
  public.create_invite(), public.accept_invite(text, text), public.delete_my_account()
  to authenticated;
