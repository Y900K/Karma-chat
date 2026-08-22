-- P1/P2 scale foundation: versioned metrics, regional taxonomy, durable workers,
-- privacy-safe aggregates, bounded rate limits, and online archive staging.

create table public.metric_definitions(
  metric_key text not null,
  version text not null,
  label_en text not null,
  label_hi text,
  grain text not null check(grain in('learner','cohort','organization','region','platform')),
  source_description text not null,
  minimum_group_size integer not null default 10 check(minimum_group_size between 1 and 1000),
  owner text not null,
  status text not null default 'draft' check(status in('draft','active','retired')),
  effective_at timestamptz not null default now(),
  retired_at timestamptz,
  created_at timestamptz not null default now(),
  primary key(metric_key,version)
);
alter table public.metric_definitions enable row level security;
create policy "active metric definitions readable" on public.metric_definitions for select using(status='active' or public.is_platform_staff());
create policy "staff manage metric definitions" on public.metric_definitions for all using(public.is_platform_staff()) with check(public.is_platform_staff());
insert into public.metric_definitions(metric_key,version,label_en,label_hi,grain,source_description,minimum_group_size,owner,status) values
('role_readiness','0.4.2','Role readiness','भूमिका readiness','cohort','Latest versioned learner readiness snapshot',10,'Learning & Evidence','active'),
('application_conversion','1.0.0','Application conversion','Application conversion','organization','Submitted applications progressing to offers',10,'Employer Operations','active'),
('verified_placement','1.0.0','Verified placements','सत्यापित placements','region','Learner-confirmed joining outcomes',10,'Impact & Governance','active')
on conflict do nothing;

create or replace view public.learner_dashboard_rollups with(security_invoker=true) as
select u.user_id,
  coalesce((select max(r.overall_score) from public.readiness_snapshots r where r.user_id=u.user_id and r.calculated_at=(select max(r2.calculated_at) from public.readiness_snapshots r2 where r2.user_id=u.user_id)),0) readiness_score,
  (select count(*) from public.learning_progress p where p.user_id=u.user_id and p.status='completed') completed_lessons,
  (select count(*) from public.skill_evidence e where e.user_id=u.user_id and e.verification_status='verified') verified_evidence,
  (select count(*) from public.applications a where a.user_id=u.user_id) application_count,
  (select count(*) from public.notifications n where n.user_id=u.user_id and n.read_at is null and n.archived_at is null) unread_notifications
from public.user_accounts u;

create or replace view public.cohort_latest_metric_snapshots with(security_invoker=true) as
select distinct on(s.cohort_id) s.*
from public.cohort_metric_snapshots s
order by s.cohort_id,s.captured_on desc;

create or replace view public.employer_job_rollups with(security_invoker=true) as
select j.id job_id,j.organization_id,j.status,
  count(a.id)::integer application_count,
  count(a.id) filter(where a.status in('offer','accepted'))::integer offer_count,
  max(a.updated_at) last_activity_at
from public.jobs j left join public.applications a on a.job_id=j.id
group by j.id,j.organization_id,j.status;

create or replace view public.government_metric_rollups with(security_invoker=true) as
select s.id,s.program_organization_id,s.geography_level,s.geography_code,s.metric_key,
  s.metric_value,s.cohort_size,s.period_start,s.period_end,s.dimensions
from public.aggregate_metric_snapshots s
where not s.suppressed;

create table public.regions(
  code text primary key,
  name_en text not null,
  name_hi text,
  level text not null check(level in('country','state','district')),
  parent_code text references public.regions(code),
  status text not null default 'active' check(status in('active','retired')),
  created_at timestamptz not null default now()
);
insert into public.regions(code,name_en,name_hi,level,parent_code) values
('IN','India','भारत','country',null),
('IN-UK','Uttarakhand','उत्तराखंड','state','IN'),
('IN-MH','Maharashtra','महाराष्ट्र','state','IN'),
('IN-KA','Karnataka','कर्नाटक','state','IN') on conflict do nothing;

