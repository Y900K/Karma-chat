import { NextRequest, NextResponse } from "next/server";
import { AuthError, requirePersona, type Persona } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";

type DashboardScope = "learner" | "institute" | "employer" | "government" | "admin";

const allowedScopes = new Set<DashboardScope>([
  "learner",
  "institute",
  "employer",
  "government",
  "admin",
]);

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "cache-control": "private, no-store" },
  });
}

async function getMembership(
  table: "organization_memberships" | "employer_memberships" | "program_memberships",
  userId: string,
  organizationId?: string | null,
) {
  const supabase = await createClient();
  if (!supabase) return null;
  let query = supabase
    .from(table)
    .select("organization_id,role,status")
    .eq("user_id", userId)
    .eq("status", "active").order("organization_id");
  if (organizationId) query = query.eq("organization_id", organizationId);
  const { data, error } = await query.limit(1).maybeSingle();
  if (error) throw error;
  if (organizationId && !data) throw new AuthError("Organization access denied",403);
  return data;
}

async function learnerDashboard(userId: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured");

  const [account, profile, attempts, interviews, skillGraph, matches] =
    await Promise.all([
      supabase.from("user_accounts").select("display_name,preferred_language").eq("user_id", userId).maybeSingle(),
      supabase
        .from("learner_profiles")
        .select("full_name,trade,current_semester,target_role_slug,home_location,onboarding_completed_at")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("assessment_attempts")
        .select("score,completed_at")
        .eq("user_id", userId)
        .eq("status", "completed")
        .order("completed_at", { ascending: false })
        .limit(1),
      supabase
        .from("interview_sessions")
        .select("score_summary,completed_at")
        .eq("user_id", userId)
        .eq("status", "completed")
        .order("completed_at", { ascending: false })
        .limit(1),
      supabase
        .from("skill_graph_nodes")
        .select("skill_slug,proficiency_score,evidence_strength,updated_at")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(12),
      supabase
        .from("opportunity_matches")
        .select("score,job_id,jobs!inner(title,location,status,organizations!inner(verification_status))")
        .eq("jobs.status", "published")
        .eq("jobs.organizations.verification_status", "verified")
        .eq("user_id", userId)
        .order("score", { ascending: false })
        .limit(3),
    ]);

  const failures = [account, profile, attempts, interviews, skillGraph, matches]
    .map((result) => result.error)
    .filter(Boolean);
  if (failures.length) throw failures[0];

  const graphScores = (skillGraph.data ?? [])
    .map((node) => node.proficiency_score)
    .filter((score): score is number => typeof score === "number");
  const readiness = graphScores.length
    ? Math.round(graphScores.reduce((sum, score) => sum + score, 0) / graphScores.length)
    : (attempts.data?.[0]?.score ?? null);

  return {
    identity: {
      displayName: profile.data?.full_name ?? account.data?.display_name ?? "Learner",
      trade: profile.data?.trade ?? null,
      semester: profile.data?.current_semester ?? null,
      targetRole: profile.data?.target_role_slug ?? null,
      location: profile.data?.home_location ?? null,
      onboardingComplete: Boolean(profile.data?.onboarding_completed_at),
    },
    metrics: {
      readiness,
    },
    latestInterview: interviews.data?.[0] ?? null,
    skills: skillGraph.data ?? [],
    matches: matches.data ?? [],
  };
}

// Lists are served by /api/workspace with cursors. Summary counts are computed
// in SQL across all eligible rows; never infer totals from a capped result set.
async function partnerDashboard(scope: "institute" | "employer" | "government", userId: string, organizationId?: string | null) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const tables = { institute: "organization_memberships", employer: "employer_memberships", government: "program_memberships" } as const;
  const membership = await getMembership(tables[scope], userId, organizationId);
  if (!membership) throw new AuthError("An active organization membership is required", 403);
  const { data, error } = await supabase.from("organizations").select("name,verification_status").eq("id", membership.organization_id).single();
  if (error) throw error;
  return { organization: { ...data, id: membership.organization_id, role: membership.role }, metrics: {} };
}

export async function GET(request: NextRequest) {
  const scope = request.nextUrl.searchParams.get("scope") as DashboardScope | null;
  if (!scope || !allowedScopes.has(scope)) return json({ error: "Invalid dashboard scope" }, 400);

  try {
    const viewer = await requirePersona(scope as Persona, "admin");
    const organizationId = request.nextUrl.searchParams.get("organizationId");
    if(organizationId && !/^[0-9a-f-]{36}$/i.test(organizationId)) return json({error:"Invalid organization"},400);
    const data = scope === "learner"
      ? await learnerDashboard(viewer.id)
      : scope === "admin" ? { metrics: {} }
      : await partnerDashboard(scope, viewer.id, organizationId);
    const sb = await createClient();
    const selected = "organization" in data ? data.organization : null;
    if(sb && !viewer.demo && (scope==="learner" || scope==="admin" || selected)) {
      const {data:totals,error} = await sb.rpc("dashboard_metric_totals",{p_scope:scope,p_organization_id:selected && "id" in selected ? String(selected.id) : null});
      if(error) throw error;
      if(totals && typeof totals==="object" && !Array.isArray(totals)) Object.assign(data.metrics,totals);
    }
    return json({ source: viewer.demo ? "demo" : "live", scope, refreshedAt: new Date().toISOString(), data });
  } catch (error) {
    if (error instanceof AuthError) return json({ error: error.message }, error.status);
    console.error("Dashboard data request failed", {
      scope,
      code: typeof error === "object" && error && "code" in error ? String(error.code) : undefined,
    });
    return json({ error: "Dashboard data is temporarily unavailable" }, 503);
  }
}
