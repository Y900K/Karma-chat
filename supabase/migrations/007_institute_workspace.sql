-- Institute workspaces: scoped membership, cohorts, interventions and aggregate reporting.
create type public.institute_role as enum ('owner','admin','placement_officer','faculty','reviewer','viewer');

create table public.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.institute_role not null default 'viewer',
  status text not null default 'invited' check (status in ('invited','active','suspended')),
  created_at timestamptz not null default now(),
  unique (organization_id,user_id)
);

create table public.cohorts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null, trade text not null, academic_year text not null,
  semester smallint check (semester between 1 and 8),
  status text not null default 'active' check (status in ('draft','active','archived')),
  created_at timestamptz not null default now()
);

create table public.cohort_enrollments (
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  learner_user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active' check (status in ('active','completed','withdrawn')),
  joined_at timestamptz not null default now(),
  primary key (cohort_id,learner_user_id)
);

create table public.institute_data_grants (
  id uuid primary key default gen_random_uuid(),
  learner_user_id uuid not null references auth.users(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  purpose text not null check (purpose in ('education_support','evidence_review','placement_support')),
  scopes text[] not null default '{}', consented_at timestamptz not null default now(),
  expires_at timestamptz, revoked_at timestamptz,
  unique (learner_user_id,organization_id,purpose)
);

create table public.learner_support_actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  cohort_id uuid references public.cohorts(id) on delete set null,
  learner_user_id uuid not null references auth.users(id) on delete cascade,
  signal_type text not null, suggested_action text,
  status text not null default 'open' check (status in ('open','assigned','resolved','dismissed')),
  assigned_to uuid references auth.users(id) on delete set null,
  note text, due_at timestamptz, created_at timestamptz not null default now()
);

create table public.cohort_metric_snapshots (
  id uuid primary key default gen_random_uuid(), cohort_id uuid not null references public.cohorts(id) on delete cascade,
  captured_on date not null, learner_count integer not null default 0,
  readiness_percent numeric(5,2), engagement_percent numeric(5,2), evidence_percent numeric(5,2),
  application_count integer not null default 0, offer_count integer not null default 0,
  unique (cohort_id,captured_on)
);

alter table public.organization_memberships enable row level security;
alter table public.cohorts enable row level security;
alter table public.cohort_enrollments enable row level security;
alter table public.institute_data_grants enable row level security;
alter table public.learner_support_actions enable row level security;
alter table public.cohort_metric_snapshots enable row level security;

create function public.is_active_org_member(org uuid) returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.organization_memberships m where m.organization_id=org and m.user_id=auth.uid() and m.status='active')
$$;

create policy "members read own membership" on public.organization_memberships for select using (user_id=auth.uid() or public.is_active_org_member(organization_id));
create policy "members read cohorts" on public.cohorts for select using (public.is_active_org_member(organization_id));
create policy "staff manage cohorts" on public.cohorts for all using (public.is_active_org_member(organization_id)) with check (public.is_active_org_member(organization_id));
create policy "learner or staff read enrollments" on public.cohort_enrollments for select using (learner_user_id=auth.uid() or exists(select 1 from public.cohorts c where c.id=cohort_id and public.is_active_org_member(c.organization_id)));
create policy "learner manages grants" on public.institute_data_grants for all using (learner_user_id=auth.uid()) with check (learner_user_id=auth.uid());
create policy "authorized staff read grants" on public.institute_data_grants for select using (public.is_active_org_member(organization_id));
create policy "staff read consented support" on public.learner_support_actions for select using (public.is_active_org_member(organization_id) and exists(select 1 from public.institute_data_grants g where g.organization_id=learner_support_actions.organization_id and g.learner_user_id=learner_support_actions.learner_user_id and g.purpose='education_support' and g.revoked_at is null and (g.expires_at is null or g.expires_at>now())));
create policy "staff manage consented support" on public.learner_support_actions for all using (public.is_active_org_member(organization_id)) with check (public.is_active_org_member(organization_id));
create policy "members read aggregate metrics" on public.cohort_metric_snapshots for select using (exists(select 1 from public.cohorts c where c.id=cohort_id and public.is_active_org_member(c.organization_id)));

create index memberships_user_idx on public.organization_memberships(user_id,status);
create index support_actions_org_status_idx on public.learner_support_actions(organization_id,status);
create index institute_grants_lookup_idx on public.institute_data_grants(organization_id,learner_user_id,purpose);
