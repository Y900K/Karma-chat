import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, requirePersona } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";

const headers = { "cache-control": "private, no-store" };

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers });
}

export async function GET() {
  try {
    const viewer = await requirePersona("learner", "admin");
    if (viewer.demo) {
      return json({
        source: "demo",
        account: { email: viewer.email, displayName: "Local learner", preferredLanguage: "en" },
        profile: null,
        consents: {},
        preferences: null,
      });
    }
    const sb = await createClient();
    if (!sb) return json({ error: "Persistence is unavailable" }, 503);
    const [account, profile, consents, preferences] = await Promise.all([
      sb.from("user_accounts").select("display_name,preferred_language").eq("user_id", viewer.id).single(),
      sb.from("learner_profiles").select("full_name,institute_name,education_level,trade,current_semester,target_role_slug,home_location,mobility_preference,preferred_language,profile_visibility,onboarding_completed_at").eq("user_id", viewer.id).maybeSingle(),
      sb.from("consent_records").select("purpose,granted,captured_at").eq("user_id", viewer.id).order("captured_at", { ascending: false }),
      sb.from("communication_preferences").select("email_enabled,interview_reminders,weekly_summary,quiet_hours_start,quiet_hours_end").eq("user_id", viewer.id).maybeSingle(),
    ]);
    const error = account.error ?? profile.error ?? consents.error ?? preferences.error;
    if (error) throw error;
    const latestConsents: Record<string, boolean> = {};
    for (const row of consents.data ?? []) {
      if (!(row.purpose in latestConsents)) latestConsents[row.purpose] = row.granted;
    }
    return json({
      source: "live",
      account: {
        email: viewer.email,
        displayName: profile.data?.full_name ?? account.data?.display_name ?? "Learner",
        preferredLanguage: profile.data?.preferred_language ?? account.data?.preferred_language ?? "en",
      },
      profile: profile.data,
      consents: latestConsents,
      preferences: preferences.data,
    });
  } catch (error) {
    if (error instanceof AuthError) return json({ error: error.message }, error.status);
    console.error("Account profile read failed", { cause: error instanceof Error ? error.name : "unknown" });
    return json({ error: "Account information is temporarily unavailable" }, 503);
  }
}

const settingsSchema = z.object({
  displayName: z.string().trim().min(2).max(120),
  preferredLanguage: z.enum(["en", "hi"]),
  profileVisibility: z.enum(["private", "matched_employers", "public_link"]),
  communication: z.object({
    emailEnabled: z.boolean(),
    interviewReminders: z.boolean(),
    weeklySummary: z.boolean(),
    quietHoursStart: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    quietHoursEnd: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  }),
});

async function updateSettings(request: NextRequest, raw: unknown) {
  try {
    const viewer = await requirePersona("learner", "admin");
    const input = settingsSchema.parse(raw);
    if (viewer.demo) return json({ ok: true, source: "demo" });
    const sb = await createClient();
    if (!sb) return json({ error: "Persistence is unavailable" }, 503);
    const [account, profile, preferences] = await Promise.all([
      sb.rpc("update_own_account_profile", {
        p_display_name: input.displayName,
        p_preferred_language: input.preferredLanguage,
      }),
      sb.from("learner_profiles").update({
        full_name: input.displayName,
        preferred_language: input.preferredLanguage,
        profile_visibility: input.profileVisibility,
      }).eq("user_id", viewer.id),
      sb.from("communication_preferences").upsert({
        user_id: viewer.id,
        email_enabled: input.communication.emailEnabled,
        interview_reminders: input.communication.interviewReminders,
        weekly_summary: input.communication.weeklySummary,
        quiet_hours_start: input.communication.quietHoursStart,
        quiet_hours_end: input.communication.quietHoursEnd,
      }),
    ]);
    const error = account.error ?? profile.error ?? preferences.error;
    if (error) throw error;
    return json({ ok: true, source: "live" });
  } catch (error) {
    if (error instanceof AuthError) return json({ error: error.message }, error.status);
    if (error instanceof z.ZodError) return json({ error: "Invalid account settings" }, 400);
    console.error("Account profile update failed", { cause: error instanceof Error ? error.name : "unknown" });
    return json({ error: "Account changes could not be saved" }, 503);
  }
}

export async function PATCH(request: NextRequest) {
  return updateSettings(request, await request.json());
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const result = await updateSettings(request, {
    displayName: form.get("displayName"),
    preferredLanguage: form.get("preferredLanguage"),
    profileVisibility: form.get("profileVisibility"),
    communication: {
      emailEnabled: form.get("emailEnabled") === "true",
      interviewReminders: form.get("interviewReminders") === "true",
      weeklySummary: form.get("weeklySummary") === "true",
      quietHoursStart: form.get("quietHoursStart"),
      quietHoursEnd: form.get("quietHoursEnd"),
    },
  });
  if (!result.ok) return result;
  return NextResponse.redirect(new URL("/settings?saved=1", request.url), 303);
}
