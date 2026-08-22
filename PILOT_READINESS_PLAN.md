# KarmaSetu External Pilot P0 Release Gate

Audit date: 22 August 2026

## Current decision

**NO-GO for a full external pilot.** The application can be used for a controlled account-and-dashboard rehearsal, but external learners must not yet be asked to upload evidence or rely on AI/media content. The release becomes GO only when every blocking gate below is signed off.

## P0 gate matrix

| Gate | Status | Verification | Release condition |
|---|---|---|---|
| Public role escalation | Pass | Authenticated clients no longer have `UPDATE` privilege on `user_accounts`; new users are forced to `learner` in the database trigger | Keep the privilege query in every release audit |
| Partner invitations | Pass | Temporary employer invitation changed a learner to employer only after email, token, expiry, verified organization and allowed-role checks; membership became active | Add email delivery and an organization-admin invitation screen before partner self-service |
| Learner page authorization | Pass | All learner workflow routes now execute the shared page-level persona guard | Add browser role-isolation checks to CI |
| Account/profile prefill | Pass | Browser verified authenticated name/email prefill and persisted a changed display name through `/api/account`; settings no longer use example identity defaults | Add the journey to CI |
| Repeat onboarding safety | Pass | Browser verified returning-learner prefill; existing profiles require explicit update confirmation and the Server Action rejects unconfirmed overwrites | Add cancel/update paths to CI |
| Dashboard data truthfulness | Pass | Browser verified live learner/employer summaries while fictional values and candidate cards were absent | Replace each hidden module with live DTOs before restoring it |
| YouTube and Drive | Blocking | Client-side environment IDs were removed. Lessons now query only `approved` + `valid` `external_resources` records mapped by `metadata.lesson_id` | Add owned/approved resources, captions, text fallback, review dates and permission monitoring |
| Evidence media safety | Blocking, safely closed | Direct Storage upload policy was removed; UI and Server Action reject uploads | Build server-side quarantine, malware scan, EXIF stripping, media transcoding and orphan cleanup, then security-review before enabling |
| Public profile sharing | Safely closed | `/p/[token]` returns not found instead of fictional or unvalidated learner data | Implement token-hash lookup, immutable consented snapshot, expiry, revocation, max views and audit logging |
| NVIDIA credential | Blocking | Repository scan is clean, but the key previously pasted into chat must be treated as compromised | Rotate in NVIDIA, update local/Vercel server-only values and rerun provider smoke tests |
| AI reliability | Blocking for AI-led pilot | Timeout fallback is safe but does not meet an interactive reliability SLO | Measure from Vercel region, add circuit breaker/queue and approve a fallback provider or NIM deployment |

## Pilot sequence after blockers close

1. Create a separate staging Supabase project and Vercel Preview environment.
2. Apply migrations from a clean database and run `npm run verify` plus `npm run audit:p0`.
3. Add two approved bilingual lessons: one YouTube resource and one Drive PDF, each with captions/text fallback and a 30-day review date.
4. Run five internal accounts through learner, institute, employer, government and admin journeys.
5. Run an accessibility pass at 200% zoom, keyboard-only navigation and screen-reader landmarks.
6. Invite 5–10 consented learners; keep evidence uploads, AI interviews and public sharing disabled for the first observation week.
7. Review errors, support tickets, consent withdrawals and dashboard freshness daily.
8. Enable one high-risk capability at a time behind a server-controlled feature flag with rollback ownership.

## Daily pilot acceptance thresholds

- Authentication success rate at least 99% excluding incorrect passwords.
- No cross-persona access or RLS violation.
- Dashboard freshness under 60 seconds for monitored summaries.
- No unlabelled sample, stale or synthetic operational value.
- Zero unresolved critical privacy/security incident.
- Support acknowledgement within four working hours.
- AI degraded responses clearly labelled; AI never makes a hiring or evidence-verification decision.

## Required owners before invitation day

- Product owner: scope, consent script and stop/go authority.
- Security owner: secret rotation, evidence pipeline and incident response.
- Content owner: YouTube/Drive rights, captions, translations and review dates.
- Data/governance owner: metric definitions, suppression and export approvals.
- Support owner: bilingual onboarding help and grievance escalation.
- Engineering owner: deployment rollback, Supabase migrations and observability.
