# KarmaSetu AI — Master Product Plan

Version 1.0 · Planning horizon: pilot to national platform

## 1. North star

KarmaSetu should become India’s trusted employability infrastructure: a network where a learner can understand their readiness, build missing capabilities, prove those capabilities, and reach suitable work; where institutes can improve outcomes; and where employers can hire using verified evidence.

The platform should optimize for **meaningful, retained employment**, not registrations, course views, assessment scores, or raw placement counts.

### North-star metric

**Verified Sustainable Placement Rate:** percentage of activated learners who enter a verified role relevant to their skill pathway and remain employed after 90 days.

Supporting metrics: diagnostic completion, skill-evidence completion, interview improvement, match-to-interview conversion, offer acceptance, 90/180-day retention, learner wage growth, employer satisfaction, time-to-hire, institute placement outcomes and fairness gaps.

## 2. Product principles

1. Evidence over claims: every important skill should connect to an assessment, project, credential or verified work signal.
2. Guidance over judgement: AI explains readiness and next actions; it does not permanently label learners.
3. Learner ownership: the learner controls profile visibility, employer sharing and consent withdrawal.
4. Human accountability: AI can assist recommendations but cannot autonomously reject a candidate.
5. Mobile and low-bandwidth first: the primary pilot user may have an entry-level Android device and unstable connectivity.
6. Bilingual by design: English and Hinglish are content states, not an afterthought or browser translation.
7. Outcome-connected learning: content exists only when connected to a skill, evidence task and target role.
8. Explainability: every score, match and recommendation must state the evidence and improvement path.
9. Interoperability: use standard skill and occupation identifiers where practical; avoid trapping partners in opaque data.
10. Privacy proportionality: collect only what directly improves service, safety, verification or required reporting.

## 3. User ecosystem

### Learners

- ITI, diploma, polytechnic and degree students
- Recent graduates and apprentices
- Entry-level workers seeking better roles
- Rural and semi-urban learners needing bilingual guidance
- Alumni who can provide outcomes and referrals

### Institutional users

- Placement officer: cohorts, readiness, interventions and placement workflow
- Faculty/trainer: assignments, rubrics, evidence review and remediation
- Institute leadership: outcome benchmarking and accreditation-ready reporting
- State or mission operator: aggregated, privacy-safe program performance

### Employers

- MSME owner or hiring manager: simple role creation and trusted shortlist
- Recruiter: pipeline, evidence comparison, scheduling and feedback
- Technical evaluator: structured scorecard and work-sample verification
- HR leader: source quality, retention, hiring cost and workforce skill demand

### Internal operations

- Platform administrator
- Content curator and translator
- Partner success manager
- Assessment reviewer
- Fraud/moderation analyst
- Data and model governance reviewer
- Customer support agent

## 4. Product domains

### A. Public trust and acquisition

- Immersive bilingual product story
- Separate landing routes for learners, institutes, MSMEs and government programs
- Partner directory, verified outcome stories and pilot transparency page
- Role/skill explorer optimized for search
- Webinar, event and institute-demo registration
- Help center, accessibility statement, privacy, terms and AI transparency
- Public impact dashboard using aggregated, privacy-safe metrics

### B. Identity, onboarding and consent

- Verified email/password; later Google and phone OTP
- Persona selection without locking a user permanently into one role
- Learner profile import from résumé, institute roster or DigiLocker where legally and technically appropriate
- Progressive profile completion rather than one long form
- Guardian workflow only where minors are in scope
- Granular consent ledger for assessment data, employer visibility, recordings, research and marketing
- Organization invitation, domain verification and membership roles
- Account recovery, export, correction and deletion requests

### C. Learner profile and Skill Graph

- Education, experience, preferences, languages, mobility and accessibility needs
- Skills organized by domain, proficiency, confidence and evidence strength
- Timeline of assessments, projects, credentials, interviews and employment outcomes
- Learner-controlled public profile/share link with expiration and visibility settings
- Readiness explanation: score, confidence, missing signals and next-best actions
- Portfolio evidence: files, images, video, repository links and reviewer feedback
- Credential wallet with verification status and issuing authority
- Version history to show growth, not just the current score

### D. Diagnostic and assessment engine

