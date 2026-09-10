import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { consumeRateLimit, requestIp } from "@/lib/rate-limit";
import { requestId } from "@/lib/observability";
import { readBoundedJson } from "@/lib/bounded-json";

const allowed = new Set([
  "page_viewed", "signup_started", "onboarding_completed", "diagnostic_completed",
  "lesson_completed", "evidence_submitted", "interview_completed", "job_viewed",
  "application_submitted", "offer_accepted", "placement_confirmed",
]);

export async function POST(request: Request) {
  const id = requestId(request);
  const headers = { "x-request-id": id };
  if (Number(request.headers.get("content-length") || 0) > 4096)
    return NextResponse.json({ error: "Request is too large", requestId: id }, { status: 413, headers });
  const limit = await consumeRateLimit({ subjectType: "ip", subject: requestIp(request), action: "analytics_event", limit: 120, windowSeconds: 60 });
  if (!limit.allowed)
    return NextResponse.json({ error: "Too many events", requestId: id }, { status: 429, headers });
  const parsedBody = await readBoundedJson(request,4096);
  if(!parsedBody.ok)return NextResponse.json({error:parsedBody.error},{status:parsedBody.status,headers});
  const body = parsedBody.value;
  if (!body || typeof body !== "object")
    return NextResponse.json({ error: "Invalid JSON", requestId: id }, { status: 400, headers });
  const event = body as Record<string, unknown>;
  if (typeof event.event !== "string" || !allowed.has(event.event) || typeof event.path !== "string" || event.path.length > 200)
    return NextResponse.json({ error: "Event rejected", requestId: id }, { status: 400, headers });
  const supabase = await createClient();
  if (!supabase)
    return NextResponse.json({ accepted: true, stored: false, requestId: id }, { status: 202, headers });
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from("analytics_events").insert({
    user_id: user?.id || null,
    event_name: event.event,
    path: event.path,
    properties: {},
    occurred_at: new Date().toISOString(),
  });
  if (error)
    return NextResponse.json({ accepted: false, stored: false, requestId: id }, { status: 503, headers });
  return NextResponse.json({ accepted: true, stored: true, requestId: id }, { status: 202, headers });
}
