# KarmaSetu AI — senior web and data-flow audit

Audit performed September 8–9, 2026. Production examined: https://karma-chat-nine.vercel.app/ (observed revision `2ab0f40`). Fixes in this report are local working-tree changes unless explicitly stated otherwise. The database migration has not been applied to production.

## Release assessment

**Do not treat the current application as ready for unrestricted or high-volume use.** Authentication and core role boundaries passed the exercised tests. Several visual workflows remain prototypes, public database policies fail, and the deployed AI model has been retired. Working login and healthy infrastructure do not establish complete business-process correctness.

This was a source, migration, API, provider, and automated browser audit using the five supplied review accounts. It is not a claim that every possible state, device, adversarial input, or external service has been tested.

## Findings and implemented corrections

| Priority | Finding and evidence | Status |
|---|---|---|
| P0 | NVIDIA returns HTTP 410 for `meta/llama-3.1-8b-instruct`, with retirement date August 26, 2026. Production coaching returned HTTP 400 with temporary-unavailability copy. | Local replacement `nvidia/nemotron-3.5-lightning-30b-a3b` verified through the complete authenticated coaching endpoint: HTTP 200, `degraded:false`, approximately 4.6 seconds. Old environment values resolve to the replacement. Upstream errors now return 502 rather than blaming client input. |
| P0 | Anonymous approved-content reads return PostgreSQL `42501: permission denied for function is_platform_staff`. Staff policies also apply to anonymous callers, whose function permission was revoked. | Transactional migration `032_public_rls_policy_separation.sql` separates public and authenticated staff policies. Pending database application and live positive/negative tests. |
| P1 | Partner dashboards combine authentic live summaries with hardcoded people, counts, dates, rates and organizational identities. | Generic workspace identities and conspicuous illustrative-content notices added. The underlying prototype panels still require real data integration; disclosure is only a mitigation. |
| P1 | Dashboard totals count downloaded arrays rather than all qualifying database rows. API response limits can silently cap totals. Government snapshot count is explicitly limited to 30. | Open. Replace operational totals with RLS-aware database aggregation and label windows clearly. |
| P1 | Employer pipeline query relies on membership RLS but lacks a selected-organization filter, while the header selects one membership. Multiple memberships could mix totals. | Open. Explicit organization context must constrain every read and mutation. |
| P1 | Sidebar sticky behavior is disrupted by a generic `main { overflow:hidden }` ancestor and grid stretching. | Local shell overflow and sidebar sizing corrected. Desktop navigation passes for all four partner roles. |
| P1 | Learner search is hidden at narrower widths. | Local responsive header now shows search on a second row on phones. Mobile learner journey passes. |
| P1 | Existing accessibility tests disable color contrast and can run before meaningful page content finishes loading. | Coverage gap confirmed. Full contrast scan found 5 failing nodes on Auth, 36 on Trust, and 34 on Roles in the measured desktop state. Open remediation; existing serious/critical test passes must not be presented as WCAG conformance. |
| P1 | Analytics ingestion returns accepted even when its database insertion fails; client timestamps could also misstate event time. | Local ingestion now checks the database error, reports storage failure, and assigns server time. Web-vitals ingestion still needs the equivalent storage-outcome check. |
| P1 | Background worker cron runs only once daily. | Open. Suitable only for explicitly daily work; it cannot support near-real-time interview analysis or webhook delivery expectations. |
| P1 | Public role explorer uses a local static role array, personalized-looking readiness percentages, component-only bookmarks and compare selections. Compare, location and preference buttons have no completed workflow. | Open. Label illustrative readiness, persist saved roles for authenticated users, implement comparison and authorized preference filtering, and connect role listings to the approved registry. |
| P1 | `/api/capabilities` explicitly disables evidence uploads until quarantine, malware scanning, metadata stripping and transcoding exist. | Intentionally unavailable. Do not advertise the upload-to-verification process as completed; enable it only after its full storage/review path is tested. |
| P2 | Omitted pagination limit becomes `Number(null)`, then clamps to one record. | Fixed to return the default 25. Runtime tests cover omitted, blank, invalid and bounded values. |
| P2 | Cursor ID permits PostgREST filter punctuation before interpolation into a filter expression. | Restricted to record-ID characters; runtime test rejects filter syntax. Database RLS remains required. |
| P2 | Unmatched partner searches navigate to the first section, generally Overview. | Fixed: unmatched queries retain the no-results state. Search remains a section locator, not a database-wide record search. |
| P2 | Dashboard polling runs in hidden tabs and allows overlapping refreshes. | Local polling runs once per minute while visible, refreshes on return, and prevents simultaneous requests. |
| P2 | Some mutation routes do not check body length or handle malformed JSON cleanly. | Added declared-size checks to account, preferences, analytics and queued AI routes; malformed input is handled. These checks do not independently bound chunked bodies without Content-Length. A streaming byte limit remains future work. |
| P2 | Retrieval can consume the coaching time budget before chat inference starts. | Local embedding retrieval gets a four-second abort budget. Database RPC cancellation and separate retrieval telemetry still need improvement. |
| P2 | Response headers lack explicit frame protection. | Local Vercel configuration adds frame denial and additional browser defense headers. Requires deployment to take effect. |

