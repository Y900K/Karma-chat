# KarmaSetu AI

Evidence-led employability platform connecting learners, institutes, employers and public programs through role-specific diagnostics, learning, verified work, explainable matching and accountable outcomes.

## Local development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. Without Supabase variables the application intentionally runs in labeled local demo mode. Copy `.env.example` to `.env.local` and add environment-specific values to activate authentication and persistence.

## Quality gates

```bash
npm run verify
```

This runs TypeScript, product/schema tests, credential-pattern scanning and a production build. See `DEPLOYMENT.md` for GitHub → Vercel release instructions and `ACCESSIBILITY_PERFORMANCE_CHECKLIST.md` for manual release gates.

## Security

NVIDIA credentials are server-only. Supabase authorization relies on reviewed row-level security policies. Never commit `.env.local`, service-role keys, learner evidence or production exports.