- Baseline diagnostic by target occupation and education level
- Adaptive question selection with time and difficulty controls
- Practical work samples, scenario questions and structured self-assessment
- Communication, safety, employability and foundational digital skills
- Question bank authoring, review, translation, versioning and retirement
- Blueprints mapping questions to skills, roles and difficulty
- Proctoring-light integrity signals for high-stakes tests; avoid invasive surveillance by default
- Rubrics, human moderation and appeals
- Reliability, validity, item bias and language-equivalence analysis
- Accommodation mode: extra time, keyboard-only, screen-reader and simplified language

### E. Learning experience

- Personalized learning paths tied to diagnostic gaps and target roles
- Skill unit structure: objective → lesson → practice → evidence task → reflection
- YouTube playlist/video registry with language, captions, duration and prerequisite metadata
- Google Drive preview for staff-authored worksheets and source material during pilot
- First-party notes, bookmarks, transcripts, quizzes and progress tracking
- Downloadable low-bandwidth packs and resumable progress
- Cohort assignments, due dates, trainer feedback and office hours
- Peer study groups and moderated discussion later
- Content effectiveness analytics: completion, evidence quality and downstream readiness improvement
- Content lifecycle: draft, translated, reviewed, approved, published, deprecated

### F. AI career companion

- Bilingual onboarding guide and career-path exploration
- Diagnostic explanation and weekly action plan
- Doubt resolution grounded in approved KarmaSetu content
- Résumé and portfolio assistance without inventing experience
- Interview practice with text first; voice/video added after consent and safety review
- Structured feedback across correctness, clarity, evidence and improvement
- Job description explanation and application preparation
- Human handoff when advice is uncertain, high-impact or sensitive
- Conversation history controls and “why am I seeing this?” explanations
- No mental-health diagnosis, legal promises, guaranteed jobs or discriminatory advice

### G. JobReady Index

The index should be a composite view, not a single mysterious AI score.

Possible dimensions: role knowledge, practical evidence, foundational skills, communication, interview readiness, credential verification, learning recency and employer feedback. Each dimension must show data source, freshness, confidence, improvement action and whether it is shared.

Do not compare unrelated occupations with one universal ranking. Maintain role-specific index versions. Publish version notes when weights or models change. Preserve historical values for audit. Test for language, gender, geography, institution-type and socioeconomic disparities using lawful, carefully governed evaluation data.

### H. Opportunity and matching

- Employer role builder using skills, tasks, shift, location, wage range and eligibility
- Structured skills-first job descriptions
- Candidate preferences: location, relocation, shift, commute, wage and role interest
- Semantic retrieval followed by explainable rules and evidence-aware reranking
- Match explanation for both sides, including missing or uncertain evidence
- Learner choice to accept, hide or ask why
- Application tracker, status notifications and withdrawal
- Interview scheduling, reminders and rescheduling
- Offer capture, acceptance, joining verification and 30/90/180-day follow-up
- Feedback loop that improves content and role definitions without punishing individuals

### I. Employer workspace

- Verified company and recruiter onboarding
- Role templates for common MSME occupations
- Evidence-first candidate cards with minimum necessary personal data
- Comparable structured scorecards; prohibit unsupported free-text rejection reasons
- Team comments, shortlist, interview and offer pipeline
- Fraud flags and credential verification
- Hiring funnel, source quality, time-to-hire, retention and satisfaction
- API/import options for larger partners later
- Employer code of conduct and abuse-reporting channel

### J. Institute workspace

- Student roster import and invitation
- Cohort readiness heatmaps with drill-down only for authorized staff
- Skill-gap and intervention recommendations
- Learning assignment and completion tracking
- Placement pipeline and employer activity
- Outcome reporting by trade, program and graduating cohort
- Trainer workload and evidence-review queue
- Consent-aware data export and accreditation reports
- Benchmarks only with adequate sample size and privacy safeguards

### K. Government/program workspace

- Multi-institute program setup and controlled delegation
- Aggregated readiness, participation, intervention and placement metrics
- Geographic and trade-level supply/demand insights
- Funding milestone reporting and data-quality flags
- Privacy thresholds, suppression for small cohorts and export audit logs
- Policy sandbox for testing program interventions
- No individual learner ranking for punitive funding or surveillance

### L. Operations and trust console

