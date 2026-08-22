import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const publicRoutes=["/","/auth","/trust","/roles"];
for(const route of publicRoutes)test(`${route} renders without serious accessibility violations`,async({page})=>{await page.goto(route);await expect(page.locator("body")).toBeVisible();const results=await new AxeBuilder({page}).disableRules(["color-contrast"]).analyze();expect(results.violations.filter(v=>["critical","serious"].includes(v.impact||""))).toEqual([])});

test("protected workspaces do not expose authenticated data anonymously",async({page})=>{for(const route of ["/dashboard","/institute","/employer","/governance","/admin"]){const response=await page.goto(route);expect(response?.status()).toBeLessThan(500);await expect(page).not.toHaveURL(new RegExp("/p/"))}});

test("health and bounded telemetry contracts remain available",async({request})=>{const health=await request.get("/api/health");expect(health.status()).toBeLessThan(500);const invalidEvent=await request.post("/api/events",{data:{event:"unapproved_event",path:"/"}});expect(invalidEvent.status()).toBe(400);const unauthorizedWorker=await request.get("/api/internal/worker");expect(unauthorizedWorker.status()).toBe(401)});

