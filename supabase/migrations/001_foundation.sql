-- KarmaSetu Phase 0 foundation. Apply through the Supabase migration workflow.
create extension if not exists pgcrypto;

create table public.learner_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 120),
  institute_name text,
  education_level text not null,
  trade text not null,
  current_semester smallint check (current_semester between 1 and 12),
  target_role_slug text not null,
  home_location text not null,
  mobility_preference text not null check (mobility_preference in ('nearby','state','relocate')),
  preferred_language text not null default 'en' check (preferred_language in ('en','hi')),
  profile_visibility text not null default 'private' check (profile_visibility in ('private','matched_employers','public_link')),
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  purpose text not null check (purpose in ('profile_personalization','ai_personalization','employer_visibility','research','marketing')),
  granted boolean not null,
  policy_version text not null default '2026-08-v1',
  captured_at timestamptz not null default now(),
  withdrawn_at timestamptz
);

create table public.skill_evidence (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_slug text not null,
  evidence_type text not null check (evidence_type in ('project','assessment','credential','work_sample','interview')),
  title text not null,
  description text,
  storage_path text,
  external_url text,
  verification_status text not null default 'pending' check (verification_status in ('pending','verified','rejected','expired')),
  verifier_id uuid references auth.users(id),
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.readiness_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_role_slug text not null,
  index_version text not null,
  overall_score smallint not null check (overall_score between 0 and 100),
  dimensions jsonb not null,
  explanation jsonb not null,
  calculated_at timestamptz not null default now()
);

create index consent_user_purpose_idx on public.consent_records(user_id, purpose, captured_at desc);
create index evidence_user_skill_idx on public.skill_evidence(user_id, skill_slug);
create index readiness_user_role_idx on public.readiness_snapshots(user_id, target_role_slug, calculated_at desc);

alter table public.learner_profiles enable row level security;
alter table public.consent_records enable row level security;
alter table public.skill_evidence enable row level security;
alter table public.readiness_snapshots enable row level security;

create policy "learners read own profile" on public.learner_profiles for select using (auth.uid() = user_id);
create policy "learners create own profile" on public.learner_profiles for insert with check (auth.uid() = user_id);
create policy "learners update own profile" on public.learner_profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "learners read own consents" on public.consent_records for select using (auth.uid() = user_id);
create policy "learners record own consents" on public.consent_records for insert with check (auth.uid() = user_id);
create policy "learners read own evidence" on public.skill_evidence for select using (auth.uid() = user_id);
create policy "learners create own evidence" on public.skill_evidence for insert with check (auth.uid() = user_id and verifier_id is null and verification_status = 'pending');
create policy "learners update pending evidence" on public.skill_evidence for update using (auth.uid() = user_id and verification_status = 'pending') with check (auth.uid() = user_id and verifier_id is null and verification_status = 'pending');
create policy "learners read own readiness" on public.readiness_snapshots for select using (auth.uid() = user_id);

create or replace function public.set_updated_at() returns trigger language plpgsql security invoker set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;
create trigger learner_profiles_updated before update on public.learner_profiles for each row execute function public.set_updated_at();

-- Storage bucket must be private. Object policies assume paths start with the owner's UUID.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('learner-evidence','learner-evidence',false,10485760,array['application/pdf','image/jpeg','image/png','video/mp4'])
on conflict (id) do nothing;
create policy "learners upload own evidence files" on storage.objects for insert to authenticated with check (bucket_id = 'learner-evidence' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "learners read own evidence files" on storage.objects for select to authenticated using (bucket_id = 'learner-evidence' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "learners delete own evidence files" on storage.objects for delete to authenticated using (bucket_id = 'learner-evidence' and (storage.foldername(name))[1] = (select auth.uid()::text));
