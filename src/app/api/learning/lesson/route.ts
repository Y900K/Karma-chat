import { NextRequest, NextResponse } from "next/server";
import { AuthError, requirePersona } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    await requirePersona("learner", "admin");
    const lessonId = request.nextUrl.searchParams.get("id") ?? "symbols";
    if (!/^[a-z0-9-]{1,80}$/.test(lessonId)) return NextResponse.json({ error: "Invalid lesson" }, { status: 400 });
    const sb = await createClient();
    if (!sb) return NextResponse.json({ lessonId, resources: [], source: "demo" });
    const [lesson, resources] = await Promise.all([
      sb.from("learning_lessons").select("id,title,objective,duration_seconds,status").eq("id", lessonId).eq("status", "published").maybeSingle(),
      sb.from("external_resources").select("provider,external_id,title_en,title_hi,embed_url,captions_available,text_fallback,next_review_at").eq("review_status", "approved").eq("permission_status", "valid").contains("metadata", { lesson_id: lessonId }),
    ]);
    if (lesson.error || resources.error) throw lesson.error ?? resources.error;
    if (!lesson.data) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    return NextResponse.json({ lesson: lesson.data, resources: resources.data ?? [], source: "live" }, { headers: { "cache-control": "private, no-store" } });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Lesson resource lookup failed", { cause: error instanceof Error ? error.name : "unknown" });
    return NextResponse.json({ error: "Approved lesson resources are temporarily unavailable" }, { status: 503 });
  }
}
