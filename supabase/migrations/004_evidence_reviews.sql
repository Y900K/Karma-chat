alter table public.skill_evidence add column if not exists submission_metadata jsonb not null default '{}'::jsonb;
alter table public.skill_evidence add column if not exists submitted_at timestamptz not null default now();
alter table public.skill_evidence add column if not exists revision_of uuid references public.skill_evidence(id);

create table public.evidence_rubrics (
  slug text not null, version text not null, skill_slug text not null, title jsonb not null,
  criteria jsonb not null, status text not null check(status in ('draft','published','retired')),
  published_at timestamptz, primary key(slug,version)
);
create table public.evidence_reviews (
  id uuid primary key default gen_random_uuid(), evidence_id uuid not null references public.skill_evidence(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id), rubric_slug text not null, rubric_version text not null,
  criterion_scores jsonb not null, decision text not null check(decision in ('verified','revision_requested','rejected')),
  feedback text not null, reviewed_at timestamptz not null default now(),
  foreign key(rubric_slug,rubric_version) references public.evidence_rubrics(slug,version)
);
create table public.evidence_appeals (
  id uuid primary key default gen_random_uuid(), evidence_id uuid not null references public.skill_evidence(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade, reason text not null check(char_length(reason) between 10 and 2000),
  status text not null default 'open' check(status in ('open','upheld','overturned','closed')),
  created_at timestamptz not null default now(), resolved_at timestamptz
);
alter table public.evidence_rubrics enable row level security; alter table public.evidence_reviews enable row level security; alter table public.evidence_appeals enable row level security;
create policy "published rubrics readable" on public.evidence_rubrics for select using(status='published');
create policy "learners read reviews of own evidence" on public.evidence_reviews for select using(exists(select 1 from public.skill_evidence e where e.id=evidence_id and e.user_id=auth.uid()));
create policy "learners read own appeals" on public.evidence_appeals for select using(auth.uid()=user_id);
create policy "learners create own appeals" on public.evidence_appeals for insert with check(auth.uid()=user_id and exists(select 1 from public.skill_evidence e where e.id=evidence_id and e.user_id=auth.uid()));
insert into public.evidence_rubrics(slug,version,skill_slug,title,criteria,status,published_at) values
('wiring-board-v1','1.0','control-circuit-wiring','{"en":"Start/stop wiring-board project","hi":"Start/stop wiring-board project"}','[{"key":"safety","weight":30},{"key":"accuracy","weight":30},{"key":"workmanship","weight":25},{"key":"explanation","weight":15}]','published',now());
