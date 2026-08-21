import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const responseHeaders = { "cache-control": "no-store" };

export async function GET() {
  const supabase = createAdminClient();

  if (!supabase) {
    return NextResponse.json(
      {
        status: "degraded",
        service: "karmasetu-web",
        database: "not_configured",
        timestamp: new Date().toISOString(),
      },
      { status: 503, headers: responseHeaders },
    );
  }

  try {
    const { error } = await supabase
      .from("learning_lessons")
      .select("id", { head: true, count: "exact" })
      .eq("status", "published");

    if (error) {
      console.error("Health database check failed", { code: error.code });
    }

    return NextResponse.json(
      {
        status: error ? "degraded" : "ok",
        service: "karmasetu-web",
        database: error ? "unavailable" : "ok",
        timestamp: new Date().toISOString(),
      },
      { status: error ? 503 : 200, headers: responseHeaders },
    );
  } catch (error) {
    console.error("Health database check failed", {
      cause: error instanceof Error ? error.name : "unknown",
    });

    return NextResponse.json(
      {
        status: "degraded",
        service: "karmasetu-web",
        database: "unavailable",
        timestamp: new Date().toISOString(),
      },
      { status: 503, headers: responseHeaders },
    );
  }
}
