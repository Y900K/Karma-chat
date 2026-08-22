import "server-only";
import {createHash} from "node:crypto";
import {createAdminClient} from "@/lib/supabase/admin";

type SubjectType="user"|"organization"|"ip";
export function requestIp(request:Request){return request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()||request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||"unknown"}
export async function consumeRateLimit(input:{subjectType:SubjectType;subject:string;action:string;limit:number;windowSeconds:number}){
  const secret=process.env.RATE_LIMIT_HASH_SECRET||process.env.CRON_SECRET;
  const admin=createAdminClient();
  if(!secret||!admin)return {allowed:true,configured:false};
  const subjectHash=createHash("sha256").update(`${secret}:${input.subject}`).digest("hex");
  const{data,error}=await admin.rpc("consume_rate_limit",{p_subject_type:input.subjectType,p_subject_hash:subjectHash,p_action:input.action,p_limit:input.limit,p_window_seconds:input.windowSeconds});
  // A rolling deploy may briefly run application code before the migration is
  // visible to PostgREST. Fail open only for a missing RPC, never for store errors.
  if(error?.code==="PGRST202")return {allowed:true,configured:false};
  if(error)throw new Error(`rate_limit_store:${error.code||"unknown"}`);
  return {allowed:data===true,configured:true};
}
