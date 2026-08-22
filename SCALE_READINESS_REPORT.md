# P1/P2 Scale Readiness

## Built in this release

- Durable outbox claim/complete/fail leases, idempotent webhook fan-out, signed deliveries, retries, and dead letters.
- Async interview-analysis jobs so provider latency does not hold an interactive request open.
- Per-user and per-IP rate-limit buckets with abuse signals; bounded public telemetry ingestion.
- Keyset pagination contracts for opportunities, notifications, governance cases, and audit records.
- Versioned metric definitions, privacy-suppressed government views, learner/cohort/employer rollups.
- Regional hierarchy, versioned taxonomy terms, reviewed resource mappings, and locale-ready bilingual labels.
- Content publication gate requiring permission, review dates, captions/text fallback, translation, and accessibility evidence.
- Non-destructive partitioned archive targets and explicit retention policies.
- Correlation IDs, structured operational errors, SLO records, Playwright/axe CI, mixed-route load checks, and a staging-only recovery preflight.

## External gates before controlled pilot expansion

1. Apply migration 031 and regenerate database types from the live schema.
2. Configure `RATE_LIMIT_HASH_SECRET` and `WEBHOOK_SIGNING_SECRET` in Vercel; rotate the previously shared NVIDIA key.
3. Select an error/trace backend and configure `SENTRY_DSN` or `OTEL_EXPORTER_OTLP_ENDPOINT`; connect alerts to a staffed channel.
4. Configure a worker schedule matching the promised delivery SLO. Daily Hobby cron is not a five-minute queue.
5. Enable webhook subscriptions only after endpoint verification and partner security review.
6. Run authenticated learner, institute, employer, government, and admin journeys against seeded staging data.

## External gates before multi-state/high-volume declaration

1. Complete a production-like load test with the regional/user mix, queue load, and database connection limits; the included script is a smoke baseline, not capacity proof.
2. Enable paid backup/PITR capacity that satisfies the selected RPO, complete a separate-project restore, and retain evidence.
3. Establish monthly partitions and archival automation; monitor the default partition.
4. Complete state-specific taxonomy, translation, accessibility, content-rights, and outcome-methodology sign-off.
5. Add a managed Redis/edge cache only for approved public content. Never cache learner, partner, government, or signed-in dashboard DTOs.
6. Complete data-protection review, partner offboarding drill, incident game day, and named 24/7 escalation coverage before high-volume public commitments.
