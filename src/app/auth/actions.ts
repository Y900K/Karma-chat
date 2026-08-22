"use server";

import {z} from "zod";
import {createClient} from "@/lib/supabase/server";

const credentialsSchema=z.object({email:z.string().trim().email().max(320),password:z.string().min(6).max(256)}).strict();
const destinations:Record<string,string>={learner:"/dashboard",institute:"/institute",employer:"/employer",government:"/governance",admin:"/admin"};

export async function signInForNavigation(input:unknown){
  const parsed=credentialsSchema.safeParse(input);
  if(!parsed.success)return{ok:false as const,error:"Enter a valid email address and password."};
  const supabase=await createClient();
  if(!supabase)return{ok:false as const,error:"Authentication service is unavailable."};
  const{data,error}=await supabase.auth.signInWithPassword(parsed.data);
  if(error||!data.user)return{ok:false as const,error:"Email or password is incorrect."};
  const{data:account,error:accountError}=await supabase.from("user_accounts").select("persona,status").eq("user_id",data.user.id).single();
  if(accountError||!account){await supabase.auth.signOut({scope:"local"});return{ok:false as const,error:"Your account role could not be verified."}}
  if(account.status!=="active"){await supabase.auth.signOut({scope:"local"});return{ok:false as const,error:"This account is not active."}}
  return{ok:true as const,destination:destinations[account.persona]||"/dashboard"};
}

