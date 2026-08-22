# KarmaSetu P1/P2 Operations Runbook

## Service objectives and ownership

Interactive APIs target 99.5% monthly availability and p95 below 1.5 seconds. Async interview analysis targets p95 completion below five minutes. Webhooks target p95 delivery below ten minutes. Platform Engineering owns web/API/database incidents; AI Operations owns provider degradation and prompt/model releases; Integrations owns webhook failures; Data Protection and Governance own privacy incidents and exports.

## Worker deployment

`GET /api/internal/worker` requires `Authorization: Bearer $CRON_SECRET`. It claims leased outbox, webhook, and background-job batches. A record is completed only after its consumer succeeds. Retries use exponential backoff and dead-letter after the migration-defined limit. Configure `WEBHOOK_SIGNING_SECRET` before enabling subscriptions. Vercel Hobby cron is only a daily safety run; a controlled pilot that promises five-minute delivery needs Vercel Pro cron or an external scheduler calling this endpoint every minute.

Alerts: any dead-letter record, worker failure, webhook failure rate above 5% for 15 minutes, interactive p95 above 1.5 seconds for 15 minutes, or AI queue age above five minutes. The on-call owner acknowledges critical alerts within 15 minutes and assigns an incident commander.

## RPO, RTO, backup, and restore

- Pilot target: RPO 24 hours, RTO 8 hours. Multi-state target: RPO 1 hour, RTO 4 hours.
- Enable Supabase backups/PITR appropriate to the target before declaring the corresponding tier ready.
- Quarterly: restore into a separate staging project, set `RECOVERY_STAGING_PROJECT_REF`, run `npm run recovery:check`, exercise one learner export and one organization export, and record timestamps/evidence.
- Never run restore drills against production. Rotate temporary staging credentials after the drill.

## Retention and archive transition

Migration 031 creates partitioned archive targets without destructively converting live tables. Monthly, create explicit month partitions, copy eligible rows in bounded batches, verify counts/hashes, then delete copied hot rows inside a controlled transaction. Start with completed outbox records older than 30 days, analytics older than 90 days, and audit records older than 365 days. Legal hold overrides deletion. The default archive partitions prevent an outage if a monthly partition is missed; alert whenever they receive rows.

## Regional rollout

Every state launch needs a region record, an active taxonomy version, reviewed mappings, a published bilingual locale pack, and local content approvals. Match, readiness, assessment, and public metric releases must record their version. Do not compare cohorts across versions without a documented bridge analysis. Government aggregates are exposed only through suppressed views; groups below the metric definition threshold remain unavailable.

## Partner offboarding

Suspend the integration client first, pause webhook subscriptions, revoke organization memberships and invitations, expire share links and exports, rotate shared secrets, preserve audit evidence, and document whether retained records are deleted, anonymized, legally held, or returned. A second operator verifies completion. Do not delete audit records required for disputes or statutory retention.

## Incident sequence

1. Contain: disable the affected integration/feature flag and preserve logs.
2. Classify: security, privacy, availability, data quality, AI safety, or partner misuse.
3. Communicate: name an incident commander, owners, next update time, and affected regions/personas.
4. Recover: replay only idempotent events; verify counts and user-visible state.
5. Review: root cause, detection gap, corrective actions, owner, due date, and evidence.

