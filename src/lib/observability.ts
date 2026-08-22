import "server-only";
import {createAdminClient} from "@/lib/supabase/admin";
import type {Json} from "@/lib/supabase/database.types";

export function requestId(request:Request){const supplied=request.headers.get("x-request-id");return supplied&&/^[a-zA-Z0-9._:-]{8,100}$/.test(supplied)?supplied:crypto.randomUUID()}
export async function recordOperationalError(input:{service:string;code:string;route:string;requestId:string;severity?:"info"|"warning"|"error"|"critical";metadata?:Json}){
  const admin=createAdminClient();if(!admin)return;
  await admin.from("operational_errors").insert({service:input.service,error_code:input.code,route:input.route,severity:input.severity||"error",request_id:input.requestId,metadata:input.metadata||{}});
}
export function safeError(error:unknown){return error instanceof Error?error.message.slice(0,500):"unknown_error"}
