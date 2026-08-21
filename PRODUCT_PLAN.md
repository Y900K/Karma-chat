# KarmaSetu AI — product and delivery plan

## Product promise and surfaces

KarmaSetu is the evidence bridge between education and employment. Its core object is a learner-owned Skill Graph; the JobReady Index is an explainable summary, never an automated hiring verdict.

- Public story: problem → learner transformation → shared ecosystem → responsible intelligence → invitation.
- Learner: onboarding → diagnostic → gap map → learning path → project proof → AI interview → matches → placement follow-up.
- Institute: cohorts, skill-gap heatmap, interventions, placement readiness and consented reporting.
- Employer: role needs, anonymized discovery, evidence review, interview workflow and outcome feedback.
- Admin: curation, partner verification, prompt/version control, moderation, audit and outcome analytics.

## Language and accessibility

Store authored `en` and `hi` fields rather than translating every render. Hindi words use देवनागरी; established product and technical words remain English. Save preference per profile and apply it to email, AI prompts and YouTube caption defaults. Validate Hindi with real ITI/diploma learners. Target WCAG 2.2 AA, keyboard navigation, reduced motion and screen-reader labels.

## Identity and data

Use Supabase Auth with verified email/password, cookie-based SSR for protected routes and password reset. Postgres + Row Level Security holds profiles, evidence, assessments, progress, interviews, roles, matches, consent and audit events. Institute/employer memberships are separate from identity. Never trust client-side role checks or expose the NVIDIA key.

## NVIDIA AI

- Phase 1: bilingual career coach, question generation and structured interview feedback via the server `/api/ai` gateway.
- Phase 2: NVIDIA embeddings for semantic role-to-skill retrieval, pgvector storage and evidence-aware reranking.
- Phase 3: guarded employer copilots and cohort summaries.
- Add rate limits, structured output schemas, prompt/version IDs, redacted logs, human review and evaluation sets for Hindi/English, role relevance, hallucination, bias and unsafe advice. AI recommends; people decide.

## YouTube and Google Drive

YouTube is the video layer. Curate playlists by skill unit; store video ID, language, objective, prerequisite, duration and caption availability in Postgres. Use `youtube-nocookie.com`, lazy loading, explicit play and `origin` with the Player API. Track meaningful learning events, not page loads.

Drive is a transitional repository for staff-authored worksheets, rubrics, institute material and sample certificates. Preview only files intentionally shared with the audience. Do not use Drive as the application database, learner upload pipeline or access-control authority. Put learner evidence in object storage with signed URLs.

## Twelve-week pilot

1. Weeks 1–2: design system, bilingual content model, Supabase schema/RLS, email auth and analytics consent.
2. Weeks 3–6: diagnostic, paths, content registry, Skill Graph and institute cohort view.
3. Weeks 7–10: AI interview, verification, role definition, matching and employer review.
4. Weeks 11–12: accessibility, security, model evaluation, monitoring and partner onboarding.

Pilot gates: activation, diagnostic completion, weekly learning, evidence completion, interview improvement, verified matches, 90-day placement and employer satisfaction.

## GitHub to Vercel

1. Push source and `.env.example`; never commit `.env.local` or keys.
2. Import the GitHub repository in Vercel. Use separate Preview and Production environment values.
3. Add the production and Vercel preview domains to Supabase Auth redirect allow-lists.
4. Protect `main`, require the build check and review every Vercel preview before merge.
5. Before launch, add a custom domain, privacy/terms, cookie consent, error monitoring, rate limiting and a verified support email.
