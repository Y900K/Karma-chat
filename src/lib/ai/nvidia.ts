import "server-only";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};
const endpoint = "https://integrate.api.nvidia.com/v1";
export const DEFAULT_INTERACTIVE_MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b";
export function interactiveModel(configured = process.env.NVIDIA_INTERACTIVE_MODEL) {
  // NVIDIA retired this previously deployed model on 2026-08-26. Resolve old
  // deployment settings as well as unset values to the verified replacement.
  return !configured || configured === "meta/llama-3.1-8b-instruct"
    ? DEFAULT_INTERACTIVE_MODEL
    : configured;
}
function apiKey() {
  const key = process.env.NVIDIA_API_KEY;
  if (!key) throw new Error("AI service is not configured");
  return key;
}

export async function createEmbedding(text: string, signal?: AbortSignal) {
  const response = await fetch(`${endpoint}/embeddings`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey()}`,
    },
    signal,
    body: JSON.stringify({
      model: process.env.NVIDIA_EMBEDDING_MODEL || "nvidia/nv-embedqa-e5-v5",
      input: [text.slice(0, 8000)],
      input_type: "query",
      encoding_format: "float",
      truncate: "END",
    }),
  });
  if (!response.ok)
    throw new Error(`Embedding provider failed: ${response.status}`);
  const data = await response.json();
  const embedding = data.data?.[0]?.embedding;
  if (!Array.isArray(embedding))
    throw new Error("Embedding provider returned no vector");
  return embedding as number[];
}

async function requestChat(input: {
  messages: ChatMessage[];
  requestId: string;
  signal: AbortSignal;
  model: string;
  timeoutMs: number;
}) {
  const signal = AbortSignal.any([
    input.signal,
    AbortSignal.timeout(input.timeoutMs),
  ]);
  return fetch(`${endpoint}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey()}`,
      "x-request-id": input.requestId,
    },
    signal,
    body: JSON.stringify({
      model: input.model,
      messages: input.messages,
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 300,
      stream: false,
      ...(input.model.startsWith("nvidia/nemotron-3.5-")
        ? { chat_template_kwargs: { enable_thinking: false } }
        : {}),
    }),
  });
}

export async function createChatCompletion(input: {
  messages: ChatMessage[];
  requestId: string;
  signal: AbortSignal;
}) {
  // Interactive coaching must return inside a human conversation turn. Keep it
  // independent from larger background models used for offline evaluation.
  const primary = interactiveModel();
  const fallback = interactiveModel(process.env.NVIDIA_FALLBACK_MODEL);
  try {
    const response = await requestChat({
      ...input,
      model: primary,
      timeoutMs: 15_000,
    });
    if (
      response.ok ||
      primary === fallback ||
      ![404, 410, 429, 500, 502, 503, 504].includes(response.status)
    )
      return { response, model: primary, failedOver: false };
  } catch (error) {
    if (input.signal.aborted || primary === fallback) throw error;
  }
  const response = await requestChat({
    ...input,
    model: fallback,
    timeoutMs: 9_000,
  });
  return { response, model: fallback, failedOver: true };
}