## Data-flow map and process review

| Process | Current flow | Audit result and remaining work |
|---|---|---|
| Identity | Sign-in → Supabase Auth cookies → authorization DAL → RLS-protected account row → role workspace | All five supplied accounts authenticated. Learner session survived three rounds of seven protected pages. Privileged self-assignment, direct escalation and invalid-token checks passed. |
| Partner onboarding | Learner public signup / partner invitation → acceptance RPC → active membership | Invitation replay rejection and employer membership creation passed. Retain invitation-based privileged onboarding; a public admin role selector would bypass the intended trust process. |
| Account/preferences | Authenticated API → validated profile RPC → account/profile records → header/settings | Malformed JSON paths hardened. Full read-after-write, concurrent-edit and multi-tab language consistency tests remain required. |
| Learner dashboard | Session → dashboard scope guard → parallel learner queries → JSON response → live summary | The summary uses real account data. Other readiness and journey displays require a single agreed source and formula; sample trend deltas must not be treated as measured progress. |
| Institute | Membership → organization/cohorts/latest snapshots → live summary; prototype panels below | Latest-snapshot view uses invoker security. Convert support actions, cohort filters, placements and reports to persisted operations before claiming full workflow completion. |
| Employer | Membership → jobs → applications/pipeline → live summary; prototype talent panels | Scope pipeline by selected organization. Count applications/offers in SQL. Define which published jobs contribute to vacancies; current fallback of one opening can imply a declaration that never occurred. |
| Government | Program membership → nonsuppressed aggregate snapshots/cases → summary | Minimum-group suppression passed live checks. Separate latest metrics from history, show denominator, geography, definition version and time window. Do not infer total counts from a 30-row history window. |
| Admin | Staff authorization → resources/cases/flags/prompts → summary | Navigation works. Static uptime and operating figures are illustrative. Wire decisions to authorization-checked mutations with actor, reason and audit record. |
| Learning/media | Lesson API → published lesson + approved/permission-valid resource registry → embed/text fallback | Source restrictions exist. Public registry policy issue must be fixed. End-to-end video access, Drive permission changes, caption quality and lesson-completion persistence require dedicated cases. |
| AI coaching | Session → user/IP rate limits → quota RPC → approved retrieval → NVIDIA → audit RPC → response | Replacement provider tested successfully. Candidate alternatives returned 404/503 in probes, so no unverified second-model resilience is claimed. AI request audit RPC results need explicit error inspection. Broader bilingual, safety and grounding evaluations remain necessary for release. |
| Background AI | Authenticated enqueue → idempotent job record → leased worker → result polling | Job/outbox primitives passed the scale audit. Daily worker cadence is a delivery bottleneck. Test retries, expired leases, poison jobs and maximum queue age against a declared SLA. |
| Opportunities | Viewer → cursor-paginated matches → published/verified jobs → application state | Default pagination fixed. The separate application-ID read can also hit the row cap; restrict it to the current page or return application state through a joined/RPC result. |
| Notifications | Authenticated role → shared notification page → return to role workspace | Navigation and return paths passed for partner accounts on desktop/mobile. Delivery, read-state synchronization and notification preference enforcement need a separate mutation audit. |
| Analytics/health | Client events/vitals → bounded API → database; health → service-role database query | Analytics now checks writes. Health was OK even while public RLS and AI were broken: add explicit dependency status and anonymous-path synthetic probes. Never use a single database connectivity check as whole-product readiness. |

## Verification evidence

