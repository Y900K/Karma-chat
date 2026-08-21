import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET(request:Request){const url=new URL(request.url),code=url.searchParams.get("code"),next=url.searchParams.get("next")||"/dashboard";if(code){const sb=await createClient();const{error}=sb?await sb.auth.exchangeCodeForSession(code):{error:new Error("Supabase is not configured")};if(!error)return NextResponse.redirect(new URL(next.startsWith("/")?next:"/dashboard",url.origin))}return NextResponse.redirect(new URL("/auth?error=verification",url.origin))}
