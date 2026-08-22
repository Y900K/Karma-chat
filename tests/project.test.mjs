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

test("live dashboards expose role-scoped DTOs", async () => {
  const route = await readFile(
    join(root, "src/app/api/dashboard/route.ts"),
    "utf8",
  );
  for (const scope of ["learner", "institute", "employer", "government", "admin"])
    assert.ok(route.includes(`"${scope}"`), `${scope} dashboard scope is missing`);
  assert.match(route, /requirePersona\(scope as Persona, "admin"\)/);
  assert.match(route, /private, no-store/);
});

test("opportunity applications use live matches instead of fictional job ids", async () => {
  const opportunities = await readFile(
    join(root, "src/app/opportunities/page.tsx"),
    "utf8",
  );
  assert.match(opportunities, /from\("opportunity_matches"\)/);
  assert.doesNotMatch(opportunities, /apex-junior-electrical/);
  assert.doesNotMatch(opportunities, /shivam-maintenance-apprentice/);
});
