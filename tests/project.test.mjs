import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
const root = process.cwd();
const required = [
  "src/app/page.tsx",
  "src/app/auth/page.tsx",
  "src/app/dashboard/page.tsx",
  "src/app/roles/page.tsx",
  "src/app/portfolio/page.tsx",
  "src/app/resume/page.tsx",
  "src/app/schedule/page.tsx",
  "src/app/institute/authoring/page.tsx",
  "src/app/employer/hiring/page.tsx",
  "src/app/trust/page.tsx",
  "src/proxy.ts",
];
test("all critical product routes exist", async () => {
  for (const f of required)
    assert.ok((await stat(join(root, f))).isFile(), `${f} missing`);
});
test("environment example contains placeholders, never deployed values", async () => {
  const env = await readFile(join(root, ".env.example"), "utf8");
  assert.match(env, /NVIDIA_API_KEY=\s*$/m);
  assert.match(env, /NEXT_PUBLIC_SUPABASE_URL=\s*$/m);
  assert.doesNotMatch(env, /nvapi-[A-Za-z0-9_-]{10,}/);
});
test("protected workspaces are listed in proxy", async () => {
  const proxy = await readFile(join(root, "src/proxy.ts"), "utf8");
  for (const route of [
    "/dashboard",
    "/portfolio",
    "/resume",
    "/schedule",
    "/institute",
    "/employer",
    "/admin",
  ])
    assert.ok(proxy.includes(`\"${route}\"`), `${route} is not protected`);
});
test("every migration that creates tables enables row level security", async () => {
  const dir = join(root, "supabase/migrations"),
    files = (await readdir(dir)).filter((x) => x.endsWith(".sql"));
  for (const file of files) {
    const sql = await readFile(join(dir, file), "utf8");
    if (/create\s+table/i.test(sql))
      assert.match(
        sql,
        /enable row level security/i,
        `${file} creates tables without enabling RLS`,
      );
  }
});

test("public signup cannot self-assign a privileged persona", async () => {
  const auth = await readFile(join(root, "src/app/auth/page.tsx"), "utf8");
  assert.match(auth, /data:\s*\{\s*persona:\s*"learner"\s*\}/);
  assert.doesNotMatch(auth, /name="persona"/);
  assert.doesNotMatch(auth, /user_metadata\?\.persona/);
});

test("auth callback rejects protocol-relative redirects", async () => {
  const callback = await readFile(
    join(root, "src/app/auth/callback/route.ts"),
    "utf8",
  );
  assert.match(callback, /!requestedNext\.startsWith\("\/\/"\)/);
});

