create table public.learning_paths (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  target_role_slug text not null, source_attempt_id uuid references public.assessment_attempts(id),
  status text not null default 'active' check (status in ('active','completed','archived')), created_at timestamptz not null default now()
);
create table public.learning_units (
  id text primary key, version text not null, position smallint not null, skill_slug text not null,
  title jsonb not null, description jsonb not null, status text not null check (status in ('draft','published','retired')),
  created_at timestamptz not null default now()
);
create table public.learning_lessons (
  id text primary key, unit_id text not null references public.learning_units(id), position smallint not null,
  lesson_type text not null check (lesson_type in ('video','reading','practice','evidence')),
  title jsonb not null, objective jsonb not null, youtube_video_id text, drive_file_id text,
  duration_seconds integer, content_reviewed_at timestamptz, status text not null check (status in ('draft','published','retired'))
);
create table public.path_units (
  path_id uuid not null references public.learning_paths(id) on delete cascade, unit_id text not null references public.learning_units(id),
  position smallint not null, reason jsonb not null, primary key(path_id,unit_id)
);
create table public.learning_progress (
  user_id uuid not null references auth.users(id) on delete cascade, lesson_id text not null references public.learning_lessons(id),
  status text not null default 'not_started' check (status in ('not_started','in_progress','completed')),
  progress_percent smallint not null default 0 check (progress_percent between 0 and 100), last_position_seconds integer not null default 0,
  started_at timestamptz, completed_at timestamptz, updated_at timestamptz not null default now(), primary key(user_id,lesson_id)
);
create table public.learning_notes (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null references public.learning_lessons(id), body text not null check (char_length(body) <= 5000),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index learning_path_user_idx on public.learning_paths(user_id,status);
create index lesson_unit_position_idx on public.learning_lessons(unit_id,position);
alter table public.learning_paths enable row level security; alter table public.learning_units enable row level security;
alter table public.learning_lessons enable row level security; alter table public.path_units enable row level security;
alter table public.learning_progress enable row level security; alter table public.learning_notes enable row level security;
create policy "learners read own paths" on public.learning_paths for select using(auth.uid()=user_id);
create policy "published units readable" on public.learning_units for select using(status='published');
create policy "published lessons readable" on public.learning_lessons for select using(status='published');
create policy "learners read own path units" on public.path_units for select using(exists(select 1 from public.learning_paths p where p.id=path_id and p.user_id=auth.uid()));
create policy "learners read own progress" on public.learning_progress for select using(auth.uid()=user_id);
create policy "learners create own progress" on public.learning_progress for insert with check(auth.uid()=user_id);
create policy "learners update own progress" on public.learning_progress for update using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "learners manage own notes" on public.learning_notes for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
insert into public.learning_units(id,version,position,skill_slug,title,description,status) values
('electrical-drawings-v1','1.0',2,'control-circuit-interpretation','{"en":"Electrical drawings","hi":"Electrical drawings"}','{"en":"Read and trace industrial control circuits.","hi":"Industrial control circuits पढ़ें और trace करें।"}','published');
insert into public.learning_lessons(id,unit_id,position,lesson_type,title,objective,duration_seconds,content_reviewed_at,status) values
('symbols','electrical-drawings-v1',1,'video','{"en":"Reading control symbols","hi":"Control symbols पढ़ना"}','{"en":"Identify and explain standard control symbols.","hi":"Standard control symbols पहचानें और explain करें।"}',522,now(),'published');
