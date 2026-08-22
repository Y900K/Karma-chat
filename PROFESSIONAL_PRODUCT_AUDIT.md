# KarmaSetu Professional Product Audit

Audit date: 22 August 2026  
Environment: local Next.js production-equivalent build plus live Supabase project  
Method: authenticated browser journeys, role-isolation tests, temporary connected fixtures, database mutation/refresh checks, static security review, lint, TypeScript, tests, security scan and production build.

## Executive result

KarmaSetu is a strong interactive product prototype with real authentication, database transactions, RLS and AI integration boundaries. It is not yet a fully live production product across every card. The audit found that the original dashboards mixed working live mutations with hard-coded presentation metrics. This release adds a role-scoped live data layer to all five dashboards and labels remaining preview cards honestly.

The most important security and integrity failures found during the audit were fixed:

- Public users could self-select institute, employer or government personas during signup.
- Login routing trusted editable user metadata instead of the protected account record.
- Wrong-role page access produced a server error instead of a safe workspace redirect.
- The auth callback accepted protocol-relative paths beginning with `//`.
- Employer members could manage pipeline records but could not read applications to their own jobs.
- Opportunity cards referenced fictional job IDs and application submission returned `job unavailable`.
- The learner dashboard sent an invalid payload to the AI API.
- Browser sign-out did not reliably clear the server session.

## Phase-by-phase verification

| Phase | Result | Evidence | Remaining work |
|---|---|---|---|
| Public story and 3D hero | Pass | Homepage renders, 3D graph loads, protected links route correctly | Replace pilot claims with sourced, approved metrics before marketing launch |
| Email authentication | Pass after fixes | Learner and four partner personas routed to their correct workspaces; sign-out returns to `/auth` | Build invitation acceptance UI and organization verification workflow |
| Authorization | Pass after fixes | Employer attempting `/admin` is redirected to `/employer`; API scopes return 401/403 | Apply learner page-role guards to every learner sub-route, not only `/dashboard` |
| Learner onboarding | Pass | Four-step form persisted through `complete_learner_onboarding` and routed to diagnostic | Prefill existing profiles and prevent accidental overwrite on repeat onboarding |
| Diagnostic | Pass | Five responses persisted; completion screen rendered | Move hard-coded question content into approved `assessment_questions` records |
| Learning | Pass | `symbols` lesson completion persisted idempotently | YouTube and Drive IDs are not configured; source approved resources from the content registry |
| Evidence | Partial | Storage and metadata paths are implemented and permission-scoped | Complete automated upload/virus/media validation test and reviewer workflow UI |
| Interview | Partial | Persistence action and AI request schema are valid | Run full three-question browser transaction after NVIDIA provider reliability improves |
| Opportunities | Pass after fixes | Live Supabase match rendered; real application succeeded; fictional jobs removed | Add pagination, job detail versioning and withdrawn/closed role behavior |
| Employer cross-update | Pass | Learner application appeared in the employer live metrics | Build candidate consent-request UI and pipeline actions against live DTOs |
| Institute dashboard | Pass for live summary | Cohort, learner snapshot and support-action counts loaded under membership RLS | Replace detailed cohort charts and learner names that are still preview content |
| Government dashboard | Pass for live summary | Unsuppressed aggregate snapshot, open case and approved model loaded | Replace detailed district/fairness preview values with governed aggregate snapshots |
| Admin dashboard | Pass for live summary | Approved resource, partner case, flag and production prompt loaded | Connect queues and buttons to real editorial/verification actions |
| English/Hinglish | Pass for tested dashboards | Institute, employer, government and admin headings switched to Devanagari/English mixed copy | Centralize all copy in versioned translation dictionaries and test every screen |
| Responsive design | Conditional pass | Role CSS includes tablet/mobile breakpoints and overflow handling | Run BrowserStack/Sauce Labs on Chrome, Edge, Firefox, Safari and Android WebView |
| NVIDIA AI | Degraded but safe | Embeddings returned in 383 ms; chat models exceeded 25–45 seconds; app now returns a clearly labelled safe fallback | Rotate exposed key, test from Vercel region, add circuit breaker and a second approved provider or self-hosted NIM |
| YouTube/Drive | Not configured | Both public resource IDs are absent; UI correctly displays placeholders | Store approved IDs in `external_resources`, validate permissions nightly, use `youtube-nocookie.com` and Drive view-only links |
| Deployment | Pending this audit commit | Local lint/type/test/security/build gates pass before push | Confirm Vercel server-only environment values and smoke-test the new deployment |