- Partner verification, memberships and permissions
- Content, assessment and translation workflow
- Evidence-review and moderation queues
- Support inbox with learner context and strict access controls
- Consent history, audit events and data-subject request handling
- AI prompt/model registry, evaluation results, incidents and rollback
- Feature flags, announcements and maintenance mode
- Fraud investigation with documented decisions and appeals

## 5. Information architecture

### Public routes

`/`, `/learners`, `/institutes`, `/employers`, `/government`, `/skills`, `/roles`, `/impact`, `/partners`, `/about`, `/help`, `/privacy`, `/terms`, `/ai-transparency`, `/accessibility`.

### Authenticated learner routes

`/home`, `/onboarding`, `/profile`, `/skill-graph`, `/diagnostic`, `/learn`, `/learn/[unit]`, `/evidence`, `/interview`, `/opportunities`, `/applications`, `/messages`, `/settings`.

### Partner workspaces

`/institute/*`, `/employer/*`, `/program/*`, `/admin/*`. Every server request must re-check organization membership and permission; hiding navigation is not authorization.

## 6. Data architecture

### Core entities

Users, profiles, organizations, memberships, cohorts, occupations, skills, role-skill requirements, assessments, question versions, attempts, responses, evidence items, reviews, credentials, learning units, content resources, enrollments, progress events, jobs, applications, matches, interviews, scorecards, offers, placements, outcome follow-ups, consents, notifications, support cases, audit events, AI conversations, prompt versions and model evaluations.

### Data design rules

- UUID identifiers and immutable event timestamps
- Soft deletion where audit is required; hard deletion for eligible privacy requests
- Row Level Security on every user/organization table
- Organization-scoped storage paths and signed URLs
- Append-only audit log for sensitive access and decisions
- Explicit provenance: source, verifier, version, confidence and expiry for evidence
- Localized fields or translation tables with review status
- Analytics events separated from operational truth
- PII isolated from model/evaluation datasets wherever possible
- Retention schedules per data category

### Recommended stack evolution

- Next.js on Vercel for web and server functions
- Supabase Auth, Postgres, Row Level Security, Storage and pgvector
- Background jobs via a durable queue/provider when workloads exceed request limits
- Transactional email provider with domain authentication
- Product analytics with consent controls; privacy-friendly option preferred
- Error monitoring and structured logs with PII redaction
- Search/retrieval starts in Postgres and moves to a dedicated service only when proven necessary

## 7. AI and retrieval architecture

1. Browser sends a bounded task request to a KarmaSetu server route.
2. Server verifies session, role, consent, rate limit and feature entitlement.
3. Retrieval fetches approved, permission-filtered content and learner-authorized context.
4. Prompt registry supplies versioned system instructions and structured output schema.
5. NVIDIA NIM performs generation, embeddings or reranking.
6. Output validator checks schema, citations, unsafe claims and missing evidence.
7. Response shows sources, uncertainty and human escalation when needed.
8. Redacted telemetry records model, prompt version, latency, tokens and outcome—not secrets or unnecessary raw PII.

Never send passwords, government identifiers, raw contact data, hidden disability information, unrelated assessment answers or private institute records to a model. Maintain provider outage fallbacks and non-AI paths for essential workflows.

## 8. Content and media strategy

### YouTube

- Embed approved video IDs/playlists only; use privacy-enhanced embeds and lazy loading.
- Store captions/transcript availability, presenter, license, review date and learning objective.
- Do not treat a completed video as proven skill.
- Pair each video with practice and evidence.
- Replace broken/private videos through a weekly validation job.

### Google Drive

- Pilot use: trainer documents, worksheets, rubrics and partner-shared source resources.
- Each file record includes owner, audience, permission status, version and review date.
- Never place confidential learner evidence in publicly shared folders.
- Later migrate governed learning assets to first-party storage/CMS.

### Translation workflow

English draft → terminology pass → Hinglish translation → subject-matter review → learner readability test → publish. Maintain a glossary for job titles, tools, safety concepts, assessment verbs and interface actions. AI may create a first draft but cannot self-approve translations.

## 9. Security, privacy and compliance program

