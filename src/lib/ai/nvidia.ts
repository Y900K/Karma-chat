import "server-only";

export type ChatMessage={role:"system"|"user"|"assistant";content:string};
const endpoint="https://integrate.api.nvidia.com/v1";
function apiKey(){const key=process.env.NVIDIA_API_KEY;if(!key)throw new Error("AI service is not configured");return key}

export async function createEmbedding(text:string,signal?:AbortSignal){const response=await fetch(`${endpoint}/embeddings`,{method:"POST",headers:{"content-type":"application/json",authorization:`Bearer ${apiKey()}`},signal,body:JSON.stringify({model:process.env.NVIDIA_EMBEDDING_MODEL||"nvidia/nv-embedqa-e5-v5",input:[text.slice(0,8000)],input_type:"query",encoding_format:"float",truncate:"END"})});if(!response.ok)throw new Error(`Embedding provider failed: ${response.status}`);const data=await response.json();const embedding=data.data?.[0]?.embedding;if(!Array.isArray(embedding))throw new Error("Embedding provider returned no vector");return embedding as number[]}

export async function createChatCompletion(input:{messages:ChatMessage[];requestId:string;signal:AbortSignal}){const model=process.env.NVIDIA_MODEL||"meta/llama-3.3-70b-instruct";const response=await fetch(`${endpoint}/chat/completions`,{method:"POST",headers:{"content-type":"application/json",authorization:`Bearer ${apiKey()}`,"x-request-id":input.requestId},signal:input.signal,body:JSON.stringify({model,messages:input.messages,temperature:.25,max_tokens:700})});return{response,model}}
