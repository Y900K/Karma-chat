# KarmaSetu MCP integration plan

## Recommended boundary

Create one server-owned **KarmaSetu Operations MCP** after the production APIs are stable. It should call reviewed application services—not Supabase tables directly—and use OAuth/service identity, organization scopes, rate limits, audit events, and field-level redaction.

### Safe first tools

- `content.search_approved`: read published, in-review-date learning content and citations.
- `content.submit_for_review`: create a draft ingestion job from an approved Drive/YouTube reference; never auto-publish.
- `media.check_status`: read validation and review freshness for registered assets.
- `cohort.read_aggregate`: return only consented, minimum-cell-size cohort metrics.
- `opportunity.validate`: validate a draft role against the controlled skill taxonomy.
- `audit.lookup`: scoped lookup for an incident or integration request ID.

### Later tools

- `support.create_action` for authorized institute staff with learner consent.
- `pipeline.move_stage` for employer recruiters, requiring reason codes and audit events.
- `governance.open_case` for grievance/fairness workflows.

## Existing connectors

- GitHub: issues, pull requests, checks, and release workflow; never repository secrets.
- Google Drive: staff-approved source ingestion with a dedicated folder and least-privilege service identity.
- Gmail/Calendar: later, for verified notification and scheduling flows with explicit user consent.
- YouTube: use the official Data API for metadata/caption eligibility; playback stays privacy-enhanced.

NVIDIA should remain behind KarmaSetu's AI gateway rather than becoming an MCP exposed to clients. The gateway owns prompts, quotas, retrieval, safety rules, audit logs, model fallback, and cost controls.

## Non-negotiable controls

No raw learner search, unrestricted SQL, direct object-store URLs, hidden hiring decisions, automatic evidence verification, or credential-returning tools. Every mutation needs idempotency, authorization, structured input validation, an audit record, and a human-readable purpose.
