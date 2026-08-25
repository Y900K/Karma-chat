import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { requestId } from "@/lib/observability";
import { consumeRateLimit, requestIp } from "@/lib/rate-limit";

const reportSchema = z.object({
  type: z.enum(["incorrect_data", "fairness", "privacy", "accessibility", "unsafe_content", "other"]),
  email: z.email().max(320).optional().or(z.literal("")),
  summary: z.string().trim().min(20).max(5000),
  language: z.enum(["en", "hi"]),
  consentToContact: z.boolean(),
});

export async function POST(request: Request) {
  const id = requestId(request);
  const headers = { "x-request-id": id, "cache-control": "no-store" };
  if (Number(request.headers.get("content-length") || 0) > 12_000)
    return NextResponse.json({ error: "Report is too large.", requestId: id }, { status: 413, headers });

  try {
    const limit = await consumeRateLimit({
      subjectType: "ip",
      subject: requestIp(request),
      action: "public_trust_report",
      limit: 5,
      windowSeconds: 3600,
    });
    if (!limit.allowed)
      return NextResponse.json({ error: "Too many reports. Please wait before trying again.", requestId: id }, { status: 429, headers });

    const parsed = reportSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success)
      return NextResponse.json({ error: "Check the report details and try again.", requestId: id }, { status: 400, headers });

    const admin = createAdminClient();
    if (!admin)
      return NextResponse.json({ error: "Secure reporting is temporarily unavailable.", requestId: id }, { status: 503, headers });

    const { data, error } = await admin
      .from("public_trust_reports")
      .insert({
        report_type: parsed.data.type,
        contact_email: parsed.data.email || null,
        summary: parsed.data.summary,
        preferred_language: parsed.data.language,
        consent_to_contact: parsed.data.consentToContact,
      })
      .select("reference_code")
      .single();
    if (error) throw error;

    return NextResponse.json({ referenceCode: data.reference_code, requestId: id }, { status: 201, headers });
  } catch {
    return NextResponse.json(
      { error: "We could not save the report. No success was recorded—please retry.", requestId: id },
      { status: 500, headers },
    );
  }
}