test("password login establishes the SSR session before navigation", async () => {
  const action = await readFile(join(root, "src/app/auth/actions.ts"), "utf8");
  const authPage = await readFile(join(root, "src/app/auth/page.tsx"), "utf8");
  const homePage = await readFile(join(root, "src/app/page.tsx"), "utf8");
  assert.match(action, /await supabase\.auth\.signInWithPassword/);
  assert.match(authPage, /signInForNavigation/);
  assert.match(homePage, /signInForNavigation/);
  assert.match(authPage, /window\.location\.assign/);
  assert.doesNotMatch(authPage, /router\.push\(destinations/);
});

test("sign out cannot be triggered by Next link prefetch", async () => {
  const route = await readFile(
    join(root, "src/app/auth/signout/route.ts"),
    "utf8",
  );
  const dashboard = await readFile(
    join(root, "src/app/dashboard/page.tsx"),
    "utf8",
  );
  const settings = await readFile(
    join(root, "src/app/settings/page.tsx"),
    "utf8",
  );
  assert.match(route, /export async function POST/);
  assert.doesNotMatch(route, /export async function GET/);
  assert.match(dashboard, /action="\/auth\/signout" method="post"/);
  assert.match(settings, /action="\/auth\/signout" method="post"/);
});

test("every non-learner workspace exposes real shared controls and visible sections", async () => {
  const utility = await readFile(
    join(root, "src/components/workspace-utilities.tsx"),
    "utf8",
  );
  const pilotCss = await readFile(join(root, "src/app/pilot.css"), "utf8");
  assert.match(utility, /action="\/auth\/signout" method="post"/);
  assert.match(utility, /\/api\/preferences/);
  assert.doesNotMatch(pilotCss, /display:\s*none\s*!important/);
  for (const route of ["institute", "employer", "governance", "admin"]) {
    const page = await readFile(
      join(root, `src/app/${route}/page.tsx`),
      "utf8",
    );
    assert.match(page, /WorkspaceSearch/);
    assert.match(page, /WorkspaceSignOut/);
    assert.match(page, /href="\/workspace\/settings"/);
    assert.match(page, /href="\/workspace\/notifications"/);
    assert.doesNotMatch(page, /href="#settings"/);
  }
});

test("shared workspace routes and preferences are authenticated", async () => {
  const proxy = await readFile(join(root, "src/proxy.ts"), "utf8");
  const preferences = await readFile(
    join(root, "src/app/api/preferences/route.ts"),
    "utf8",
  );
  assert.ok(proxy.includes('"/workspace"'));
  assert.match(preferences, /requireViewer\(\)/);
  assert.match(preferences, /preferred_language/);
});

test("partner acquisition stays invitation-only while learner signup stays public", async () => {
  const home = await readFile(join(root, "src/app/page.tsx"), "utf8");
  assert.match(home, /access:\s*"invitation"/);
  assert.match(home, /href="\/invite"/);
  assert.doesNotMatch(home, /name="persona"/);
});

test("public trust promises link to readable policy pages", async () => {
  const trust = await readFile(join(root, "src/app/trust/page.tsx"), "utf8");
  const policy = await readFile(
    join(root, "src/app/trust/[policy]/page.tsx"),
    "utf8",
  );
  for (const slug of ["privacy", "terms", "accessibility", "retention"]) {
    assert.ok(trust.includes(`"${slug}"`), `${slug} policy link missing`);
    assert.ok(policy.includes(`${slug}:`), `${slug} policy content missing`);
  }
});

test("protected navigation avoids duplicate remote user lookups", async () => {
  const proxy = await readFile(join(root, "src/proxy.ts"), "utf8");
  const dal = await readFile(join(root, "src/lib/auth/dal.ts"), "utf8");
  assert.match(proxy, /sessionCookiePresent/);
  assert.match(proxy, /auth\.getClaims\(\)/);
  assert.match(proxy, /userId = claimsError \? null/);
  assert.doesNotMatch(proxy, /!userId && isProtected/);
  assert.match(dal, /auth\.getSession\(\)/);
  assert.match(
    dal,
    /if \(accountResult\.error\) accountResult = await readAccount\(\)/,
  );
  assert.match(dal, /Account authorization is temporarily unavailable/);
  assert.match(dal, /decoded cookie payload is not authorization/);
  assert.doesNotMatch(proxy, /auth\.getUser\(\)/);
  assert.doesNotMatch(dal, /auth\.getUser\(\)/);
});

test("live dashboards expose role-scoped DTOs", async () => {
  const route = await readFile(
    join(root, "src/app/api/dashboard/route.ts"),
    "utf8",
  );
  for (const scope of [
    "learner",
    "institute",
    "employer",
    "government",
    "admin",
  ])
    assert.ok(
      route.includes(`"${scope}"`),
      `${scope} dashboard scope is missing`,
    );
  assert.match(route, /requirePersona\(scope as Persona, "admin"\)/);
  assert.match(route, /private, no-store/);
});

test("opportunity applications use live matches instead of fictional job ids", async () => {
  const opportunities = await readFile(
    join(root, "src/app/opportunities/page.tsx"),
    "utf8",
  );
  const opportunitiesApi = await readFile(
    join(root, "src/app/api/opportunities/route.ts"),
    "utf8",
  );
  assert.match(opportunities, /fetch\("\/api\/opportunities/);
  assert.match(opportunitiesApi, /from\("opportunity_matches"\)/);
  assert.match(opportunitiesApi, /nextCursor/);
  assert.doesNotMatch(opportunities, /apex-junior-electrical/);
  assert.doesNotMatch(opportunities, /shivam-maintenance-apprentice/);
});

test("every learner workflow has a page-level persona guard", async () => {
  for (const route of [
    "onboarding",
    "diagnostic",
    "learn",
    "evidence",
    "interview",
    "opportunities",
    "portfolio",
    "resume",
    "schedule",
    "settings",
    "notifications",
  ]) {
    const layout = await readFile(
      join(root, `src/app/${route}/layout.tsx`),
      "utf8",
    );
    assert.match(
      layout,
      /learner-route-layout/,
      `${route} is missing the learner route guard`,
    );
  }
});

test("pilot identity migration blocks direct persona changes and validates invitations", async () => {
  const sql = await readFile(
    join(root, "supabase/migrations/030_pilot_identity_and_invitations.sql"),
    "utf8",
  );
  assert.match(
    sql,
    /revoke update on table public\.user_accounts from anon, authenticated/i,
  );
  assert.match(sql, /values \(new\.id, 'learner'/i);
  assert.match(sql, /lower\(email\) = v_email/i);
  assert.match(sql, /verification_status <> 'verified'/i);
  assert.match(
    sql,
    /drop policy if exists "learners upload own evidence files"/i,
  );
});

test("learning media comes only from the approved registry", async () => {
  const lesson = await readFile(join(root, "src/app/learn/page.tsx"), "utf8");
  const api = await readFile(
    join(root, "src/app/api/learning/lesson/route.ts"),
    "utf8",
  );
  assert.doesNotMatch(
    lesson,
    /NEXT_PUBLIC_YOUTUBE_VIDEO_ID|NEXT_PUBLIC_GOOGLE_DRIVE_FILE_ID/,
  );
  assert.match(api, /external_resources/);
  assert.match(api, /review_status.*approved/);
  assert.match(api, /permission_status.*valid/);
});

test("unverified public profile snapshots are closed", async () => {
  const profile = await readFile(
    join(root, "src/app/p/[token]/page.tsx"),
    "utf8",
  );
  assert.match(profile, /notFound\(\)/);
  assert.doesNotMatch(profile, /Aarav Sharma/);
});

test("interactive NVIDIA coaching uses a latency-safe model and truthful states", async () => {
  const provider = await readFile(join(root, "src/lib/ai/nvidia.ts"), "utf8");
  const route = await readFile(join(root, "src/app/api/ai/route.ts"), "utf8");
  const dashboard = await readFile(
    join(root, "src/app/dashboard/page.tsx"),
    "utf8",
  );
  const interview = await readFile(
    join(root, "src/app/interview/page.tsx"),
    "utf8",
  );
  assert.match(provider, /NVIDIA_INTERACTIVE_MODEL/);
  assert.match(provider, /meta\/llama-3\.1-8b-instruct/);
  assert.match(provider, /NVIDIA_FALLBACK_MODEL/);
  assert.match(provider, /AbortSignal\.timeout\(input\.timeoutMs\)/);
  assert.match(route, /error\.name === "TimeoutError"/);
  assert.match(route, /status: "failed"/);
  assert.match(route, /unsafeElectricalGuidance/);
  assert.match(route, /status: "refused"/);
  assert.match(route, /safetyFiltered: true/);
  assert.match(dashboard, /SAFE FALLBACK/);
  assert.match(dashboard, /"READY"/);
  assert.match(interview, /Retry live AI/);
  assert.match(interview, /Live NVIDIA coaching/);
});

test("workspace navigation has unique destinations and learner escape routes", async () => {
  const utility = await readFile(
    join(root, "src/components/workspace-utilities.tsx"),
    "utf8",
  );
  assert.match(utility, /export function WorkspaceSectionLink/);
  assert.match(utility, /aria-current/);
  assert.match(utility, /export function LearnerReturnLink/);
  assert.match(utility, /aria-label="Back to dashboard"/);
  for (const route of ["institute", "employer", "governance", "admin"]) {
    const page = await readFile(
      join(root, `src/app/${route}/page.tsx`),
      "utf8",
    );
    assert.match(page, /WorkspaceSectionLink/);
    const targets = [
      ...page.matchAll(/\[[A-Za-z0-9]+,\s*"[^"]+",\s*"([^"]+)"\]/g),
    ].map((match) => match[1]);
    assert.equal(
      new Set(targets).size,
      targets.length,
      `${route} has duplicate sidebar targets`,
    );
  }
  for (const route of [
    "learn",
    "evidence",
    "interview",
    "opportunities",
    "portfolio",
    "resume",
    "schedule",
  ]) {
    const page = await readFile(
      join(root, `src/app/${route}/page.tsx`),
      "utf8",
    );
    assert.match(
      page,
      /LearnerReturnLink/,
      `${route} is missing a visible dashboard return`,
    );
  }
});
