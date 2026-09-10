import { NextRequest, NextResponse,after } from "next/server";
import { z } from "zod";
import { AuthError, requireViewer } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { consumeRateLimit, requestIp } from "@/lib/rate-limit";
import { requestId } from "@/lib/observability";
import {recordOperationalError} from "@/lib/observability";
import {readBoundedJson} from "@/lib/bounded-json";
import {processBackgroundJobs} from "@/lib/operations/worker";
export const maxDuration=60;

const createSchema = z.object({
  idempotencyKey: z.string().min(16).max(128),
  transcript: z.string().min(20).max(12000),
  locale: z.enum(["en", "hi"]).default("en"),
}).strict();

export async function POST(request: NextRequest) {
  const id = requestId(request);
  try {
    if (Number(request.headers.get("content-length") || 0) > 16_384)
      return NextResponse.json({ error: "Request is too large", requestId: id }, { status: 413, headers: { "x-request-id": id } });
    const viewer = await requireViewer();
    if (viewer.demo)
      return NextResponse.json({ error: "Background AI jobs require a signed-in account", requestId: id }, { status: 403 });
    const body=await readBoundedJson(request,16384);
    if(!body.ok)return NextResponse.json({error:body.error},{status:body.status});
    const parsed = createSchema.safeParse(body.value);
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid analysis job", requestId: id }, { status: 400 });
    const [userLimit, ipLimit] = await Promise.all([
      consumeRateLimit({ subjectType: "user", subject: viewer.id, action: "ai_analysis_job", limit: 10, windowSeconds: 3600 }),
      consumeRateLimit({ subjectType: "ip", subject: requestIp(request), action: "ai_analysis_job", limit: 30, windowSeconds: 3600 }),
    ]);
    if (!userLimit.allowed || !ipLimit.allowed)
      return NextResponse.json({ error: "Analysis job limit reached", requestId: id }, { status: 429 });
    const supabase = await createClient();
    if (!supabase)
      return NextResponse.json({ error: "Service unavailable", requestId: id }, { status: 503 });
    const { data, error } = await supabase.rpc("enqueue_ai_analysis_job", {
      p_idempotency_key: parsed.data.idempotencyKey,
      p_payload: { transcript: parsed.data.transcript, locale: parsed.data.locale },
    });
    if (error) throw error;
    after(async()=>{try{await processBackgroundJobs(`enqueue-${id}`,1);}catch{await recordOperationalError({service:"worker",code:"enqueue_dispatch_failed",route:"/api/ai/jobs",requestId:id});}});
    return NextResponse.json({ jobId: data, status: "pending", requestId: id }, { status: 202, headers: { "x-request-id": id } });
  } catch (error) {
    if (error instanceof AuthError)
      return NextResponse.json({ error: error.message, requestId: id }, { status: error.status });
    return NextResponse.json({ error: "Unable to enqueue analysis", requestId: id }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const id = requestId(request);
  try {
    const viewer = await requireViewer();
    if (viewer.demo) return NextResponse.json({ jobs: [], requestId: id });
    const supabase = await createClient();
    if (!supabase)
      return NextResponse.json({ error: "Service unavailable", requestId: id }, { status: 503 });
    const jobId = z.coerce.number().int().positive().safeParse(new URL(request.url).searchParams.get("id"));
    let query = supabase.from("background_jobs")
      .select("id,job_type,status,result,last_error,created_at,completed_at")
      .eq("user_id", viewer.id).order("id", { ascending: false }).limit(25);
    if (jobId.success) query = query.eq("id", jobId.data);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ jobs: data || [], requestId: id }, { headers: { "cache-control": "no-store", "x-request-id": id } });
  } catch (error) {
    if (error instanceof AuthError)
      return NextResponse.json({ error: error.message, requestId: id }, { status: error.status });
    return NextResponse.json({ error: "Unable to read analysis jobs", requestId: id }, { status: 500 });
  }
}