create table public.taxonomy_versions(
  taxonomy_key text not null,
  version text not null,
  region_code text references public.regions(code),
  source_name text not null,
  status text not null default 'draft' check(status in('draft','active','retired')),
  effective_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  primary key(taxonomy_key,version)
);
create table public.taxonomy_terms(
  taxonomy_key text not null,
  taxonomy_version text not null,
  term_code text not null,
  parent_term_code text,
  label_en text not null,
  label_hi text,
  aliases text[] not null default '{}',
  metadata jsonb not null default '{}',
  primary key(taxonomy_key,taxonomy_version,term_code),
  foreign key(taxonomy_key,taxonomy_version) references public.taxonomy_versions(taxonomy_key,version)
);
create table public.resource_taxonomy_mappings(
  resource_type text not null check(resource_type in('job','content','role','assessment')),
  resource_id text not null,
  taxonomy_key text not null,
  taxonomy_version text not null,
  term_code text not null,
  region_code text references public.regions(code),
  confidence numeric(4,3) check(confidence between 0 and 1),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  primary key(resource_type,resource_id,taxonomy_key,taxonomy_version,term_code),
  foreign key(taxonomy_key,taxonomy_version,term_code) references public.taxonomy_terms(taxonomy_key,taxonomy_version,term_code)
);
alter table public.regions enable row level security;alter table public.taxonomy_versions enable row level security;alter table public.taxonomy_terms enable row level security;alter table public.resource_taxonomy_mappings enable row level security;
create policy "active regions readable" on public.regions for select using(status='active');
create policy "active taxonomies readable" on public.taxonomy_versions for select using(status='active' or public.is_platform_staff());
create policy "active taxonomy terms readable" on public.taxonomy_terms for select using(exists(select 1 from public.taxonomy_versions v where v.taxonomy_key=taxonomy_terms.taxonomy_key and v.version=taxonomy_terms.taxonomy_version and (v.status='active' or public.is_platform_staff())));
create policy "reviewed taxonomy mappings readable" on public.resource_taxonomy_mappings for select using(reviewed_at is not null or public.is_platform_staff());
create policy "staff manage regions" on public.regions for all using(public.is_platform_staff()) with check(public.is_platform_staff());
create policy "staff manage taxonomy versions" on public.taxonomy_versions for all using(public.is_platform_staff()) with check(public.is_platform_staff());
create policy "staff manage taxonomy terms" on public.taxonomy_terms for all using(public.is_platform_staff()) with check(public.is_platform_staff());
create policy "staff manage taxonomy mappings" on public.resource_taxonomy_mappings for all using(public.is_platform_staff()) with check(public.is_platform_staff());

alter table public.transactional_outbox add column if not exists locked_by text;
alter table public.transactional_outbox add column if not exists last_error text;
alter table public.transactional_outbox add column if not exists consumer_result jsonb;
create table public.outbox_consumptions(
  event_id bigint not null references public.transactional_outbox(id) on delete cascade,
  consumer_key text not null,
  status text not null check(status in('processing','completed','failed')),
  result jsonb,
  last_error text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  primary key(event_id,consumer_key)
);
alter table public.outbox_consumptions enable row level security;

create or replace function public.claim_outbox_events(p_worker text,p_limit integer default 25)
returns setof public.transactional_outbox language plpgsql security definer set search_path=public,pg_temp as $$
begin
  if auth.role()<>'service_role' then raise exception 'service_role required'; end if;
  if char_length(p_worker)<8 then raise exception 'invalid worker'; end if;
  return query
  with claimed as(
    select id from public.transactional_outbox
    where status in('pending','failed') and available_at<=now()
    order by available_at,id for update skip locked limit least(greatest(p_limit,1),100)
  )
  update public.transactional_outbox o set status='processing',locked_at=now(),locked_by=p_worker,attempt_count=o.attempt_count+1
  from claimed where o.id=claimed.id returning o.*;
end$$;
create or replace function public.complete_outbox_event(p_event_id bigint,p_worker text,p_result jsonb default '{}')
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
begin
  if auth.role()<>'service_role' then raise exception 'service_role required'; end if;
  update public.transactional_outbox set status='completed',completed_at=now(),consumer_result=p_result,last_error=null
  where id=p_event_id and status='processing' and locked_by=p_worker;
  return found;
end$$;
create or replace function public.fail_outbox_event(p_event_id bigint,p_worker text,p_error text)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare v_attempt integer;
begin
  if auth.role()<>'service_role' then raise exception 'service_role required'; end if;
  select attempt_count into v_attempt from public.transactional_outbox where id=p_event_id and locked_by=p_worker for update;
  if not found then return false; end if;
  update public.transactional_outbox set status=case when v_attempt>=8 then 'dead_letter' else 'failed' end,
    available_at=now()+make_interval(secs=>least(3600,30*(2^least(v_attempt,7)))),last_error=left(p_error,2000),locked_at=null,locked_by=null
  where id=p_event_id;
  return true;
