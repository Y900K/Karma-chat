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
) {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from(table)
    .select("organization_id,role,status")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function learnerDashboard(userId: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured");

  const [account, profile, attempts, progress, evidence, interviews, skillGraph, matches, applications, notifications] =
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
      supabase.from("learning_progress").select("status,progress_percent").eq("user_id", userId),
      supabase.from("skill_evidence").select("verification_status").eq("user_id", userId),
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
        .select("score,job_id,jobs(title,location)")
        .eq("user_id", userId)
        .order("score", { ascending: false })
        .limit(3),
      supabase.from("applications").select("status").eq("user_id", userId),
      supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", userId).is("read_at", null),
    ]);

  const failures = [account, profile, attempts, progress, evidence, interviews, skillGraph, matches, applications, notifications]
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
      completedLessons: (progress.data ?? []).filter((row) => row.status === "completed").length,
      verifiedEvidence: (evidence.data ?? []).filter((row) => row.verification_status === "verified").length,
      pendingEvidence: (evidence.data ?? []).filter((row) => row.verification_status === "pending").length,
      applications: applications.data?.length ?? 0,
      unreadNotifications: notifications.count ?? 0,
    },
    latestInterview: interviews.data?.[0] ?? null,
    skills: skillGraph.data ?? [],
    matches: matches.data ?? [],
  };
}

async function instituteDashboard(userId: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const membership = await getMembership("organization_memberships", userId);
  if (!membership) return { organization: null, metrics: { cohorts: 0, learners: 0, openSupportActions: 0 }, cohorts: [] };

  const [organization, cohorts, snapshots, support] = await Promise.all([
    supabase.from("organizations").select("name,verification_status").eq("id", membership.organization_id).single(),
    supabase
      .from("cohorts")
      .select("id,name,trade,semester,status")
      .eq("organization_id", membership.organization_id)
      .eq("status", "active"),
    supabase.from("cohort_latest_metric_snapshots").select("cohort_id,captured_on,learner_count,readiness_percent,engagement_percent,evidence_percent,application_count,offer_count"),
    supabase
      .from("learner_support_actions")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", membership.organization_id)
      .in("status", ["open", "assigned"]),
  ]);
  if (organization.error || cohorts.error || snapshots.error || support.error) throw organization.error ?? cohorts.error ?? snapshots.error ?? support.error;
  const cohortRows = cohorts.data ?? [];
  const snapshotByCohort=new Map((snapshots.data??[]).map(snapshot=>[snapshot.cohort_id,snapshot]));
  const latestSnapshots = cohortRows.map((cohort) => ({...cohort,latestSnapshot:snapshotByCohort.get(cohort.id)??null}));
  return {
    organization: { ...organization.data, role: membership.role },
    metrics: {
      cohorts: cohortRows.length,
      learners: latestSnapshots.reduce((sum, cohort) => sum + Number(cohort.latestSnapshot?.learner_count ?? 0), 0),
      openSupportActions: support.count ?? 0,
    },
    cohorts: latestSnapshots,
  };
}

async function employerDashboard(userId: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const membership = await getMembership("employer_memberships", userId);
  if (!membership) return { organization: null, metrics: { openRoles: 0, vacancies: 0, applications: 0, offers: 0 }, jobs: [] };

  const [organization, jobs] = await Promise.all([
    supabase.from("organizations").select("name,verification_status").eq("id", membership.organization_id).single(),
    supabase
      .from("jobs")
      .select("id,title,status,salary_min,salary_max,location,requirements")
      .eq("organization_id", membership.organization_id)
      .order("published_at", { ascending: false }),
  ]);
  if (organization.error || jobs.error) throw organization.error ?? jobs.error;
  const jobIds = (jobs.data ?? []).map((job) => job.id);
  const [applications, pipeline] = jobIds.length
    ? await Promise.all([
        supabase.from("applications").select("id,job_id,status,submitted_at").in("job_id", jobIds),
        supabase.from("hiring_pipeline_entries").select("application_id,stage,stage_updated_at"),
      ])
    : [{ data: [], error: null }, { data: [], error: null }];
  if (applications.error || pipeline.error) throw applications.error ?? pipeline.error;
  return {
    organization: { ...organization.data, role: membership.role },
    metrics: {
      openRoles: (jobs.data ?? []).filter((job) => job.status === "published").length,
      vacancies: (jobs.data ?? []).reduce((sum, job) => sum + Number((job.requirements as { openings?: number } | null)?.openings ?? 1), 0),
      applications: applications.data?.length ?? 0,
      offers: (pipeline.data ?? []).filter((entry) => entry.stage === "offer" || entry.stage === "hired").length,
    },
    jobs: jobs.data ?? [],
  };
}

