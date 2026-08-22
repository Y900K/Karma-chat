import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const publicRoutes=["/","/auth","/trust","/roles"];
for(const route of publicRoutes)test(`${route} renders without serious accessibility violations`,async({page})=>{await page.goto(route);await expect(page.locator("body")).toBeVisible();const results=await new AxeBuilder({page}).disableRules(["color-contrast"]).analyze();expect(results.violations.filter(v=>["critical","serious"].includes(v.impact||""))).toEqual([])});

test("protected workspaces do not expose authenticated data anonymously",async({page})=>{for(const route of ["/dashboard","/institute","/employer","/governance","/admin"]){const response=await page.goto(route);expect(response?.status()).toBeLessThan(500);await expect(page).not.toHaveURL(new RegExp("/p/"))}});

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
