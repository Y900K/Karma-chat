import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const publicRoutes=["/","/auth","/trust","/roles"];
for(const route of publicRoutes)test(`${route} renders without serious accessibility violations including contrast`,async({page})=>{await page.emulateMedia({reducedMotion:"reduce"});await page.goto(route,{waitUntil:"domcontentloaded"});await expect(page.locator("main").first()).toBeVisible();await expect(page.locator("h1").first()).toBeVisible();const results=await new AxeBuilder({page}).exclude("iframe").analyze();expect(results.violations.filter(v=>["critical","serious"].includes(v.impact||""))).toEqual([])});

test("protected workspaces do not expose authenticated data anonymously",async({page})=>{test.skip(!process.env.E2E_BASE_URL&&!process.env.E2E_LEARNER_EMAIL,"Requires a configured auth environment; unconfigured development uses demo mode");for(const route of ["/dashboard","/institute","/employer","/governance","/admin"]){const response=await page.goto(route);expect(response?.status()).toBeLessThan(500);await expect(page).toHaveURL(/\/auth(?:\?|$)/)}expect((await page.request.get("/api/dashboard?scope=learner")).status()).toBe(401)});

test("health and bounded telemetry contracts remain available",async({request})=>{const health=await request.get("/api/health");expect(health.status()).toBeLessThan(500);const invalidEvent=await request.post("/api/events",{data:{event:"unapproved_event",path:"/"}});expect(invalidEvent.status()).toBe(400);const unauthorizedWorker=await request.get("/api/internal/worker");expect(unauthorizedWorker.status()).toBe(401)});

test("learner session survives protected sidebar navigation",async({page})=>{
  test.setTimeout(120_000);
  const email=process.env.E2E_LEARNER_EMAIL,password=process.env.E2E_LEARNER_PASSWORD;
  test.skip(!email||!password,"Authenticated fixture credentials are not configured");
  await page.goto("/auth");
  await page.getByLabel("Email address").fill(email!);
  await page.locator('input[name="password"]').fill(password!);
  await page.getByRole("button",{name:/sign in/i}).click();
  await page.waitForURL("**/dashboard",{timeout:20_000});
  expect((await page.request.get("/api/dashboard?scope=employer")).status()).toBe(403);
  await page.getByLabel("Search roles and skills").fill("learning");
  await page.getByLabel("Search roles and skills").press("Enter");
  await expect(page).toHaveURL(/\/learn$/);
  const routes=["/portfolio","/learn","/evidence","/interview","/opportunities","/settings","/notifications"];
  for(let round=1;round<=3;round++)for(const route of routes)await test.step(`navigation round ${round}: ${route}`,async()=>{
    const response=await page.goto(route,{waitUntil:"domcontentloaded",timeout:30_000});
    expect(response?.status()).toBeLessThan(500);
    await expect(page).not.toHaveURL(/\/auth(?:\?|$)/);
    await expect(page.locator("body")).toBeVisible();
  });
});

const partnerJourneys = [
  {
    persona: "institute",
    home: "/institute",
    links: ["Overview", "Learners & evidence", "Cohorts", "Learning", "Placements", "Reports"],
    targets: ["institute-overview", "institute-learners", "institute-cohorts", "institute-learning", "institute-placements", "institute-reports"],
  },
  {
    persona: "employer",
    home: "/employer",
    links: ["Overview", "Jobs", "Talent", "Hiring pipeline"],
    targets: ["employer-overview", "employer-jobs", "employer-talent", "employer-pipeline"],
  },
  {
    persona: "government",
    home: "/governance",
    links: ["Overview", "District network", "Demand signals", "Fairness & AI governance", "Grievances", "Data exports"],
    targets: ["government-overview", "government-districts", "government-demand", "government-fairness", "government-reviews", "government-exports"],
  },
  {
    persona: "admin",
    home: "/admin",
    links: ["Command center", "Content operations", "Partner verification", "AI prompts & evals", "Feature flags", "System health"],
    targets: ["admin-overview", "admin-content", "admin-partners", "admin-ai", "admin-flags", "admin-health"],
  },
] as const;

for (const journey of partnerJourneys) {
  test(`${journey.persona} live workspace controls remain role-scoped and navigable`, async ({ page }, testInfo) => {
    test.setTimeout(120_000);
    const prefix = journey.persona.toUpperCase();
    const email = process.env[`E2E_${prefix}_EMAIL`];
    const password = process.env[`E2E_${prefix}_PASSWORD`];
    test.skip(!email || !password, `Authenticated ${journey.persona} fixture credentials are not configured`);

    await page.goto("/auth");
    await page.getByLabel("Email address").fill(email!);
    await page.locator('input[name="password"]').fill(password!);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL(`**${journey.home}`, { timeout: 20_000 });
    await expect(page.getByLabel("Live dashboard data status")).toContainText("Live Supabase");
    await expect(page.getByLabel("Live dashboard data status")).not.toContainText("Unavailable");
    if (journey.persona !== "admin") {
      expect((await page.request.get("/api/dashboard?scope=admin")).status()).toBe(403);
    }

    for (let index = 0; index < journey.links.length; index += 1) {
      await test.step(`open ${journey.links[index]}`, async () => {
        if (testInfo.project.name.startsWith("mobile")) {
          await page.getByRole("button", { name: "Navigate workspace", exact: true }).click();
        }
        const navigation = testInfo.project.name.startsWith("mobile")
          ? page.getByRole("navigation", { name: "Workspace sections", exact: true })
          : page.locator("aside nav");
        await navigation.locator(`a[href="#${journey.targets[index]}"]`).click();
        await expect(page).toHaveURL(new RegExp(`${journey.home}#${journey.targets[index]}$`));
        await expect(page.locator(`#${journey.targets[index]}`)).toBeVisible();
        await expect(page.locator(".live-records").getByRole("status")).toHaveCount(0);
        await expect(page.locator(".live-records").getByRole("alert")).toHaveCount(0);
      });
    }

    await page.getByRole("link", { name: new RegExp(`${journey.persona} notifications`, "i") }).click();
    await expect(page).toHaveURL(/\/workspace\/notifications$/);
    await page.getByRole("link", { name: /back to .* workspace/i }).click();
    await expect(page).toHaveURL(new RegExp(`${journey.home}$`));
    await page.getByRole("link", { name: new RegExp(`${journey.persona} account settings`, "i") }).click();
    await expect(page).toHaveURL(/\/workspace\/settings$/);
    await page.getByRole("button", { name: /sign out/i }).click();
    await expect(page).toHaveURL(/\/auth(?:\?|$)/);
  });
}
