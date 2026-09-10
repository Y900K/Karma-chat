import { NextResponse } from "next/server";
import { createClient as anonymousClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

const responseHeaders = { "cache-control": "no-store" };
const revision = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";

export async function GET() {
  const supabase = createAdminClient();

  if (!supabase) {
    return NextResponse.json(
      {
        status: "degraded",
        service: "karmasetu-web",
        revision,
        database: "not_configured",
        timestamp: new Date().toISOString(),
      },
      { status: 503, headers: responseHeaders },
    );
  }

  try {
    const { error } = await supabase
      .from("learning_lessons")
      .select("id")
      .eq("status", "published").limit(1).abortSignal(AbortSignal.timeout(4000));
    const publicDb=anonymousClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false}});
    const {error:publicError}=await publicDb.from("external_resources").select("id").eq("review_status","approved").eq("permission_status","valid").limit(1).abortSignal(AbortSignal.timeout(4000));
    const unavailable=Boolean(error||publicError);

    if (error) {
      console.error("Health database check failed", { code: error.code });
    }

    return NextResponse.json(
      {
        status: unavailable ? "degraded" : "ok",
        service: "karmasetu-web",
        revision,
        database: error ? "unavailable" : "ok",
        publicContent: publicError ? "unavailable" : "ok",
        ai: process.env.NVIDIA_API_KEY ? "configured_not_probed" : "not_configured",
        timestamp: new Date().toISOString(),
      },
      { status: unavailable ? 503 : 200, headers: responseHeaders },
    );
  } catch (error) {
    console.error("Health database check failed", {
      cause: error instanceof Error ? error.name : "unknown",
    });

    return NextResponse.json(
      {
        status: "degraded",
        service: "karmasetu-web",
        revision,
        database: "unavailable",
        timestamp: new Date().toISOString(),
      },
      { status: 503, headers: responseHeaders },
    );
  }
}