end$$;
revoke all on function public.claim_outbox_events(text,integer) from public,anon,authenticated;
revoke all on function public.complete_outbox_event(bigint,text,jsonb) from public,anon,authenticated;
revoke all on function public.fail_outbox_event(bigint,text,text) from public,anon,authenticated;
grant execute on function public.claim_outbox_events(text,integer),public.complete_outbox_event(bigint,text,jsonb),public.fail_outbox_event(bigint,text,text) to service_role;

create table public.webhook_subscriptions(
  id uuid primary key default gen_random_uuid(),
  integration_client_id uuid not null references public.integration_clients(id) on delete cascade,
  event_type text not null,
  endpoint_url text not null check(endpoint_url like 'https://%'),
  status text not null default 'active' check(status in('active','paused','revoked')),
  created_at timestamptz not null default now(),
  unique(integration_client_id,event_type,endpoint_url)
);
alter table public.webhook_deliveries add column if not exists idempotency_key text;
alter table public.webhook_deliveries add column if not exists locked_by text;
alter table public.webhook_deliveries add column if not exists locked_at timestamptz;
create unique index if not exists webhook_delivery_idempotency_idx on public.webhook_deliveries(integration_client_id,idempotency_key) where idempotency_key is not null;
alter table public.webhook_subscriptions enable row level security;
create policy "staff manage webhook subscriptions" on public.webhook_subscriptions for all using(public.is_platform_staff()) with check(public.is_platform_staff());

create or replace function public.enqueue_event_webhooks(p_event_id bigint)
returns integer language plpgsql security definer set search_path=public,pg_temp as $$
declare v_event public.transactional_outbox;v_count integer;
begin
  if auth.role()<>'service_role' then raise exception 'service_role required'; end if;
  select * into v_event from public.transactional_outbox where id=p_event_id;
  insert into public.webhook_deliveries(integration_client_id,event_type,payload,endpoint_url,idempotency_key)
  select s.integration_client_id,v_event.event_type,v_event.payload,s.endpoint_url,'outbox:'||v_event.id::text
  from public.webhook_subscriptions s join public.integration_clients c on c.id=s.integration_client_id
  where s.event_type=v_event.event_type and s.status='active' and c.status='active'
  on conflict do nothing;
  get diagnostics v_count=row_count;return v_count;
end$$;
create or replace function public.claim_webhook_deliveries(p_worker text,p_limit integer default 25)
returns setof public.webhook_deliveries language plpgsql security definer set search_path=public,pg_temp as $$
begin
  if auth.role()<>'service_role' then raise exception 'service_role required'; end if;
  return query with claimed as(select id from public.webhook_deliveries where status in('pending','failed') and next_attempt_at<=now() order by next_attempt_at,id for update skip locked limit least(greatest(p_limit,1),100))
  update public.webhook_deliveries d set status='processing',locked_at=now(),locked_by=p_worker,attempt_count=d.attempt_count+1 from claimed where d.id=claimed.id returning d.*;
end$$;
create or replace function public.finish_webhook_delivery(p_delivery_id bigint,p_worker text,p_success boolean,p_response_code integer,p_error text default null)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare v_attempt integer;
begin
  if auth.role()<>'service_role' then raise exception 'service_role required'; end if;
  select attempt_count into v_attempt from public.webhook_deliveries where id=p_delivery_id and locked_by=p_worker for update;
  if not found then return false; end if;
  update public.webhook_deliveries set status=case when p_success then 'delivered' when v_attempt>=8 then 'dead_letter' else 'failed' end,
    response_code=p_response_code,last_error=left(p_error,2000),delivered_at=case when p_success then now() else null end,
    next_attempt_at=case when p_success then next_attempt_at else now()+make_interval(secs=>least(3600,30*(2^least(v_attempt,7)))) end,
    locked_at=null,locked_by=null where id=p_delivery_id;
  return true;
end$$;
revoke all on function public.enqueue_event_webhooks(bigint),public.claim_webhook_deliveries(text,integer),public.finish_webhook_delivery(bigint,text,boolean,integer,text) from public,anon,authenticated;
grant execute on function public.enqueue_event_webhooks(bigint),public.claim_webhook_deliveries(text,integer),public.finish_webhook_delivery(bigint,text,boolean,integer,text) to service_role;

