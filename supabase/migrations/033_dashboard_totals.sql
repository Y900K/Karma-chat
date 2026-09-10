begin;
-- Aggregation runs inside PostgreSQL, before PostgREST row limits. Invoker
-- security preserves underlying RLS even for direct RPC calls.
create or replace function public.dashboard_metric_totals(p_scope text,p_organization_id uuid default null)
returns jsonb language plpgsql stable security invoker set search_path=public,pg_temp as $$
declare v_persona text; v_result jsonb;
begin
  select persona::text into v_persona from public.user_accounts where user_id=auth.uid() and status='active';
  if v_persona is null or (v_persona<>p_scope and v_persona<>'admin') then raise exception 'Forbidden' using errcode='42501'; end if;
  if p_scope='learner' then
    select jsonb_build_object(
      'completedLessons',(select count(*) from learning_progress where user_id=auth.uid() and status='completed'),
      'verifiedEvidence',(select count(*) from skill_evidence where user_id=auth.uid() and verification_status='verified'),
      'pendingEvidence',(select count(*) from skill_evidence where user_id=auth.uid() and verification_status='pending'),
      'applications',(select count(*) from applications where user_id=auth.uid()),
      'unreadNotifications',(select count(*) from notifications where user_id=auth.uid() and read_at is null and archived_at is null)
    ) into v_result;
  elsif p_scope='institute' then
    if not exists(select 1 from organization_memberships where organization_id=p_organization_id and user_id=auth.uid() and status='active') then raise exception 'Membership required' using errcode='42501'; end if;
    select jsonb_build_object(
      'cohorts',(select count(*) from cohorts where organization_id=p_organization_id and status='active'),
      'learners',(select coalesce(sum(s.learner_count),0) from cohort_latest_metric_snapshots s join cohorts c on c.id=s.cohort_id where c.organization_id=p_organization_id and c.status='active'),
      'openSupportActions',(select count(*) from learner_support_actions where organization_id=p_organization_id and status in ('open','assigned'))
    ) into v_result;
  elsif p_scope='employer' then
    if not exists(select 1 from employer_memberships where organization_id=p_organization_id and user_id=auth.uid() and status='active') then raise exception 'Membership required' using errcode='42501'; end if;
    select jsonb_build_object(
      'openRoles',(select count(*) from jobs where organization_id=p_organization_id and status='published'),
      'vacancies',(select coalesce(sum(case when requirements->>'openings' ~ '^[0-9]{1,6}$' then (requirements->>'openings')::integer else 0 end),0) from jobs where organization_id=p_organization_id and status='published'),
      'applications',(select count(*) from applications a join jobs j on j.id=a.job_id where j.organization_id=p_organization_id),
      'offers',(select count(*) from hiring_pipeline_entries p join applications a on a.id=p.application_id join jobs j on j.id=a.job_id where j.organization_id=p_organization_id and p.stage in ('offer','hired'))
    ) into v_result;
  elsif p_scope='government' then
    if not exists(select 1 from program_memberships where organization_id=p_organization_id and user_id=auth.uid() and status='active') then raise exception 'Membership required' using errcode='42501'; end if;
    select jsonb_build_object(
      'snapshots',(select count(*) from aggregate_metric_snapshots where program_organization_id=p_organization_id and not suppressed),
      'openCases',(select count(*) from governance_cases where program_organization_id=p_organization_id and status in ('open','investigating')),
      'criticalCases',(select count(*) from governance_cases where program_organization_id=p_organization_id and severity='critical' and status in ('open','investigating')),
      'approvedModels',(select count(*) from model_releases where status='approved')
    ) into v_result;
  elsif p_scope='admin' then
    if not public.is_platform_staff() then raise exception 'Staff required' using errcode='42501'; end if;
    select jsonb_build_object(
      'publishedResources',(select count(*) from external_resources where review_status='approved' and permission_status='valid'),
      'brokenResources',(select count(*) from external_resources where permission_status in ('broken','revoked')),
      'reviewsDue',(select count(*) from external_resources where next_review_at<=now()),
      'partnerCasesOpen',(select count(*) from partner_verification_cases where status in ('pending','reviewing')),
      'enabledFlags',(select count(*) from feature_flags where enabled),
      'productionPrompts',(select count(*) from prompt_versions where status='production')
    ) into v_result;
  else raise exception 'Invalid scope'; end if;
  return v_result;
end $$;
revoke all on function public.dashboard_metric_totals(text,uuid) from public,anon;
grant execute on function public.dashboard_metric_totals(text,uuid) to authenticated;
commit;
