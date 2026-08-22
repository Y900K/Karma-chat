import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, requireViewer } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";

const inputSchema=z.object({language:z.enum(["en","hi"])}).strict();
const headers={"cache-control":"private, no-store"};

export async function GET(){
  try{
    const viewer=await requireViewer();
    if(viewer.demo)return NextResponse.json({language:"en"},{headers});
    const supabase=await createClient();
    if(!supabase)return NextResponse.json({error:"Preferences are unavailable"},{status:503,headers});
    const{data,error}=await supabase.from("user_accounts").select("preferred_language").eq("user_id",viewer.id).single();
    if(error)throw error;
    return NextResponse.json({language:data.preferred_language??"en"},{headers});
  }catch(error){
    if(error instanceof AuthError)return NextResponse.json({error:error.message},{status:error.status,headers});
    return NextResponse.json({error:"Preferences could not be loaded"},{status:503,headers});
  }
}

export async function PATCH(request:NextRequest){
  try{
    const viewer=await requireViewer();
    const input=inputSchema.parse(await request.json());
    if(viewer.demo)return NextResponse.json({ok:true,language:input.language},{headers});
    const supabase=await createClient();
    if(!supabase)return NextResponse.json({error:"Preferences are unavailable"},{status:503,headers});
    const account=await supabase.from("user_accounts").select("display_name").eq("user_id",viewer.id).single();
    if(account.error)throw account.error;
    const displayName=account.data.display_name?.trim()||viewer.email?.split("@")[0]||"KarmaSetu user";
    const{error}=await supabase.rpc("update_own_account_profile",{p_display_name:displayName,p_preferred_language:input.language});
    if(error)throw error;
    return NextResponse.json({ok:true,language:input.language},{headers});
  }catch(error){
    if(error instanceof z.ZodError)return NextResponse.json({error:"Invalid language preference"},{status:400,headers});
    if(error instanceof AuthError)return NextResponse.json({error:error.message},{status:error.status,headers});
    return NextResponse.json({error:"Preference could not be saved"},{status:503,headers});
  }
}
