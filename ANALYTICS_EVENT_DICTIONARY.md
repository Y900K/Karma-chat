# KarmaSetu Analytics Event Dictionary

Analytics measures whether the product helps learners reach verified, retained work. It must not become learner surveillance.

| Event | Trigger | Owner | PII class | Allowed properties | Retention |
|---|---|---|---|---|---|
| `page_viewed` | Route becomes active | Product | pseudonymous | route only | 90 days |
| `signup_started` | Email signup submitted | Growth | pseudonymous | persona, language | 90 days |
| `onboarding_completed` | Required profile completed | Product | user-linked | persona, role slug | 13 months |
| `diagnostic_completed` | Assessment submitted | Assessment | user-linked | blueprint/version, duration band | 13 months |
| `lesson_completed` | Lesson completion recorded | Learning | user-linked | lesson key, path version | 13 months |
| `evidence_submitted` | Evidence metadata saved | Evidence | user-linked | evidence type, skill slugs; never file contents | 13 months |
| `interview_completed` | Practice or real interview ends | Hiring | user-linked | interview type, rubric version; never transcript | 13 months |
| `job_viewed` | Learner opens job detail | Marketplace | pseudonymous | job id, match band | 90 days |
| `application_submitted` | Learner confirms application | Hiring | user-linked | job id, consent version | 24 months |
| `offer_accepted` | Learner accepts offer | Outcomes | user-linked | job id, wage band | 36 months |
| `placement_confirmed` | Joining/retention confirmation | Outcomes | user-linked | role, district, follow-up day | 36 months |

Never include names, email addresses, phone numbers, free-text notes, AI prompts, transcripts, résumé content, evidence files, exact addresses, disability data or protected traits. Experiments cannot change real opportunity access, score penalties, consent, safety or essential support.