async function governmentDashboard(userId: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const membership = await getMembership("program_memberships", userId);
  if (!membership) return { organization: null, metrics: { snapshots: 0, openCases: 0, criticalCases: 0 }, snapshots: [] };
  const [organization, snapshots, cases, models] = await Promise.all([
    supabase.from("organizations").select("name,verification_status").eq("id", membership.organization_id).single(),
    supabase
      .from("aggregate_metric_snapshots")
      .select("geography_level,geography_code,metric_key,metric_value,cohort_size,period_end")
      .eq("program_organization_id", membership.organization_id)
      .eq("suppressed", false)
      .order("period_end", { ascending: false })
      .limit(30),
    supabase.from("governance_cases").select("severity,status").eq("program_organization_id", membership.organization_id),
    supabase.from("model_releases").select("model_key,version,status,risk_level,approved_at").eq("status", "approved"),
  ]);
  if (organization.error || snapshots.error || cases.error || models.error) throw organization.error ?? snapshots.error ?? cases.error ?? models.error;
  return {
    organization: { ...organization.data, role: membership.role },
    metrics: {
      snapshots: snapshots.data?.length ?? 0,
      openCases: (cases.data ?? []).filter((item) => item.status === "open" || item.status === "investigating").length,
      criticalCases: (cases.data ?? []).filter((item) => item.severity === "critical" && item.status !== "resolved").length,
      approvedModels: models.data?.length ?? 0,
    },
    snapshots: snapshots.data ?? [],
  };
}

async function adminDashboard() {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const [resources, partnerCases, flags, prompts] = await Promise.all([
    supabase.from("external_resources").select("review_status,permission_status,next_review_at"),
    supabase.from("partner_verification_cases").select("status,risk_rating"),
    supabase.from("feature_flags").select("key,enabled,rollout_percent,risk_tier"),
    supabase.from("prompt_versions").select("prompt_key,version,status"),
  ]);
  if (resources.error || partnerCases.error || flags.error || prompts.error) throw resources.error ?? partnerCases.error ?? flags.error ?? prompts.error;
  const now = Date.now();
  return {
    metrics: {
      publishedResources: (resources.data ?? []).filter((item) => item.review_status === "approved").length,
      brokenResources: (resources.data ?? []).filter((item) => ["broken", "revoked"].includes(item.permission_status)).length,
      reviewsDue: (resources.data ?? []).filter((item) => item.next_review_at && new Date(item.next_review_at).getTime() <= now).length,
      partnerCasesOpen: (partnerCases.data ?? []).filter((item) => ["pending", "reviewing"].includes(item.status)).length,
      enabledFlags: (flags.data ?? []).filter((item) => item.enabled).length,
      productionPrompts: (prompts.data ?? []).filter((item) => item.status === "production").length,
    },
    flags: flags.data ?? [],
  };
}

export async function GET(request: NextRequest) {
  const scope = request.nextUrl.searchParams.get("scope") as DashboardScope | null;
  if (!scope || !allowedScopes.has(scope)) return json({ error: "Invalid dashboard scope" }, 400);

  try {
    const viewer = await requirePersona(scope as Persona, "admin");
    const data =
      scope === "learner"
        ? await learnerDashboard(viewer.id)
        : scope === "institute"
          ? await instituteDashboard(viewer.id)
          : scope === "employer"
            ? await employerDashboard(viewer.id)
            : scope === "government"
              ? await governmentDashboard(viewer.id)
              : await adminDashboard();
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
