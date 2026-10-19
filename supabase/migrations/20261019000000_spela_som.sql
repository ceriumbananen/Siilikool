-- Konton v2, steg 3 (docs/plan-konton-v2.md): "Spela som" och "Lämna över".
-- Körs efter 20261009000000_familj_spelare.sql.
--
-- En olåst vuxen i familjen väljer ett barn på sin enhet utan barnets PIN – samma behörighet som
-- de vuxna redan har att läsa och ändra barnets spel. Valet registreras på enheten (device_members),
-- så att barnets spel fortsätter synka när enheten sedan lämnas över (låses). Barnenheter och låsta
-- enheter behöver PIN-koden som förut.
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
  -- is_adult_of ger null (inte false) för den som inte är vuxen i någon familj – därför coalesce
  if v_m.pin_hash is not null and not coalesce(public.is_adult_of(v_m.family_id), false) then
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
