# KarmaSetu AI — Production Improvement & Scalability Plan

Research date: 21 August 2026  
Scope: current Next.js 16 + Vercel + Supabase + NVIDIA NIM + YouTube/Google Drive architecture

## Executive assessment

KarmaSetu now demonstrates the full product vision across learner, institute, employer, government and platform personas. Its visual system, route coverage, data-domain decomposition and responsible-product principles are unusually complete for a prototype.

It is not yet safe to treat as a production platform. Most screens are client-rendered demonstrations with embedded sample data. The database has broad schema coverage but has not been exercised through a real migration, seed, authorization-test and rollback workflow. The current AI endpoint lacks authentication, rate limiting, grounded retrieval, request timeouts and production usage controls. Several important mutations are performed as multiple independent browser calls, so partial failure can leave inconsistent records.

The correct next move is not to add more screens. It is to build one reliable vertical slice—learner onboarding → diagnostic → learning → evidence → interview → application—using real server-authorized data, then extend the same architecture to institute and employer workflows.

## Research-backed direction

- Next.js recommends Server Components by default, narrow `use client` boundaries, server-side validation/authorization for every mutation, explicit caching decisions, streaming/loading boundaries, global error handling, Core Web Vitals collection and bundle analysis. The current project has 23 client page components, so reducing client boundaries is a material scalability and performance opportunity. [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist)
- Server Actions/Functions are reachable through direct POST requests; authorization must be performed inside each action, not only in the interface or routing proxy. [Next.js mutation security guidance](https://nextjs.org/docs/app/getting-started/mutating-data)
- Supabase’s production checklist requires RLS review, Security Advisor, query/index review, load testing, custom SMTP and an intentional backup/PITR strategy. Free projects may pause and downloadable backups are unavailable on the free plan. [Supabase production checklist](https://supabase.com/docs/guides/deployment/going-into-prod)
- For temporary/serverless clients, Supabase recommends transaction-mode pooling; pool size must leave capacity for Auth, Storage and platform services. [Supabase connection guidance](https://supabase.com/docs/guides/database/connecting-to-postgres), [connection management](https://supabase.com/docs/guides/database/connection-management)
- Vercel Fluid Compute is enabled by default for newer projects and is useful for I/O-bound AI/API work through concurrent invocations. Shared process state must not contain request/user-specific data. [Vercel Fluid Compute](https://vercel.com/docs/fluid-compute)
- Supabase supports `pg_cron`, queues and Edge Functions for scheduled work; official guidance recommends no more than eight concurrent cron jobs and jobs under ten minutes. [Supabase Cron](https://supabase.com/docs/guides/cron), [scheduled Edge Functions](https://supabase.com/docs/guides/functions/schedule-functions)
- Supabase documents an automatic-embedding pattern using a queue, Edge Function, `pg_cron`, pgvector and an HNSW index. This is a better fit than generating embeddings synchronously during content publishing. [Supabase automatic embeddings](https://supabase.com/docs/guides/ai/automatic-embeddings)
- YouTube’s privacy-enhanced mode uses `youtube-nocookie.com` and avoids using embedded views for browsing personalization. KarmaSetu already uses that host and should preserve the pattern. [YouTube privacy-enhanced embedding](https://support.google.com/youtube/answer/171780)
- Google Drive permissions are ACL-based and inherited through folders. The product must verify each resource’s effective permission rather than trusting a pasted URL. [Google Drive sharing and ACLs](https://developers.google.com/workspace/drive/api/guides/manage-sharing)
- Vercel provides firewall observability, bot detection and WAF rate-limit/challenge controls. These should sit in front of public auth, AI, analytics and grievance endpoints, with application-level per-user quotas behind them. [Vercel Firewall observability](https://vercel.com/docs/vercel-firewall/firewall-observability), [Vercel Bot Management](https://vercel.com/docs/bot-management)

## Current-state audit

### What is strong

1. The product domains are correctly separated: assessment, learning, evidence, interviews, matching, organization operations, governance and trust.
2. NVIDIA credentials remain server-only and `.env.local` is ignored.
3. Supabase RLS is enabled across the proposed public tables.
4. Consent, evidence provenance, model versions, audit events and outcome follow-up exist in the conceptual schema.
5. YouTube uses the privacy-enhanced embed host and Drive content is treated as an approved external resource.
6. GitHub CI, production build, type checking, secret scanning, security headers and deployment instructions exist.
7. The UX consistently explains scores and rejects autonomous hiring decisions.

### Production gaps found in the repository

| Severity | Finding | Why it matters | Required correction |
|---|---|---|---|
| Critical | `/api/ai` is callable without authentication or a quota | The NVIDIA free/evaluation allowance can be exhausted or abused by bots | Require a verified session, per-user/IP token bucket, daily budget, Vercel WAF rule and request audit |
| Critical | Persona routes are only optimistically protected by `proxy.ts` | A signed-in learner is not proven to be an institute, employer, government or platform administrator | Add a server-side DAL and authorize persona + active organization membership at every page/query/mutation |
| Critical | Multi-step workflows write directly from Client Components | Diagnostic, evidence and application flows can partially succeed | Move to server actions/RPC transactions with idempotency keys and transactional outbox events |
| Critical | RLS is structurally checked but not behaviorally tested | Cross-organization leakage can survive “RLS enabled” checks | Run migrations in disposable Supabase/Postgres and test learner A/B, institute A/B, employer A/B, anonymous and suspended roles |
| Critical | Public profile route ignores the supplied token and renders demo data | A real share route would not enforce expiry, revocation, sections or view limits | Resolve only a hashed token through a security-definer RPC returning a minimal DTO; reject expired/revoked links |
| High | 23 page components are client components with sample arrays | Larger bundles, duplicated logic and no authoritative server data | Convert page shells and reads to Server Components; retain small client islands for filters/forms/3D |
| High | AI input validation is shallow | No role schema, prompt version, timeout, retry policy, structured output or content boundary | Add Zod schemas, allowed roles/tasks, AbortController timeout, stable error classes and JSON-schema output |
| High | AI is not grounded in approved content | The coach can answer from model memory and hallucinate career or learning guidance | Add retrieval from approved, versioned content chunks with citations and “insufficient evidence” behavior |
| High | AI usage is not connected to `ai_request_audits` | Cost, latency, failures and model regressions cannot be governed | Record task/model/prompt version, tokens, latency, status and safety flags asynchronously |
| High | Database migrations are numerous but unexecuted in CI | Syntax, dependency order, policy recursion and rollback failures are unknown | Use Supabase CLI locally/CI, reset from zero, seed, test, inspect advisors and validate downgrade/forward-fix procedures |
| High | Background workflows exist only as tables | Reminders, link scans, embeddings, exports and retention follow-ups will not run | Add durable queues, retry/dead-letter rules, cron producers and idempotent consumers |
| High | External resource registry is not connected to Drive/YouTube APIs | Broken/private/removed content can remain assigned to learners | Scheduled metadata, permission, caption and availability checks; auto-unpublish unsafe resources |
| Medium | Analytics ingestion is anonymous and unthrottled | It can be spammed and inflate metrics | Sign authenticated events server-side; rate limit anonymous events; derive business outcomes from transactional tables |
| Medium | Only four static tests exist | User journeys and authorization are not covered | Unit, database/RLS, contract and Playwright E2E suites with seeded personas |
| Medium | No CSP, global error boundary or branded not-found experience | Weaker browser defense and poor recovery | Add nonce/hash-compatible CSP, `global-error.tsx`, `not-found.tsx` and safe request IDs |
| Medium | All analytics live in the operational database | Reporting queries will compete with learner transactions as volume grows | Begin with aggregate snapshots; later replicate/ETL to a warehouse when query load justifies it |
| Medium | NVIDIA free API is treated as a durable backend | Evaluation quotas and model availability are not an SLA | Implement provider adapter, task-based models, fallback policy and hard budget controls; fund production usage before pilot hiring |

## Target architecture

```text
Browser / low-end Android
        │
        ▼
Vercel CDN + WAF + Bot controls
        │
        ├── Public cached pages (story, trust, role explorer)
        │
        └── Next.js Server Components / Actions / Route Handlers
              │   authentication + authorization + validation
              │   idempotency + request ID + structured logging
              │
              ├── Supabase Data API / RPC
              │      ├── Postgres primary: transactional product state
              │      ├── RLS: final authorization boundary
              │      ├── private Storage: evidence and exports
              │      └── outbox + queue: durable asynchronous work
              │
              ├── AI gateway
              │      ├── per-user quota and budget
              │      ├── approved prompt/model registry
              │      ├── retrieval + citations
              │      ├── NVIDIA NIM adapter
              │      └── safety/evaluation/audit
              │
              └── Job workers
                     ├── notifications and quiet hours
                     ├── embeddings and content checks
                     ├── data exports and deletion workflows
                     ├── readiness/match recomputation
                     └── placement retention follow-ups

Analytics: transactional outbox → aggregate snapshots → warehouse only when needed
Observability: Vercel logs/traces + Supabase logs/advisors + product SLO dashboards
```

## Data and multi-tenancy design

### Immediate corrections

1. Create a single `organization_memberships` model with `organization_type` and role grants rather than three parallel membership systems, or publish an explicit reason for keeping them separate. Parallel models will make invitations, audits and authorization inconsistent.
2. Add `organization_id` to every organization-owned aggregate and operation table. Never infer tenancy only through a long join when a stable scoped foreign key is available.
3. Move sensitive/internal-only tables to a non-exposed schema. Expose minimal RPCs/views rather than every operational table through the Data API.
4. Revoke public execution on every `SECURITY DEFINER` function, grant only to intended roles, set a fixed `search_path`, schema-qualify references and test for privilege escalation.
5. Replace broad `FOR ALL` policies with operation-specific policies. A user allowed to read a record is not automatically allowed to delete it.
6. Use append-only events for consent, application status, scoring/model releases and high-impact decisions. Materialized “current state” can be derived but history must remain auditable.
7. Add idempotency keys to assessment completion, evidence submission, applications, notifications, AI jobs and payment-like future operations.

### Partitioning and archiving thresholds

Do not partition early. Add monthly time partitions when a high-write table exceeds roughly 10–20 million rows or maintenance/query plans show measurable need. Likely candidates: analytics events, audit events, notification deliveries and AI audits. Before partitioning, enforce retention deletion and archive cold data.

Keep learner-facing transactional data in the primary database. Move large analytical scans to aggregate tables first. Add a read replica only when observed read pressure or latency warrants it; Supabase notes replicas are asynchronous and not used directly by Auth/Storage/Realtime. [Supabase Read Replicas](https://supabase.com/docs/guides/platform/read-replicas)

## AI and retrieval improvement plan

### Gateway contract

Every AI request should carry:

- authenticated `user_id` and authorized task;
- `request_id`, idempotency key and locale;
- prompt key/version and model key;
- bounded, schema-validated input;
- retrieval scope and consent state;
- maximum input/output tokens, timeout and cost ceiling.

Every response should return:

- structured task-specific JSON;
- cited source IDs and source versions;
- confidence/insufficient-context state;
- policy flags and human-handoff indicator;
- latency, token usage and provider request ID in server logs—not the client payload unless needed.

### Retrieval architecture

1. Ingest only approved first-party text, approved YouTube transcripts/caption-derived summaries and approved Drive text extracts.
2. Store immutable source version, owner, language, skill/role mapping, review date and access scope on every chunk.
3. Generate embeddings asynchronously through a queue; never block content publishing on the external model call.
4. Use hybrid retrieval: metadata/permission filters → Postgres full-text search → pgvector candidate retrieval → small reranker/rules.
5. Use separate English and Hinglish evaluation sets. Hindi words must remain Devanagari and technical English vocabulary must not be transliterated unnecessarily.
6. Return citations to learner-facing answers and refuse when approved evidence is insufficient.
7. Cache only non-personal, version-keyed retrieval outputs. Never cache a personalized answer under a shared key.

### Model portfolio and cost control

- Use a smaller model for classification, language detection, routing and extraction.
- Use the larger instruction model only for coaching/interview generation that passes a benefit threshold.
- Cache approved content summaries, embeddings and common non-personal explanations.
- Enforce per-user daily quotas, organization budgets and a platform circuit breaker.
- Track cost per completed diagnostic, interview and verified placement—not cost per chat alone.
- Maintain a provider adapter so NVIDIA hosted NIM can later move to paid hosted capacity or self-hosted NIM without rewriting product workflows. NVIDIA documents service-specific keys as useful for security segregation, usage tracking and differing limits. [NVIDIA API-key guidance](https://docs.nvidia.com/rag/latest/api-key.html)

## YouTube and Google Drive strategy

### YouTube

- Preserve `youtube-nocookie.com`.
- Render a consent-aware poster and load the iframe only after user interaction to reduce third-party requests and improve mobile performance.
- Require captions, transcript/text fallback, language, duration, owner, copyright/usage review and next-review date.
- Store playlist/video IDs, not arbitrary iframe HTML.
- Run a scheduled availability/embeddability check and automatically quarantine unavailable or age-restricted resources.

### Google Drive

- Use Drive only for staff-authored pilot material, not learner evidence or confidential records.
- Prefer a dedicated shared drive owned by the program, not personal accounts.
- Allowlist owners/domains and require reader/view-only access.
- Inspect effective ACLs through the Drive API; inherited folder permissions can expose every child resource.
- Store an extracted text/PDF fallback in controlled storage when licensing and policy allow.
- Recheck permissions on publish and daily; quarantine a file whose ownership, permission or malware state changes.
- Migrate durable curriculum assets to first-party object storage/CDN after the pilot proves value.

## Reliability and SLOs

### Pilot SLOs (200–2,000 active learners)

| Capability | Target |
|---|---|
| Public/app availability | 99.9% monthly |
| Authenticated page p95 server response | < 800 ms in primary region |
| Non-AI mutation p95 | < 1.2 s |
| AI first useful response p95 | < 8 s; stream progress when supported |
| Evidence upload success | > 99% excluding invalid files/user network cancellation |
| Notification critical-event delay | < 5 minutes |
| Data recovery objective | RPO ≤ 24h initially; move to PITR before hiring production |
| Restore objective | RTO ≤ 4h pilot, tested quarterly |

### Scale triggers

- Upgrade Supabase compute when sustained CPU, IO, connection saturation or p95 query latency breaches the operating envelope—not merely by learner count.
- Enable PITR before storing production assessment/evidence/hiring data or when database size passes the threshold recommended by Supabase.
- Add read replicas only when analytics/read traffic demonstrably affects primary writes.
- Move high-volume work to queues when synchronous p95 or external-provider failure rate rises.
- Add a warehouse when aggregate/reporting queries consume more than ~20% of primary resources or program reporting needs cross-project history.

## Security, privacy and abuse resistance

### P0 before any real learner data

1. Rotate the NVIDIA key already exposed in conversation.
2. Apply an allowlist CSP covering self, Supabase, NVIDIA server calls, `youtube-nocookie.com` and approved Drive origins. Avoid a nonce design that forces every public page dynamic unless required; Next.js documents the performance implications of nonce-based CSP. [Next.js CSP guidance](https://nextjs.org/docs/app/guides/content-security-policy)
3. Add per-route request-body limits and content-type checks.
4. Apply WAF/bot controls to auth, AI, analytics and public grievance endpoints.
5. Add signed upload initiation, MIME sniffing, antivirus scanning, quarantine and asynchronous media processing.
6. Store only hashes of public-share tokens; validate expiry, revocation, view limit and selected scopes server-side.
7. Define deletion/retention behavior for auth identities, evidence blobs, logs, AI conversations, applications and statutory outcome records.
8. Complete a legal review for India’s applicable privacy, child/minor, employment, accessibility and electronic-record obligations before production; technical architecture is not legal compliance.

## Testing strategy required for scale

### Test pyramid

- Unit: scoring, language selection, validation, quiet hours, match explanations and policy rules.
- Database: migration-from-zero, constraints, triggers, security-definer permissions, storage policies and cross-tenant RLS matrix.
- Contract: NVIDIA success/timeout/429/5xx/malformed output; Drive permission changes; YouTube unavailable/embedding-disabled resources; email provider failures.
- Integration: transactional onboarding, diagnostic submission, evidence metadata/upload reconciliation, application consent and notification outbox.
- E2E: learner golden path, institute intervention, employer consent/shortlist, grievance, password recovery and share-link expiry.
- Accessibility: automated axe plus keyboard, NVDA/Chrome and TalkBack/Android.
- Performance: k6 at expected assessment-window concurrency; upload testing; AI budget exhaustion and circuit-breaker drills.
- Resilience: database restore, queue retry/dead-letter, vendor outage and key rotation exercises.

CI must create a disposable database, apply all migrations, seed two organizations of each type and prove isolation. The existing test suite currently checks only file presence, environment placeholders, proxy route strings and whether migration text contains RLS.

## Phased execution plan

### Phase A — Production foundation (Weeks 1–3)

Goal: no unsafe path to real data.

1. Set up local, preview, staging and production Supabase projects with migration CLI workflow.
2. Apply migrations from zero and resolve SQL/RLS issues; add full authorization test matrix.
3. Create server-only DAL: `requireUser`, `requirePersona`, `requireOrgRole`, scoped DTOs.
4. Replace demo-mode bypass in deployed environments; fail startup when production configuration is missing.
5. Protect and rate-limit AI, analytics, grievance and auth surfaces.
6. Add CSP, error boundaries, structured request IDs/logs and alert routing.
7. Rotate credentials, custom SMTP, backup/PITR decision and restore test.

Exit gate: independent security review passes; tenant-isolation suite passes; no production route silently falls back to demo behavior.

### Phase B — Golden learner loop (Weeks 4–8)

Goal: one complete real-data journey.

1. Convert onboarding, diagnostic, learning, evidence, interview and applications to Server Components + authorized Server Actions/RPCs.
2. Add idempotency and transactions/outbox to every multi-step mutation.
3. Replace hardcoded sample data with seed fixtures in development and server-fetched DTOs in staging/production.
4. Implement signed evidence uploads, quarantine and review workflow.
5. Implement real public-share token resolution.
6. Add Playwright E2E, contract tests and learner-facing error/retry states.

Exit gate: 50 internal/test learners can finish the full journey without manual database correction; reconciliation finds zero orphan uploads/applications.

### Phase C — Grounded AI and media operations (Weeks 9–12)

Goal: useful AI within a controlled budget.

1. Build prompt/model registry enforcement and structured schemas.
2. Add approved-content ingestion, chunking, pgvector/HNSW, hybrid retrieval and citations.
3. Add queue-driven embeddings, Drive ACL checks, YouTube availability/caption checks and dead-letter handling.
4. Add AI eval suites for English/Hinglish groundedness, refusal, bias, prompt injection and unsafe job promises.
5. Add quotas, organization budgets, caching and provider circuit breaker.

Exit gate: ≥95% groundedness on the golden evaluation set, zero high-severity policy failures, known cost per completed AI workflow.

### Phase D — Institute and employer operations (Months 4–6)

Goal: repeatable partner workflows.

1. Real organization invitations, domain verification, membership lifecycle and role-specific server authorization.
2. Roster imports with validation, dry run, error report and idempotent upsert.
3. Content authoring/publishing approvals and assessment calibration.
4. Employer role builder, consented candidate access, structured scorecards, scheduling and offers.
5. Notification workers, quiet hours, email deliverability, retries and audit.

Exit gate: onboard a second institute and employer without code changes; no cross-organization test failures; support runbook handles common failures.

### Phase E — Multi-institute scale (Months 7–12)

Goal: isolate analytics/reporting load and operate against SLOs.

1. Aggregate snapshot jobs and a semantic metrics layer.
2. Query/index tuning using `pg_stat_statements` and Supabase advisors.
3. Capacity/load tests for enrollment, assessment windows, evidence uploads and notification bursts.
4. Warehouse/CDC or read-replica decision based on measured load.
5. Billing, entitlements, SLAs, incident management and customer support tooling.
6. Independent model/fairness and security review.

Exit gate: restore and incident drills pass; monthly SLOs hold; cost per active learner and verified placement is sustainable.

### Phase F — Regional/national readiness (12–24 months)

Goal: language, geography and integration scale without weakening governance.

1. Add state/language packs through versioned translation workflows.
2. Introduce a PWA/offline learning pack and resumable sync after pilot validation.
3. Add standards-aligned occupation/skill identifiers and governed partner APIs.
4. Introduce multi-region reads only where user distribution justifies it.
5. Formalize data/model governance board, public transparency reports and external audits.

## Prioritized backlog

### P0 — do before pilot data

- Rotate NVIDIA key and disable the exposed key.
- Real migration/seed/reset workflow and RLS behavior tests.
- Server DAL and persona/organization authorization.
- AI authentication, quotas, timeout and audit.
- Transactional golden-loop mutations.
- Production config fails closed; no demo fallback.
- Backup/PITR decision, restore rehearsal, custom SMTP.
- CSP, WAF, request limits and upload quarantine.

### P1 — do before employer matching

- Grounded RAG with citations and bilingual evals.
- Public share-token validation.
- Real consented employer access and structured hiring decisions.
- Queue/outbox workers for notifications, embeddings and media checks.
- Contract/E2E/accessibility/load tests.
- Outcome reconciliation and fairness monitoring.

### P2 — after repeatable pilot signal

- Roster automation, content operations, billing and partner APIs.
- Warehouse/read replicas based on measured pressure.
- Offline/PWA learning packs.
- More trades, states and languages.

### Explicitly defer

- Native apps, blockchain credentials, invasive proctoring, open social feeds, autonomous rejection, custom model training and nationwide data exchange.

## Team and ownership

Minimum production-focused team for the next 12 weeks:

- one product/founder owner for pilot scope and partner commitments;
- two full-stack engineers, with one owning data/auth/RLS;
- one AI/retrieval engineer owning gateway, ingestion and evaluations;
- one QA/automation engineer owning RLS, E2E, accessibility and load tests;
- assessment/content lead plus Hinglish reviewer;
- part-time privacy/security/legal reviewers;
- partner-success owner for institute/employer operations.

Every domain needs one named owner, one SLO, one runbook and one data-retention rule.

## Decisions required now

1. Which single occupation is the golden pilot pathway? Recommendation: Industrial Electrician, because the prototype already contains the deepest evidence chain.
2. Are apprenticeships, placements or both in the first pilot? Avoid mixing outcome definitions.
3. Will minors participate? If yes, stop and design guardian/age-appropriate consent before onboarding.
4. Who is authorized to verify practical evidence and credentials, and what is the appeal SLA?
5. Which institute and employer have committed real operational staff and real wage-transparent roles?
6. What production budget exists for Supabase Pro/PITR, transactional email, NVIDIA usage, monitoring and security review?
7. What data-retention promises can be made for evidence, interview text/audio, applications and outcome follow-up?

## Recommended immediate sprint

For the next 14 days, do only this:

1. Rotate secrets and create isolated Supabase environments.
2. Run all 21 migrations from zero; produce a failure/fix report.
3. Build the RLS matrix for two learners, two institutes and two employers.
4. Implement server DAL and protect `/api/ai` with authentication, task authorization, quota, timeout and audit.
5. Convert onboarding + diagnostic completion into one tested transactional vertical slice.
6. Add CI database tests and one Playwright golden-path test.
7. Agree on the pilot occupation, outcome definition, evidence verifier and retention policy.

Do not add another major product module until these seven items pass. They provide more scalability than database replicas, microservices or additional AI models at the current stage.
