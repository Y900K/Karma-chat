import {NextResponse} from "next/server";
import {z} from "zod";
import {createClient} from "@/lib/supabase/server";
import {consumeRateLimit,requestIp} from "@/lib/rate-limit";

const schema=z.object({id:z.string().max(200),name:z.enum(["CLS","FCP","FID","INP","LCP","TTFB"]),value:z.number().finite().nonnegative(),rating:z.enum(["good","needs-improvement","poor"]),path:z.string().max(200),navigationType:z.string().max(50).optional()}).strict();
export async function POST(request:Request){if(Number(request.headers.get("content-length")||0)>4096)return new NextResponse(null,{status:413});const limit=await consumeRateLimit({subjectType:"ip",subject:requestIp(request),action:"web_vital",limit:120,windowSeconds:60});if(!limit.allowed)return new NextResponse(null,{status:429});const parsed=schema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return new NextResponse(null,{status:400});const sb=await createClient();if(sb){const{data:{user}}=await sb.auth.getUser();await sb.from("web_vital_samples").insert({user_id:user?.id||null,metric_id:parsed.data.id,metric_name:parsed.data.name,metric_value:parsed.data.value,rating:parsed.data.rating,path:parsed.data.path,navigation_type:parsed.data.navigationType||null})}return new NextResponse(null,{status:202})}
