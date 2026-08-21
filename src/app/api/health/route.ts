import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";

export async function GET(){const sb=await createClient();if(!sb)return NextResponse.json({status:"degraded",service:"karmasetu-web",database:"not_configured",timestamp:new Date().toISOString()},{status:503,headers:{"cache-control":"no-store"}});const{error}=await sb.from("learning_lessons").select("id",{head:true,count:"exact"}).eq("status","published");return NextResponse.json({status:error?"degraded":"ok",service:"karmasetu-web",database:error?"unavailable":"ok",timestamp:new Date().toISOString()},{status:error?503:200,headers:{"cache-control":"no-store"}})}
