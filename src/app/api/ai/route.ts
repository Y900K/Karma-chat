import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, requireViewer } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { createChatCompletion } from "@/lib/ai/nvidia";
import { retrieveApprovedContext } from "@/lib/ai/retrieval";
import { consumeRateLimit, requestIp } from "@/lib/rate-limit";

export const maxDuration = 30;
const requestSchema = z
  .object({
    task: z.enum(["career-coach", "interviewer"]),
    locale: z.enum(["en", "hi"]).default("en"),
    messages: z
      .array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string().trim().min(1).max(4000),
        }),
      )
      .min(1)
      .max(12),
  })
  .strict();
const prompts = {
  "career-coach": {
    version: "career-coach-v3",
    text: "You are KarmaSetu's bilingual employability coach for Indian technical learners. Give concrete next actions grounded only in context supplied by KarmaSetu. Never promise employment, invent credentials, infer protected traits, or provide discriminatory advice. If approved context is insufficient, say so and recommend human support. Electrical safety is non-negotiable: never tell a learner to touch, hold, open, repair, measure or approach an energized device or circuit; never suggest sensing electricity or magnetic fields with the body. Practical work may happen only on isolated, verified de-energized training equipment under a qualified instructor's direct supervision. Reply in the learner's language; keep English technical words in English and Hindi words in Devanagari.",
  },
  interviewer: {
    version: "interviewer-v2",
    text: "You are a fair entry-level technical interview coach. Ask one job-related question at a time and give evidence-based feedback. Never infer protected traits, guarantee selection, or present practice feedback as an employer decision. Reply in the learner's language; keep English technical words in English and Hindi words in Devanagari.",
  },
} as const;
type Task = keyof typeof prompts;
const unsafeElectricalGuidance = [
  /hold\s+(?:an?\s+)?electrical/i,
  /place\s+your\s+hand\s+(?:on|near)/i,
  /touch\s+(?:a\s+)?(?:live|energized|electrical)/i,
  /feel\s+(?:an?\s+)?(?:electric|magnetic)\s+field/i,
  /हाथ\s+में\s+पकड़/i,
  /हाथ\s+(?:को\s+)?(?:उसके\s+)?पास\s+रख/i,
  /चुंबकीय\s+क्षेत्र\s+का\s+एहसास/i,
];
function safeElectricalFallback(locale: "en" | "hi") {
  return locale === "hi"
    ? "मैं unsafe hands-on electrical निर्देश नहीं दूँगा। अभी 10 minutes approved safety lesson review करें और 5 minutes में isolation, lockout/tagout और zero-energy verification की written checklist बनाएँ। बाकी 5 minutes का practical केवल qualified instructor की direct supervision में, isolated और verified de-energized training equipment पर करें।"
    : "I will not provide unsafe hands-on electrical instructions. Review an approved safety lesson for 10 minutes, then spend 5 minutes writing an isolation, lockout/tagout and zero-energy verification checklist. Use the final 5 minutes for practical work only under a qualified instructor's direct supervision on isolated, verified de-energized training equipment.";
}
async function audit(input: {
  userId: string;
  task: Task;
  requestId: string;
  model: string;
  status: string;
  latency: number;
  inputTokens?: number;
  outputTokens?: number;
}) {
  const sb = await createClient();
  if (!sb) return;
  try {
    await sb.rpc("record_ai_request_audit", {
      p_user_id: input.userId,
      p_prompt_key: input.task,
      p_prompt_version: prompts[input.task].version,
      p_model_key: input.model,
      p_request_id: input.requestId,
      p_status: input.status,
      p_latency_ms: input.latency,
      p_input_tokens: input.inputTokens ?? null,
      p_output_tokens: input.outputTokens ?? null,
    });
  } catch {
    // Observability must never turn a recoverable provider failure into a user-facing outage.
  }
}
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID(),
    started = Date.now();
  let model =
    process.env.NVIDIA_INTERACTIVE_MODEL || "meta/llama-3.1-8b-instruct";
  let auditUserId: string | null = null;
  let fallbackLocale: "en" | "hi" = "en";
  let fallbackTask: Task = "career-coach";
  try {
    if (Number(request.headers.get("content-length") || 0) > 32_768)
      return NextResponse.json(
        { error: "Request is too large", requestId },
        { status: 413 },
      );
    const viewer = await requireViewer();
    auditUserId = viewer.id;
    const [userLimit, ipLimit] = await Promise.all([
      consumeRateLimit({
        subjectType: "user",
        subject: viewer.id,
        action: "interactive_ai",
        limit: 30,
        windowSeconds: 3600,
      }),
      consumeRateLimit({
        subjectType: "ip",
        subject: requestIp(request),
        action: "interactive_ai",
        limit: 90,
        windowSeconds: 3600,
      }),
    ]);
    if (!userLimit.allowed || !ipLimit.allowed)
      return NextResponse.json(
        { error: "AI usage limit reached. Try again later.", requestId },
        { status: 429, headers: { "x-request-id": requestId } },
      );
    const raw = await request.json().catch(() => null),
      parsed = requestSchema.safeParse(raw);
    if (!parsed.success)
      return NextResponse.json(
        {
          error: "Invalid AI request",
          requestId,
          issues: parsed.error.issues.map((x) => ({
            path: x.path.join("."),
            message: x.message,
          })),
        },
        { status: 400 },
      );
    fallbackLocale = parsed.data.locale;
    fallbackTask = parsed.data.task;
    const sb = await createClient();
    if (sb && !viewer.demo) {
      const { data: allowed, error } = await sb.rpc("consume_ai_quota", {
        p_task: parsed.data.task,
        p_request_id: requestId,
      });
      if (error || allowed !== true) {
        await audit({
          userId: viewer.id,
          task: parsed.data.task,
          requestId,
          model,
          status: "rate_limited",
          latency: Date.now() - started,
        });
        return NextResponse.json(
          { error: "AI usage limit reached. Try again later.", requestId },
          { status: 429 },
        );
      }
    }
    if (!process.env.NVIDIA_API_KEY)
      return NextResponse.json(
        { error: "AI service is not configured", requestId },
        { status: 503 },
      );
    const prompt = prompts[parsed.data.task],
      controller = new AbortController(),
      timer = setTimeout(() => controller.abort(), 24_000);
    let response: Response,
      failedOver = false,
      citations: Awaited<
        ReturnType<typeof retrieveApprovedContext>
      >["citations"] = [];
    try {
      const lastUser =
        [...parsed.data.messages]
          .reverse()
          .find((message) => message.role === "user")?.content || "";
      const grounded =
        parsed.data.task === "career-coach"
          ? await retrieveApprovedContext(lastUser, controller.signal)
          : { context: "", citations: [] };
      citations = grounded.citations;
      const grounding = grounded.context
        ? `\n\nAPPROVED KARMASETU CONTEXT:\n${grounded.context}\nCite relevant sources as [S1], [S2]. If the context does not support a claim, state that clearly.`
        : "\n\nNo approved knowledge context was retrieved. Do not invent program, employer, credential, salary, or eligibility facts.";
      const completion = await createChatCompletion({
        requestId,
        signal: controller.signal,
        messages: [
          { role: "system", content: prompt.text + grounding },
          ...parsed.data.messages,
        ],
      });
      response = completion.response;
      model = completion.model;
      failedOver = completion.failedOver;
    } finally {
      clearTimeout(timer);
    }
    if (!response.ok) {
      const status =
        response.status === 429 ? 429 : response.status >= 500 ? 502 : 400;
      await audit({
        userId: viewer.id,
        task: parsed.data.task,
        requestId,
        model,
        status: response.status === 429 ? "rate_limited" : "failed",
        latency: Date.now() - started,
      });
      return NextResponse.json(
        {
          error:
            status === 429
              ? "AI service is busy. Try again shortly."
              : "AI service is temporarily unavailable",
          requestId,
        },
        { status },
      );
    }
    const data = await response.json(),
      message = String(data.choices?.[0]?.message?.content || "").slice(
        0,
        8000,
      );
    if (!message) throw new Error("Empty model response");
    if (
      parsed.data.task === "career-coach" &&
      unsafeElectricalGuidance.some((pattern) => pattern.test(message))
    ) {
      await audit({
        userId: viewer.id,
        task: parsed.data.task,
        requestId,
        model,
        status: "refused",
        latency: Date.now() - started,
        inputTokens: data.usage?.prompt_tokens,
        outputTokens: data.usage?.completion_tokens,
      });
      return NextResponse.json(
        {
          message: safeElectricalFallback(parsed.data.locale),
          citations,
          requestId,
          promptVersion: prompt.version,
          provider: "nvidia",
          model,
          degraded: true,
          safetyFiltered: true,
        },
        { headers: { "cache-control": "no-store", "x-request-id": requestId } },
      );
    }
    await audit({
      userId: viewer.id,
      task: parsed.data.task,
      requestId,
      model,
      status: "success",
      latency: Date.now() - started,
      inputTokens: data.usage?.prompt_tokens,
      outputTokens: data.usage?.completion_tokens,
    });
    return NextResponse.json(
      {
        message,
        citations,
        requestId,
        promptVersion: prompt.version,
        provider: "nvidia",
        model,
        failedOver,
        degraded: false,
      },
      { headers: { "cache-control": "no-store", "x-request-id": requestId } },
    );
  } catch (error) {
    if (error instanceof AuthError)
      return NextResponse.json(
        { error: error.message, requestId },
        { status: error.status },
      );
    const timedOut =
      error instanceof Error &&
      (error.name === "AbortError" || error.name === "TimeoutError");
    if (timedOut) {
      if (auditUserId)
        await audit({
          userId: auditUserId,
          task: fallbackTask,
          requestId,
          model,
          status: "failed",
          latency: Date.now() - started,
        });
      const message =
        fallbackTask === "interviewer"
          ? fallbackLocale === "hi"
            ? "Live AI feedback में अभी अधिक समय लग रहा है। अपने answer में exact safety step, measurement और उसके कारण को जोड़ें। यह fallback coaching है, hiring decision नहीं।"
            : "Live AI feedback is taking longer than expected. Add the exact safety step, measurement, and why it comes before the next action. This is fallback coaching, not a hiring decision."
          : fallbackLocale === "hi"
            ? "Live AI provider अभी धीमा है। Safe 20-minute fallback plan: 5 minutes approved lesson review करें, 10 minutes supervision में एक safety procedure practice करें, और 5 minutes में अपने checks लिखें।"
            : "The live AI provider is slower than expected. Safe 20-minute fallback: review an approved lesson for 5 minutes, practice one safety procedure under supervision for 10 minutes, then spend 5 minutes writing the checks you performed.";
      return NextResponse.json(
        { message, degraded: true, provider: "nvidia-timeout", requestId },
        { headers: { "cache-control": "no-store", "x-request-id": requestId } },
      );
    }
    if (auditUserId)
      await audit({
        userId: auditUserId,
        task: fallbackTask,
        requestId,
        model,
        status: "failed",
        latency: Date.now() - started,
      });
    return NextResponse.json(
      {
        error: "Unable to process AI request",
        requestId,
      },
      { status: 500 },
    );
  }
}