create table public.rate_limit_buckets(
  subject_type text not null check(subject_type in('user','organization','ip')),
  subject_hash text not null,
  action text not null,
  window_started_at timestamptz not null,
  request_count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key(subject_type,subject_hash,action,window_started_at)
);
create table public.abuse_signals(
  id bigint generated always as identity primary key,
  subject_type text not null,
  subject_hash text not null,
  action text not null,
  signal_type text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
alter table public.rate_limit_buckets enable row level security;alter table public.abuse_signals enable row level security;
create policy "staff read abuse signals" on public.abuse_signals for select using(public.is_platform_staff());
create or replace function public.consume_rate_limit(p_subject_type text,p_subject_hash text,p_action text,p_limit integer,p_window_seconds integer)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare v_window timestamptz;v_count integer;
begin
  if auth.role()<>'service_role' then raise exception 'service_role required'; end if;
  if p_subject_type not in('user','organization','ip') or p_limit<1 or p_limit>10000 or p_window_seconds<10 or p_window_seconds>86400 or char_length(p_subject_hash)<16 then raise exception 'invalid rate limit'; end if;
  v_window=to_timestamp(floor(extract(epoch from now())/p_window_seconds)*p_window_seconds);
  insert into public.rate_limit_buckets(subject_type,subject_hash,action,window_started_at,request_count) values(p_subject_type,p_subject_hash,p_action,v_window,1)
  on conflict(subject_type,subject_hash,action,window_started_at) do update set request_count=rate_limit_buckets.request_count+1,updated_at=now()
  returning request_count into v_count;
  if v_count>p_limit and (v_count=p_limit+1 or v_count%(p_limit*5)=0) then insert into public.abuse_signals(subject_type,subject_hash,action,signal_type,metadata) values(p_subject_type,p_subject_hash,p_action,'rate_limit_exceeded',jsonb_build_object('count',v_count,'limit',p_limit)); end if;
  return v_count<=p_limit;
end$$;
revoke all on function public.consume_rate_limit(text,text,text,integer,integer) from public,anon,authenticated;
grant execute on function public.consume_rate_limit(text,text,text,integer,integer) to service_role;
create index rate_limit_expiry_idx on public.rate_limit_buckets(window_started_at);
create index abuse_signal_time_idx on public.abuse_signals(action,created_at desc);

alter table public.background_jobs add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.background_jobs add column if not exists organization_id uuid references public.organizations(id) on delete cascade;
alter table public.background_jobs add column if not exists idempotency_key text;
alter table public.background_jobs add column if not exists result jsonb;
alter table public.background_jobs add column if not exists locked_by text;
alter table public.background_jobs add column if not exists expires_at timestamptz;
create unique index if not exists background_job_idempotency_idx on public.background_jobs(user_id,job_type,idempotency_key) where idempotency_key is not null;
create policy "users read own background jobs" on public.background_jobs for select using(user_id=auth.uid());
create or replace function public.enqueue_ai_analysis_job(p_idempotency_key text,p_payload jsonb)
returns bigint language plpgsql security definer set search_path=public,pg_temp as $$
declare v_user uuid:=auth.uid();v_id bigint;
begin
  if v_user is null then raise exception 'unauthenticated'; end if;
  if char_length(p_idempotency_key)<16 or jsonb_typeof(p_payload)<>'object' then raise exception 'invalid job'; end if;
  insert into public.background_jobs(job_type,payload,user_id,idempotency_key,expires_at) values('interview_analysis',p_payload,v_user,p_idempotency_key,now()+interval '30 days')
  on conflict(user_id,job_type,idempotency_key) where idempotency_key is not null do update set idempotency_key=excluded.idempotency_key returning id into v_id;
  return v_id;
end$$;
grant execute on function public.enqueue_ai_analysis_job(text,jsonb) to authenticated;
create or replace function public.claim_background_jobs(p_worker text,p_limit integer default 10)
returns setof public.background_jobs language plpgsql security definer set search_path=public,pg_temp as $$
begin
  if auth.role()<>'service_role' then raise exception 'service_role required'; end if;
  return query with claimed as(select id from public.background_jobs where status in('pending','failed') and available_at<=now() order by available_at,id for update skip locked limit least(greatest(p_limit,1),25))
  update public.background_jobs j set status='processing',locked_at=now(),locked_by=p_worker,attempt_count=j.attempt_count+1 from claimed where j.id=claimed.id returning j.*;
end$$;
create or replace function public.finish_background_job(p_job_id bigint,p_worker text,p_success boolean,p_result jsonb default null,p_error text default null)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare v_attempt integer;
begin
  if auth.role()<>'service_role' then raise exception 'service_role required'; end if;
  select attempt_count into v_attempt from public.background_jobs where id=p_job_id and locked_by=p_worker for update;
  if not found then return false; end if;
  update public.background_jobs set status=case when p_success then 'completed' when v_attempt>=5 then 'dead_letter' else 'failed' end,
    result=case when p_success then p_result else result end,last_error=left(p_error,2000),completed_at=case when p_success then now() else null end,
    available_at=case when p_success then available_at else now()+make_interval(secs=>least(3600,60*(2^least(v_attempt,6)))) end,
    locked_at=null,locked_by=null where id=p_job_id;
  return true;
end$$;
revoke all on function public.claim_background_jobs(text,integer),public.finish_background_job(bigint,text,boolean,jsonb,text) from public,anon,authenticated;
grant execute on function public.claim_background_jobs(text,integer),public.finish_background_job(bigint,text,boolean,jsonb,text) to service_role;

create table public.analytics_events_archive(like public.analytics_events including defaults including constraints) partition by range(occurred_at);
create table public.analytics_events_archive_default partition of public.analytics_events_archive default;
create table public.audit_events_archive(like public.audit_events including defaults including constraints) partition by range(created_at);
create table public.audit_events_archive_default partition of public.audit_events_archive default;
create table public.transactional_outbox_archive(like public.transactional_outbox including defaults including constraints) partition by range(created_at);
create table public.transactional_outbox_archive_default partition of public.transactional_outbox_archive default;
alter table public.analytics_events_archive enable row level security;alter table public.audit_events_archive enable row level security;alter table public.transactional_outbox_archive enable row level security;
create table public.retention_policies(
  record_category text primary key,
  hot_days integer not null check(hot_days between 1 and 3650),
  archive_days integer not null check(archive_days>=hot_days),
  delete_days integer check(delete_days is null or delete_days>=archive_days),
  legal_basis text not null,
  owner text not null,
  updated_at timestamptz not null default now()
);
insert into public.retention_policies values
('analytics_events',90,365,730,'Product improvement with minimized identifiers','Data Protection'),
('audit_events',365,2555,null,'Security, accountability, and dispute evidence','Security & Governance'),
('transactional_outbox',30,180,365,'Reliable delivery and incident diagnosis','Platform Engineering') on conflict do nothing;
alter table public.retention_policies enable row level security;
create policy "staff read retention policies" on public.retention_policies for select using(public.is_platform_staff());
create policy "staff manage retention policies" on public.retention_policies for all using(public.is_platform_staff()) with check(public.is_platform_staff());

create table public.service_level_objectives(
  service_key text not null,
  version text not null,
  indicator text not null,
  target numeric not null,
  window_days integer not null,
  owner text not null,
  status text not null default 'active' check(status in('active','retired')),
  primary key(service_key,version,indicator)
);
insert into public.service_level_objectives values
('interactive_api','1.0','availability_percent',99.5,30,'Platform Engineering','active'),
('interactive_api','1.0','p95_latency_ms',1500,30,'Platform Engineering','active'),
('async_ai','1.0','p95_completion_minutes',5,30,'AI Operations','active'),
('webhook_delivery','1.0','p95_delivery_minutes',10,30,'Integrations','active') on conflict do nothing;
alter table public.service_level_objectives enable row level security;
create policy "active slos readable" on public.service_level_objectives for select using(status='active' or public.is_platform_staff());

create index if not exists jobs_keyset_idx on public.jobs(published_at desc,id desc) where status='published';
create index if not exists applications_job_keyset_idx on public.applications(job_id,submitted_at desc,id desc);
create index if not exists cases_keyset_idx on public.governance_cases(program_organization_id,created_at desc,id desc);
create index if not exists audit_keyset_idx on public.audit_events(organization_id,created_at desc,id desc);
create index if not exists notifications_keyset_idx on public.notifications(user_id,created_at desc,id desc) where archived_at is null;

-- Publishing requires technical, language, and accessibility evidence. Existing
-- approved records remain readable; every future approval/update must pass this gate.
create or replace function public.enforce_external_resource_publish_gate() returns trigger language plpgsql security invoker set search_path=public,pg_temp as $$
begin
  if new.review_status='approved' and (
    new.permission_status<>'valid' or new.reviewed_by is null or new.reviewed_at is null or new.next_review_at is null or
    nullif(trim(coalesce(new.text_fallback,'')),'') is null or
    (new.provider='youtube' and not new.captions_available) or
    coalesce((new.metadata->>'translation_reviewed')::boolean,false)=false or
    coalesce((new.metadata->>'accessibility_reviewed')::boolean,false)=false
  ) then raise exception 'approved resources require valid permission, review dates, captions/text fallback, translation and accessibility review'; end if;
  return new;
end$$;
drop trigger if exists external_resource_publish_gate on public.external_resources;
create trigger external_resource_publish_gate before insert or update on public.external_resources for each row execute function public.enforce_external_resource_publish_gate();