## Live-data architecture now in place

`/api/dashboard?scope=...` returns a minimal role-authorized DTO with `private, no-store` caching. It uses the signed-in Supabase session and RLS, not the service key. Five scopes are available:

- Learner: identity, readiness, learning, evidence, applications and unread alerts.
- Institute: verified organization, cohorts, latest cohort snapshots and support actions.
- Employer: owned jobs, applications and pipeline outcomes.
- Government: privacy-thresholded aggregates, cases and approved models.
- Admin: resources, link health, partner checks, flags and prompt releases.

Dashboard clients refresh on entry, every 30 seconds, on tab visibility, and on manual refresh. Each shows one of `Live Supabase`, `Local demo`, or `Unavailable`. Remaining sample cards are explicitly described as product previews.

## Scalability and improvement plan

### P0 — before inviting external pilot users

1. Rotate the NVIDIA key exposed during setup and update local/Vercel secrets.
2. Add approved YouTube and Drive resources through the registry, not public environment IDs.
3. Replace every detailed hard-coded dashboard card with the live DTO or a truthful empty state.
4. Add page-level learner persona guards to onboarding, diagnostic, learn, evidence, interview, opportunities, portfolio, resume, schedule, settings and notifications.
5. Prefill settings/onboarding from `user_accounts` and `learner_profiles`; remove Aarav/example email defaults.
6. Create invitation acceptance for institute/employer/government users. Never allow public role promotion.
7. Add evidence file malware scanning, EXIF stripping, transcoding and orphan-file cleanup.

### P1 — controlled pilot scale

1. Generate TypeScript database types from Supabase and remove hand-written query casts.
2. Move dashboard aggregation to SQL views/materialized snapshots with documented metric versions.
3. Process the transactional outbox with a real queue worker; do not mark events completed without a consumer.
4. Add idempotent webhooks for email, reminders, media health and outcome follow-up.
5. Add structured application errors, correlation IDs, Sentry/OpenTelemetry and alert thresholds.
6. Add Playwright journeys for all personas plus axe-core accessibility checks in CI.
7. Add content review, translation review, caption and accessibility gates before publishing.
8. Add pagination and date/keyset cursors to jobs, applications, cases, audit events and notifications.

### P2 — multi-state and high-volume scale

1. Partition analytics/audit/outbox tables by month and define retention/archive policies.
2. Precompute cohort/government aggregates and enforce minimum-cohort suppression in SQL.
3. Introduce regional job/content taxonomies and version every match, readiness and assessment calculation.
4. Add Redis/edge caching only for public approved content; never cache user DTOs publicly.
5. Add rate limits per user, organization and IP with abuse monitoring.
6. Use asynchronous AI jobs for long interview analysis and keep interactive coach responses under a strict latency SLO.
7. Establish RPO/RTO, restore drills, data-export drills, incident ownership and partner offboarding.

## Recommended MCP integrations

Create a read-first `karmasetu-ops` MCP server rather than exposing raw Supabase administration. Recommended tools:

- `get_release_health`: Vercel deployment, health endpoint, migration version and error budget.
- `get_content_health`: expired reviews, broken YouTube/Drive permissions, missing captions and fallbacks.
- `get_governance_queue`: overdue grievances, fairness reviews and export approvals without learner PII.
- `run_fixture_audit`: creates the marked temporary fixture chain, runs role checks and guarantees cleanup.
- `explain_metric`: returns the definition, version, source tables, suppression rule and freshness for a dashboard metric.

All mutating MCP tools should require explicit confirmation, organization scope, idempotency keys and an audit event. Supabase service-role credentials must remain server-side and must never be returned through MCP results.
