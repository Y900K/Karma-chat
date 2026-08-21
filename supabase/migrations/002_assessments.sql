create table public.assessment_definitions (
  slug text not null,
  version text not null,
  target_role_slug text not null,
  title jsonb not null,
  blueprint jsonb not null,
  status text not null check (status in ('draft','published','retired')),
  published_at timestamptz,
  primary key (slug, version)
);

create table public.assessment_questions (
  id text not null,
  version text not null,
  assessment_slug text not null,
  assessment_version text not null,
  dimension text not null,
  prompt jsonb not null,
  options jsonb not null,
  correct_option smallint not null,
  rationale jsonb not null,
  difficulty smallint not null check (difficulty between 1 and 5),
  status text not null check (status in ('draft','approved','retired')),
  primary key (id, version),
  foreign key (assessment_slug, assessment_version) references public.assessment_definitions(slug, version)
);

create table public.assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_slug text not null,
  assessment_version text not null,
  status text not null check (status in ('in_progress','completed','abandoned')),
  score smallint check (score between 0 and 100),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  foreign key (assessment_slug, assessment_version) references public.assessment_definitions(slug, version)
);

create table public.assessment_responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.assessment_attempts(id) on delete cascade,
  question_id text not null,
  selected_option smallint not null,
  confidence smallint not null check (confidence between 0 and 2),
  is_correct boolean not null,
  answered_at timestamptz not null default now()
);

create index assessment_attempt_user_idx on public.assessment_attempts(user_id, started_at desc);
create index assessment_response_attempt_idx on public.assessment_responses(attempt_id);
alter table public.assessment_definitions enable row level security;
alter table public.assessment_questions enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.assessment_responses enable row level security;
create policy "published assessments are readable" on public.assessment_definitions for select using (status = 'published');
create policy "approved questions are readable" on public.assessment_questions for select using (status = 'approved');
create policy "learners read own attempts" on public.assessment_attempts for select using (auth.uid() = user_id);
create policy "learners create own attempts" on public.assessment_attempts for insert with check (auth.uid() = user_id);
create policy "learners update own attempts" on public.assessment_attempts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "learners read own responses" on public.assessment_responses for select using (exists (select 1 from public.assessment_attempts a where a.id = attempt_id and a.user_id = auth.uid()));
create policy "learners create own responses" on public.assessment_responses for insert with check (exists (select 1 from public.assessment_attempts a where a.id = attempt_id and a.user_id = auth.uid()));

insert into public.assessment_definitions (slug,version,target_role_slug,title,blueprint,status,published_at) values
('industrial-electrician-baseline','1.0','industrial-electrician','{"en":"Industrial Electrician Baseline","hi":"Industrial Electrician Baseline"}','{"dimensions":["Safety","Technical","Practical","Problem solving","Communication"],"question_count":5}','published',now());
