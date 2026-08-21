create table public.interview_sessions (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 target_role_slug text not null, language text not null check(language in ('en','hi')), mode text not null default 'text' check(mode in ('text','audio','video')),
 status text not null check(status in ('in_progress','completed','abandoned')), question_count smallint not null,
 score_summary jsonb not null default '{}'::jsonb, started_at timestamptz not null default now(), completed_at timestamptz
);
create table public.interview_responses (
 id uuid primary key default gen_random_uuid(), session_id uuid not null references public.interview_sessions(id) on delete cascade,
 position smallint not null, question_text text not null, answer_text text not null check(char_length(answer_text)<=5000),
 ai_feedback text not null, prompt_version text not null, created_at timestamptz not null default now(), unique(session_id,position)
);
create table public.interview_feedback_dimensions (
 id uuid primary key default gen_random_uuid(), session_id uuid not null references public.interview_sessions(id) on delete cascade,
 dimension text not null, score smallint not null check(score between 0 and 100), explanation text not null,
 evidence_response_positions smallint[] not null default '{}', unique(session_id,dimension)
);
create index interview_session_user_idx on public.interview_sessions(user_id,started_at desc);
alter table public.interview_sessions enable row level security; alter table public.interview_responses enable row level security; alter table public.interview_feedback_dimensions enable row level security;
create policy "learners manage own interview sessions" on public.interview_sessions for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "learners read own interview responses" on public.interview_responses for select using(exists(select 1 from public.interview_sessions s where s.id=session_id and s.user_id=auth.uid()));
create policy "learners create own interview responses" on public.interview_responses for insert with check(exists(select 1 from public.interview_sessions s where s.id=session_id and s.user_id=auth.uid()));
create policy "learners read own interview dimensions" on public.interview_feedback_dimensions for select using(exists(select 1 from public.interview_sessions s where s.id=session_id and s.user_id=auth.uid()));
