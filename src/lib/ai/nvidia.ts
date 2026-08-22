import "server-only";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};
const endpoint = "https://integrate.api.nvidia.com/v1";
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
      max_tokens: 420,
      stream: false,
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
  const primary =
    process.env.NVIDIA_INTERACTIVE_MODEL || "meta/llama-3.1-8b-instruct";
  const fallback =
    process.env.NVIDIA_FALLBACK_MODEL || "meta/llama-3.1-8b-instruct";
  try {
    const response = await requestChat({
      ...input,
      model: primary,
      timeoutMs: 9_000,
    });
    if (
      response.ok ||
      primary === fallback ||
      ![429, 500, 502, 503, 504].includes(response.status)
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
