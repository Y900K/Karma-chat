create type public.employer_role as enum ('owner','admin','recruiter','interviewer','viewer');

create table public.employer_memberships (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade, role public.employer_role not null default 'viewer',
 status text not null default 'invited' check(status in ('invited','active','suspended')), created_at timestamptz not null default now(),
 unique(organization_id,user_id)
);
create table public.talent_access_requests (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 learner_user_id uuid not null references auth.users(id) on delete cascade, job_id text not null references public.jobs(id) on delete cascade,
 requested_by uuid not null references auth.users(id), status text not null default 'pending' check(status in ('pending','accepted','declined','expired','revoked')),
 requested_scopes text[] not null default array['profile','evidence'], message text, expires_at timestamptz not null default(now()+interval '14 days'), responded_at timestamptz, created_at timestamptz not null default now(),
 unique(learner_user_id,job_id)
);
create table public.structured_interviews (
 id uuid primary key default gen_random_uuid(), application_id uuid not null references public.applications(id) on delete cascade,
 scheduled_at timestamptz, duration_minutes smallint not null default 30, mode text not null check(mode in ('video','phone','in_person')),
 rubric jsonb not null default '[]', status text not null default 'scheduled' check(status in ('scheduled','completed','cancelled','no_show')), created_at timestamptz not null default now()
);
create table public.interview_feedback (
 id uuid primary key default gen_random_uuid(), interview_id uuid not null references public.structured_interviews(id) on delete cascade,
 interviewer_user_id uuid not null references auth.users(id), scores jsonb not null, evidence_notes text,
 recommendation text not null check(recommendation in ('strong_yes','yes','hold','no')), submitted_at timestamptz not null default now(), unique(interview_id,interviewer_user_id)
);
create table public.employment_outcomes (
 id uuid primary key default gen_random_uuid(), application_id uuid not null unique references public.applications(id) on delete cascade,
 offered_salary integer, joining_date date, joined boolean, retention_30_day boolean, retention_90_day boolean,
 learner_confirmed_at timestamptz, employer_updated_at timestamptz, created_at timestamptz not null default now()
);

alter table public.employer_memberships enable row level security; alter table public.talent_access_requests enable row level security;
alter table public.structured_interviews enable row level security; alter table public.interview_feedback enable row level security; alter table public.employment_outcomes enable row level security;
create function public.is_active_employer_member(org uuid) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.employer_memberships m where m.organization_id=org and m.user_id=auth.uid() and m.status='active') $$;
create policy "employer members read membership" on public.employer_memberships for select using(user_id=auth.uid() or public.is_active_employer_member(organization_id));
create policy "learners read access requests" on public.talent_access_requests for select using(learner_user_id=auth.uid());
create policy "learners answer access requests" on public.talent_access_requests for update using(learner_user_id=auth.uid()) with check(learner_user_id=auth.uid());
create policy "employers manage access requests" on public.talent_access_requests for all using(public.is_active_employer_member(organization_id)) with check(public.is_active_employer_member(organization_id) and requested_by=auth.uid());
create policy "participants read interviews" on public.structured_interviews for select using(exists(select 1 from public.applications a join public.jobs j on j.id=a.job_id where a.id=application_id and (a.user_id=auth.uid() or public.is_active_employer_member(j.organization_id))));
create policy "employers manage interviews" on public.structured_interviews for all using(exists(select 1 from public.applications a join public.jobs j on j.id=a.job_id where a.id=application_id and public.is_active_employer_member(j.organization_id)));
create policy "interviewers manage own feedback" on public.interview_feedback for all using(interviewer_user_id=auth.uid()) with check(interviewer_user_id=auth.uid());
create policy "participants read outcomes" on public.employment_outcomes for select using(exists(select 1 from public.applications a join public.jobs j on j.id=a.job_id where a.id=application_id and (a.user_id=auth.uid() or public.is_active_employer_member(j.organization_id))));
create index talent_access_org_status_idx on public.talent_access_requests(organization_id,status); create index structured_interviews_schedule_idx on public.structured_interviews(scheduled_at,status);
