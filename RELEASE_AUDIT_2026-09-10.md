# Audit remediation release — 10 September 2026

This supplements SENIOR_WEB_AUDIT_2026-09-09.md; the older report describes the pre-remediation state, not the current release.

## Implemented

- Partner workspaces use authenticated, organization-scoped record lists with search where supported, stable cursor pagination (25 rows), current-page export, empty/error states and visible refresh timestamps. Sidebar, mobile navigation, settings, notifications and sign-out share working controls.
- Dashboard totals run in invoker-secured PostgreSQL aggregation rather than array lengths capped by the API. Organization membership is checked for both summaries and record lists. Declared openings include only published jobs with valid declared counts.
- Learner homepage no longer presents invented 72-point readiness, 64% pathway completion, weekly gains, streaks or fictional employers. Skill summary and opportunity matches come from the authenticated account. Skill summary is explicitly an average of up to 12 recent skill scores, falling back to the latest assessment—not a hiring decision.
- Career registry reads published roles, supports persistent account bookmarks and comparison. An empty published registry is shown honestly. Older authoring/hiring studios explicitly state that their mutations are not enabled; simulated Save buttons were removed.
- Public RLS policy corrections and dashboard-total SQL were applied through the authenticated Supabase editor. Anonymous public reads were checked; anonymous execution of staff and dashboard-total functions was rejected (42501).
- Retired NVIDIA interactive model resolves to the tested replacement. Generation is bounded to 160 tokens with explicit concise-answer and language instructions and a 15-second primary deadline inside the route's 24-second provider budget. Timeout fallback remains explicitly labelled; provider availability is not guaranteed.
- Streamed JSON byte limits cover AI, events, preferences, account PATCH, vitals and role bookmarks. Failed analytics/audit persistence is no longer silently treated as success. Retrieval has an abort budget and reference data is labelled as data rather than instructions.
- New background AI jobs trigger bounded post-response worker processing; the daily sweep remains a retry path.
- Health checks now distinguish privileged database access, anonymous public-content access and AI configuration (not a successful AI probe).
- Public-page contrast defects were corrected and contrast checking restored to the browser suite. Reduced-motion handling and mobile search/navigation were improved.

## Verification before release

- 29 unit/source tests passed.
- 22 browser tests passed across desktop and mobile: four public-page accessibility scans including contrast, anonymous authorization checks, telemetry/health contracts, learner session navigation and all four partner workspace journeys.
- Final lint, TypeScript, all 29 tests, staged-source credential-pattern scan and production build passed, including the studio status pages and AI deadline adjustment.
- Anonymous reads succeeded for approved resources, published roles, policies, metrics, locale packs, metric definitions, regions and taxonomy. Private account reads returned no rows. Privileged RPC execution was denied.
- AI showed variable upstream latency: direct replacement-model probe returned 200 in about 1.6 seconds, but two authenticated requests exceeded the earlier 9-second deadline and correctly disclosed fallback. Post-deployment AI verification must be recorded separately, not inferred from connectivity.

## Remaining release limitations and next gates

1. Evidence uploads remain disabled until a real quarantine/scanning pipeline is configured and tested. Do not bypass that safety gate.
2. Authoring, publishing and hiring-decision mutations still require complete reviewed workflows with durable writes, authorization, audit records and recovery tests. Current partner tables are read-only views, not completion of those business operations.
3. The published occupation registry is empty. Authorized content owners must review and publish real role data; fabricated production records were not seeded.
4. Staging scale fixtures (including >1,000 rows), two-organization and revoked-membership tests, backup restoration and recovery-time measurements remain required before high-volume claims.
5. Email delivery, YouTube/Drive permissions/captions, full bilingual coverage, manual screen-reader/keyboard QA and every business mutation are not certified by this suite. Old role-detail and other secondary prototype content needs a further route-by-route content review.
6. Free AI provider capacity and queue retry cadence are not an SLA. Measure queue age and request latency; choose a supported frequent worker schedule and verified independent fallback before making turnaround guarantees.
7. Rotate credentials previously shared in chat before external pilot access. Keep secrets in local/Vercel environment settings, never source control or public browser variables.

## Publication verification update

The main remediation was published from GitHub revision 653d794 to the existing production alias. Health returned 200 with database and anonymous public-content checks OK, and DENY/nosniff headers were verified. The first production browser run passed 19/22 checks: two desktop accessibility runs exceeded the 30-second test budget and Government records exceeded a five-second expectation. Desktop public scans passed on the isolated rerun; these timing failures must remain visible as latency evidence rather than being labelled product-wide success.

The isolated desktop rerun passed all five checks, including Government navigation, without relaxing its five-second record-loading assertion. Across the main run and rerun, all 22 cases passed, though the original timing failures remain relevant.

Initial live AI calls still timed out. Additional response-length and explicit-language constraints produced successful local app responses for both tasks in approximately 3.7 and 3.2 seconds, with Devanagari present in the Hindi response. This is a small availability sample, not a bilingual or safety evaluation certification.

## Suggested MCP integration (next phase)

Start with a read-only operations MCP exposing approved content search, deployment health, aggregate queue status and scoped audit summaries. Authenticate every call and enforce tenant membership server-side. Exclude credentials, raw learner evidence and unrestricted SQL. Add write tools only later with explicit approvals, idempotency and durable audit events; separate staging from production access.
