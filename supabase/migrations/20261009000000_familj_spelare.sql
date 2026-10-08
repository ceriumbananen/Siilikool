-- Familjekonto, steg 4 (docs/plan-familj.md): en låst vuxen enhet ser familjens barn direkt, utan familjekod.
-- Körs efter 20261008000000_familj.sql.

-- Familjens barn för den inloggade vuxna – också när enheten är låst. Samma svar som family_lookup
-- (bara namn, figur och om barnet har PIN – det som barnens enheter ser med familjekoden).
-- Svar: {ok: true, family_name, members: [{id, name, avatar, has_pin}]} eller {ok: false, error: 'no_family'}
create or replace function public.my_family_children() returns jsonb
language sql stable security definer set search_path = '' as $$
  select case when f.id is null then jsonb_build_object('ok', false, 'error', 'no_family')
  else jsonb_build_object('ok', true, 'family_name', f.name, 'members', coalesce((
    select jsonb_agg(jsonb_build_object('id', m.id, 'name', m.name, 'avatar', m.avatar, 'has_pin', m.has_pin)
      order by m.created_at)
    from public.members m where m.family_id = f.id and m.kind = 'child'), '[]'::jsonb))
  end
  from (select 1) x left join public.families f on f.id = public.adult_family();
$$;

revoke all on function public.my_family_children() from public, anon;
grant execute on function public.my_family_children() to authenticated;