- Threat model before pilot and before each high-risk feature
- Secure cookies, CSRF protection, validation, rate limits and bot controls
- Secrets only in environment/secret managers with rotation policy
- RLS tests and authorization tests in CI
- MFA for staff and high-privilege partner accounts
- Least-privilege admin roles and just-in-time access where possible
- Encryption in transit and at rest; signed, expiring asset URLs
- Dependency, secret and code scanning
- Incident response, breach escalation and recovery exercises
- Backups with tested restoration
- Vendor register and data-processing agreements
- Privacy notice by persona; purpose limitation and consent withdrawal
- Data export, correction and deletion workflows
- Child/minor policy if under-18 learners enter scope
- Legal review for India’s data-protection, employment, accessibility and electronic-record obligations before production

## 10. Responsible matching policy

Matching must exclude protected or irrelevant traits. Location, shift, mobility, wage and eligibility filters must be transparent and user-controlled. A low match should never become a permanent negative label. Employers must choose structured, job-related rejection reasons. Learners should be able to report incorrect data, request review and understand why an opportunity was recommended.

Monitor exposure, interview and offer rates across relevant cohorts. Investigate disparities before changing weights. Keep model-generated summaries separate from verified facts.

## 11. Notifications and communication

- In-app notification center as source of truth
- Email for verification, critical workflow events and weekly summaries
- WhatsApp/SMS only after explicit opt-in and approved templates
- Quiet hours, frequency controls and language preference
- Actionable reminders: unfinished diagnostic, learning due, evidence review, interview, offer and follow-up
- Partner announcements with audience targeting and audit
- No manipulative streaks or shame-based engagement

## 12. Monetization

### Institute SaaS

Annual subscription by active learner/cohort, including dashboards, learning assignments and outcome reporting. Higher tiers add integrations, custom assessments and dedicated success support.

### Employer revenue

Pilot with free verified roles; then placement success fee, hiring subscription or credit-based access. Never charge learners to be visible to employers.

### Government/program contracts

Implementation, program dashboards, evaluation and privacy-safe data services with clear restrictions against individual surveillance.

### Premium/API

Later: verified skill profile API, assessment services and enterprise analytics. Separate personally identifiable access from aggregate insight licensing.

## 13. Delivery phases

### Phase 0 — Foundation (0–6 weeks)

Must ship: design system, bilingual framework, email auth, consent, learner profile, organization membership, base database/RLS, observability, privacy/terms, content registry and admin seed tools.

Exit gate: security review passes; bilingual onboarding can be completed on mobile; no secrets or authorization decisions exist in client code.

### Phase 1 — Pilot learner loop (7–14 weeks)

Must ship: target-role selection, baseline diagnostic, gap map, learning paths, YouTube/Drive resources, evidence upload, JobReady Index v0, AI coach, notifications and institute cohort view.

Exit gate: 200+ learners, ≥70% onboarding completion, ≥60% diagnostic completion, measurable readiness improvement, support workflow operating.

### Phase 2 — Hiring loop (15–24 weeks)

Must ship: verified employers, role builder, explainable matching, applications, scheduling, structured interviews, offers, placement verification and 90-day follow-up.

Exit gate: partner roles are real and wage-transparent; first verified placements; match and fairness evaluation reviewed.

### Phase 3 — Multi-institute scale (6–12 months)

Add roster automation, stronger admin operations, content authoring, question bank governance, partner billing, program dashboards, background jobs, data warehouse and SLAs.

Exit gate: repeatable institute onboarding, reliable monthly reporting, restore test, incident drill and sustainable support capacity.

### Phase 4 — Regional/national platform (12–24 months)

Add more states/languages/trades, mobile/PWA offline packs, standard integrations, credential verification partnerships, talent-demand insights and carefully governed APIs.

Exit gate: evidence of retention and wage impact, independent model/fairness review, scalable unit economics and formal governance board.

## 14. Prioritization

### Build now

Authentication, bilingual content, profiles, consent, role taxonomy, diagnostic, learning registry, evidence, transparent readiness, institute cohort view, AI gateway, audit and measurement.

### Build after pilot signal

Employer pipeline, interviews, matching, notifications, billing, content authoring, analytics warehouse, WhatsApp and partner integrations.

### Defer until scale justifies it

Native mobile apps, blockchain credentials, heavy remote proctoring, social feed, open marketplace, fully automated rejection, custom model training, nationwide data exchange and complex ERP integrations.

## 15. Team plan

### Pilot team

- Product/founder lead
- Product designer/researcher
- Two full-stack engineers
- AI/retrieval engineer
- QA/automation engineer shared or part-time
- Content and assessment lead
- Hinglish translator/reviewer network
- Institute/employer success lead
- Privacy/security/legal advisors part-time

