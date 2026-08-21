create table public.organizations (
 id uuid primary key default gen_random_uuid(), name text not null, organization_type text not null check(organization_type in ('employer','institute','government','platform')),
 verification_status text not null default 'pending' check(verification_status in ('pending','verified','suspended')), website text, created_at timestamptz not null default now()
);
create table public.jobs (
 id text primary key, organization_id uuid not null references public.organizations(id), title text not null, target_role_slug text not null,
 description text not null, location text not null, work_type text not null, shift_details text, salary_min integer not null,
 salary_max integer not null, currency text not null default 'INR', experience_min_months integer not null default 0,
 requirements jsonb not null, status text not null check(status in ('draft','published','paused','closed')), published_at timestamptz, closes_at timestamptz
);
create table public.opportunity_matches (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, job_id text not null references public.jobs(id) on delete cascade,
 match_version text not null, score smallint not null check(score between 0 and 100), explanation jsonb not null, missing_signals jsonb not null,
 calculated_at timestamptz not null default now(), unique(user_id,job_id,match_version)
);
create table public.applications (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, job_id text not null references public.jobs(id),
 status text not null check(status in ('submitted','employer_review','interview','offer','accepted','withdrawn','rejected','closed')),
 profile_share_consent boolean not null, shared_snapshot jsonb not null default '{}'::jsonb, submitted_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(user_id,job_id)
);
create table public.application_events (
 id uuid primary key default gen_random_uuid(), application_id uuid not null references public.applications(id) on delete cascade,
 event_type text not null, actor_user_id uuid references auth.users(id), detail jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create index job_role_status_idx on public.jobs(target_role_slug,status); create index match_user_score_idx on public.opportunity_matches(user_id,score desc); create index applications_user_idx on public.applications(user_id,submitted_at desc);
alter table public.organizations enable row level security; alter table public.jobs enable row level security; alter table public.opportunity_matches enable row level security; alter table public.applications enable row level security; alter table public.application_events enable row level security;
create policy "verified organizations readable" on public.organizations for select using(verification_status='verified');
create policy "published jobs readable" on public.jobs for select using(status='published' and exists(select 1 from public.organizations o where o.id=organization_id and o.verification_status='verified'));
create policy "learners read own matches" on public.opportunity_matches for select using(auth.uid()=user_id);
create policy "learners read own applications" on public.applications for select using(auth.uid()=user_id);
create policy "learners submit own applications" on public.applications for insert with check(auth.uid()=user_id and profile_share_consent=true);
create policy "learners update own applications" on public.applications for update using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "learners read own application events" on public.application_events for select using(exists(select 1 from public.applications a where a.id=application_id and a.user_id=auth.uid()));
