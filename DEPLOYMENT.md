# GitHub → Vercel deployment

## 1. Rotate secrets first

The NVIDIA credential was shared in conversation. Revoke it in NVIDIA NGC and create a replacement before production. Never prefix it with `NEXT_PUBLIC_`, commit it, or expose it in browser code.

## 2. Create production services

1. Create separate Supabase projects for preview/staging and production.
2. Apply `supabase/migrations/001_foundation.sql` through `027_scale_regional_integrations.sql` in numerical order.
3. Confirm every table has RLS enabled and run cross-organization authorization tests.
4. Configure the Supabase Auth site URL and `https://YOUR_DOMAIN/auth/callback` redirect.
5. Keep the `learner-evidence` bucket private.

## 3. GitHub repository

Create a private repository from this directory. Protect `main` and require the `verify` GitHub Actions job before merging. `.gitignore` blocks `.env.local`.

## 4. Import into Vercel

Import the GitHub repository as a Next.js project using Node.js 22 and `npm run build`. Configure preview and production variables separately:

| Variable | Visibility | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Browser-safe | Exact HTTPS production origin |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser-safe | Environment-specific Supabase URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser-safe | Publishable key; RLS remains mandatory |
| `NVIDIA_API_KEY` | Secret, server-only | Rotated NVIDIA key |
| `NVIDIA_MODEL` | Server-only | Approved model identifier |
| `NVIDIA_EMBEDDING_MODEL` | Server-only | Must match the 1024-dimension retrieval schema |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret, server-only | Maintenance worker only; never browser code |
| `CRON_SECRET` | Secret, server-only | Authenticates the Vercel maintenance schedule |
| `NEXT_PUBLIC_YOUTUBE_VIDEO_ID` | Browser-safe | Approved lesson ID |
| `NEXT_PUBLIC_GOOGLE_DRIVE_FILE_ID` | Browser-safe | Approved view-only resource ID |

Do not add a Supabase service-role key unless a reviewed server-only workflow requires it.

## 5. Release gates

Run `npm run verify`, then `node scripts/check-env.mjs --production` with production variables loaded. Verify `/api/health`, email verification, recovery, RLS isolation, NVIDIA rate limits, YouTube privacy-enhanced embeds, Drive permissions and signed evidence access.

Review the Vercel preview with test data, complete `ACCESSIBILITY_PERFORMANCE_CHECKLIST.md`, review migrations, merge after CI, and smoke-test every persona plus the Trust Center. Monitor errors, AI cost and authentication failures for the first 24 hours.

The GitHub remote and Vercel project are intentionally not created automatically because they require your account authorization and final production domain.