- P0 live audit passed the exercised profile update, privileged-role rejection, invitation acceptance/replay and invalid-token cases.
- Scale live audit passed versioned metric/region checks, atomic rate limiting (`true,true,false`), content approval rejection, minimum-group suppression, idempotent webhook fanout and leased outbox completion.
- Browser suite: 21/22 tests passed in a combined desktop/mobile run. The remaining mobile learner search failure was fixed and passed its targeted rerun. All five role journeys therefore passed across the two device profiles over these runs.
- Final role/API run passed all ten authenticated role journeys on desktop/mobile, anonymous redirects and 401 responses, and exercised cross-role 403 checks. Two homepage tests timed out waiting for the external-resource `load` event; they were changed to wait for DOM content plus a visible main heading. The public-route rerun is recorded in the final handoff.
- Four public-route serious/critical accessibility checks passed on both profiles **with contrast excluded**. An additional full-contrast inspection exposed the failures listed above. Third-party iframe internals are excluded; embed accessibility needs separate verification.
- Production smoke: 40 requests, concurrency 4, zero failed responses, approximately 154 ms p50, 1,022 ms p95 and 1,036 ms p99. Routes sampled were homepage, health, roles and trust. This is a bounded availability sample, not a capacity benchmark.
- Local full AI request: HTTP 200, NVIDIA replacement model, `degraded:false`, approximately 4,633 ms including local processing. Production still has the old code until deployment.
- Unit/source checks: 28 passing tests after pagination fixes. Build, lint and credential-pattern scan are recorded separately in the final handoff.
- Production build, lint, TypeScript and credential-pattern scan passed locally. No deployment was performed during this audit pass.
- No destructive restore drill was run. A staging restore and recovery-time measurement remain unverified.
- Password-reset email delivery, real partner invitation delivery, external YouTube/Drive playback permissions, evidence scanning, full interview persistence, multi-organization switching and every business mutation were not exercised end to end. These remain explicit coverage gaps.

## Ordered remediation plan

1. **Restore public reads.** Apply migration 032. Verify anonymous users can read published/approved rows but cannot read drafts, staff tables, or execute staff helpers. Verify staff still see unpublished rows. Check roles, policies, metrics, resource registry, taxonomy and locale data through their actual pages.
2. **Release the tested AI and navigation corrections.** Deploy the reviewed code, then repeat authenticated coaching, interview coaching, all five login/return/sign-out journeys, and the response-header check against the deployed revision.
3. **Establish one source of truth per metric.** Create a metric inventory with owner, formula, unit, denominator, period, freshness and suppression rules. Replace array-length counts with indexed, invoker-secured aggregation. Test 0, 1, 1,000 and more than 1,000 records in staging against SQL counts.
4. **Complete operational panels.** For each visible action, define input, authorization, state transition, durable write, audit event, refresh and failure recovery. Replace illustrative cards section by section. Hide or clearly disable actions without a persistence path.
5. **Make organization context explicit.** Resolve selected organization consistently, validate active membership, scope queries and writes, and test a user with two organizations plus a user with a revoked membership. Avoid a cosmetic switcher until this exists.
6. **Finish record search and pagination.** Add authorized server-side search by domain, cursor pagination, useful empty/error states and stable ordering. Do not send whole tables to the browser. Confirm changing page sizes neither duplicates nor drops records.
7. **Accessibility and language.** Correct the measured contrast failures, wait for real content before Axe runs, restore contrast checking, and test keyboard focus, zoom, screen-reader labels and mobile target sizes. Route all language controls through one preference source and review Devanagari/English wording across empty, loading and failure states.
8. **Worker reliability.** Choose a queue cadence compatible with expected turnaround, configure retry/backoff/dead-letter handling, monitor oldest-job age and verify idempotency after worker crashes. Increasing scheduler frequency may require a hosting-plan decision.
9. **Operational monitoring.** Track request IDs, upstream status/latency, failed persistence, queue lag, stale metrics and RLS errors. Add separate synthetic checks for anonymous content, each role and coaching. Establish alert thresholds using measured pilot traffic.
10. **Capacity and recovery gate.** Use a separate staging dataset for tenant isolation and scale tests. Measure query plans, concurrent sessions, p95/p99, database CPU/connections, provider quotas and cost. Perform backup restoration, verify records and permissions, and record actual recovery time before making recovery promises.

## Deployment and database handoff

The database correction is `supabase/migrations/032_public_rls_policy_separation.sql`. It is rerunnable and transactional. It preserves function permissions for authenticated callers and isolates public policies from the privileged helper. It has been reviewed against repository policy definitions but has not been executed against the live database in this audit.

The local Supabase service-role key supports application API operations; it does not provide SQL migration authority. A database connection or the authenticated Supabase SQL editor is required to apply this migration. This report does not mark the public-read defect resolved in production.

## References used to evaluate the implementation

- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) — policy roles, helper permissions and invoker-secured views.
- [Supabase: Securing your API](https://supabase.com/docs/guides/api/securing-your-api) — review of exposed tables and security-definer functions.
- [W3C: WCAG 2.2](https://www.w3.org/TR/WCAG22/) — accessibility acceptance criteria. Automated scans are only part of conformance evaluation.
- NVIDIA live `/v1/models` and `/v1/chat/completions` responses on September 8 were used to establish actual account availability and model retirement; old model documentation alone was insufficient.
- Installed Next.js 16.3.2 documentation for data security, route handling, navigation and response headers was used when reviewing implementation changes.