At scale add platform/SRE, data engineering, analytics, trust and safety, customer support, sales/partnerships, finance and compliance.

## 16. Engineering operating model

- Protected `main`; short-lived branches and Vercel preview per pull request
- Required typecheck, lint, unit, authorization, migration and end-to-end smoke checks
- Database migrations reviewed and reversible
- Environments: local, preview, staging and production with isolated data/secrets
- Feature flags for unfinished or high-risk functions
- Definition of done includes bilingual copy, accessibility, analytics, error states, permissions, tests and documentation
- Architecture decision records for consequential choices
- Weekly release train during pilot; urgent security fixes outside the train

## 17. Testing strategy

- Unit tests for scoring, permissions and transformation logic
- Database/RLS tests for every persona and cross-organization isolation
- Contract tests for NVIDIA and media integrations
- End-to-end journeys for learner, institute, employer and admin
- Accessibility automation plus keyboard/screen-reader manual checks
- Mobile performance under throttled network and low-end device profiles
- Hindi/Hinglish layout and terminology regression
- AI evaluation suites: groundedness, instruction following, role relevance, bias, refusal, prompt injection and unsafe career claims
- Load testing for assessment windows and bulk roster onboarding
- Backup restoration and incident simulations

## 18. Analytics and experimentation

Define an event dictionary before implementation. Every event has owner, purpose, fields, PII classification and retention. Funnel: visit → sign-up → verified → onboarding → target role → diagnostic → first action → evidence → interview → application → offer → joined → retained.

Use experiments only when they cannot disadvantage learners in access to real opportunities. Never A/B test opaque score penalties, discriminatory filters or essential support. Prefer cohort studies and qualitative research for high-impact product decisions.

## 19. Risks and mitigations

- Cold-start employers: secure real roles and clear commitments before mass learner onboarding.
- Weak skill evidence: require practical artifacts and reviewer calibration.
- AI hallucination: retrieval, schemas, citations, validation and human handoff.
- Bias: job-related features only, fairness evaluation, appeals and governance.
- Content sprawl: approved registry, ownership and review dates.
- Drive permission leaks: automated link checks and move private evidence to signed storage.
- Low bandwidth: small bundles, lazy media, offline/resume and text alternatives.
- Institute adoption: roster import, simple staff workflows, onboarding playbooks and visible early value.
- Learner drop-off: progressive onboarding and next-best-action home, not gamification pressure.
- Fake employers/jobs: organization verification, reporting, moderation and sanctions.
- Unsustainable free AI use: quotas, caching, smaller task-specific models and cost dashboards.

## 20. Governance

Create a quarterly Product and AI Governance Review including product, engineering, assessment, privacy, partner success and an independent education/employment advisor. Review model changes, fairness, incidents, appeals, new data uses, vendor changes, score versions and public transparency updates.

Maintain public documentation for what the JobReady Index includes, what AI does, what it never decides, how learners correct data and how to contact a human.

## 21. Immediate next 30 days

1. Confirm three pilot occupations and their task/skill maps with MSMEs and instructors.
2. Interview at least 12 learners, five placement officers and five employers.
3. Define pilot outcomes, baseline and consent language.
4. Create Supabase environments, schema v1, RLS test matrix and storage policies.
5. Finish verified email auth, protected layouts, onboarding and organization invitations.
6. Build the bilingual content schema, glossary and review workflow.
7. Author one complete golden pathway: diagnostic → two learning units → evidence → AI interview → match explanation.
8. Create NVIDIA prompt registry, rate limits, structured output and evaluation set.
9. Register the first approved YouTube/Drive resources with owners and review dates.
10. Establish analytics dictionary, error monitoring, security checklist and weekly pilot review.

## 22. Decisions needed from the founder

- First three occupations/trades and target learner stage
- Exact pilot institutes and employer commitments
- Whether the initial product is placement-focused, apprenticeship-focused or both
- Who verifies project evidence and credentials
- Whether under-18 learners are in scope
- Institute pricing hypothesis and who pays during pilot
- Target languages after English/Hinglish
- Data-retention promises and government reporting boundaries
- Named owner for content quality, partner verification and learner support

These decisions should be resolved before building broad dashboards or adding more AI features. They determine the data model, assessment design, operational cost and responsible rollout.
