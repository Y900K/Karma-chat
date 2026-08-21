# KarmaSetu operations runbook

## Release gates

1. Rotate any credential ever pasted into chat; configure secrets only in local `.env.local`, GitHub Actions, Supabase, and Vercel secret stores.
2. Run `npm ci`, `npm run verify`, and `npm run env:check -- --production` against the release environment.
3. Apply migrations `001` through `027` to staging, run tenant-isolation tests, then promote the same reviewed migration set to production.
4. Validate sign-up verification, recovery, every persona boundary, the full learner loop, private evidence access, NVIDIA quotas, citations, and the maintenance cron.
5. Run `LOAD_TEST_ORIGIN=https://preview.example npm run load:smoke`. Do not load-test production without an approved window.

## Service objectives and alerts

| Signal | Initial objective | Alert |
|---|---:|---:|
| Web availability | 99.9% monthly | 5-minute error rate > 2% |
| Authenticated mutation p95 | < 1.5 s | > 2.5 s for 10 minutes |
| AI gateway p95 | < 12 s | > 15 s or provider errors > 5% |
| Core flow success | > 98% | < 95% over 30 minutes |
| Outbox oldest pending | < 5 min | > 15 min |
| Media validation freshness | < 8 days | any published asset > 10 days |
| LCP p75 mobile | < 2.5 s | > 3.0 s over 24 hours |

## Incident priorities

- P0: cross-tenant data exposure, credential leak, unauthorized evidence access. Disable the affected route/integration, rotate credentials, preserve audit evidence, notify the incident owner.
- P1: authentication outage, learner writes failing, AI cost runaway. Fail closed for writes, disable AI using environment configuration if required, communicate status.
- P2: stale media, delayed analytics, localized copy defects. Queue repair and keep core learner flow available.

## Backups and recovery

Use Supabase point-in-time recovery for production, test a restore quarterly, and export only approved aggregate/configuration data. Evidence files remain private and follow the retention schedule. Recovery exercises must verify RLS, storage policies, authentication redirect URLs, scheduled jobs, and secret replacement.

## Capacity stages

- Pilot: Vercel serverless + Supabase pooled connections; scheduled maintenance handles small queues.
- Growth: move embedding, webhook, and outbox processing to a durable worker; partition analytics by month; cache published catalog reads.
- Regional: read replicas for analytics, separate object-processing workers, per-institute quotas, regional content packs, and warehouse-only aggregate reporting.

Never expose raw SQL, service-role credentials, unrestricted learner records, or evidence storage through an integration surface.
