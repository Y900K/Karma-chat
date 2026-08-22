-- P0 pilot hardening: immutable public personas and transactional partner invitations.

revoke update on table public.user_accounts from anon, authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.user_accounts(user_id, persona, display_name)
  values (new.id, 'learner', new.raw_user_meta_data->>'display_name');
  return new;
end;
$$;

create or replace function public.update_own_account_profile(
  p_display_name text,
  p_preferred_language text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then raise exception 'unauthenticated'; end if;
  if char_length(trim(p_display_name)) not between 2 and 120 then
    raise exception 'invalid display name';
  end if;
  if p_preferred_language not in ('en', 'hi') then
    raise exception 'invalid preferred language';
  end if;

  update public.user_accounts
  set display_name = trim(p_display_name), preferred_language = p_preferred_language
  where user_id = v_user;
end;
$$;

create or replace function public.accept_organization_invitation(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_email text := lower(coalesce(auth.jwt()->>'email', ''));
  v_invitation public.organization_invitations%rowtype;
  v_org public.organizations%rowtype;
  v_persona text;
begin
  if v_user is null or v_email = '' then raise exception 'unauthenticated'; end if;
  if char_length(p_token) < 32 then raise exception 'invalid invitation'; end if;

  select * into v_invitation
  from public.organization_invitations
  where token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex')
    and lower(email) = v_email
    and status = 'pending'
    and expires_at > now()
  for update;

  if not found then raise exception 'invitation is invalid, expired, or belongs to another email'; end if;

  select * into v_org from public.organizations where id = v_invitation.organization_id;
  if not found or v_org.verification_status <> 'verified' then
    raise exception 'organization is not verified';
  end if;
  if v_org.organization_type not in ('institute', 'employer', 'government') then
    raise exception 'organization type cannot invite partner users';
  end if;

  v_persona := v_org.organization_type;

  if v_persona = 'institute' then
    if v_invitation.role not in ('owner','admin','placement_officer','faculty','reviewer','viewer') then
      raise exception 'invalid institute role';
    end if;
    insert into public.organization_memberships(organization_id, user_id, role, status)
    values(v_org.id, v_user, v_invitation.role::public.institute_role, 'active')
    on conflict(organization_id, user_id) do update set role = excluded.role, status = 'active';
  elsif v_persona = 'employer' then
    if v_invitation.role not in ('owner','admin','recruiter','interviewer','viewer') then
      raise exception 'invalid employer role';
    end if;
    insert into public.employer_memberships(organization_id, user_id, role, status)
    values(v_org.id, v_user, v_invitation.role::public.employer_role, 'active')
    on conflict(organization_id, user_id) do update set role = excluded.role, status = 'active';
  else
    if v_invitation.role not in ('program_admin','analyst','auditor','grievance_officer','viewer') then
      raise exception 'invalid government role';
    end if;
    insert into public.program_memberships(organization_id, user_id, role, status)
    values(v_org.id, v_user, v_invitation.role, 'active')
    on conflict(organization_id, user_id) do update set role = excluded.role, status = 'active';
  end if;

  update public.user_accounts
  set persona = v_persona
  where user_id = v_user and persona = 'learner' and status = 'active';

  if not found then raise exception 'account is not eligible for partner activation'; end if;

  update public.organization_invitations
  set status = 'accepted', accepted_by = v_user
  where id = v_invitation.id;

  insert into public.audit_events(actor_user_id, organization_id, action, resource_type, resource_id, purpose)
  values(v_user, v_org.id, 'organization_invitation.accepted', 'organization_invitation', v_invitation.id::text, 'partner_access');

  return jsonb_build_object('persona', v_persona, 'organization', v_org.name);
end;
$$;

revoke all on function public.update_own_account_profile(text, text) from public, anon;
grant execute on function public.update_own_account_profile(text, text) to authenticated;
revoke all on function public.accept_organization_invitation(text) from public, anon;
grant execute on function public.accept_organization_invitation(text) to authenticated;

-- Direct browser uploads are disabled for the external pilot. A later server-side
-- quarantine/scanner pipeline must own object creation before this is re-enabled.
drop policy if exists "learners upload own evidence files" on storage.objects;
