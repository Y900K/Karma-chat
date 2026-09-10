import { NextRequest,NextResponse } from "next/server";
import { requirePersona,AuthError } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { workspaceRegistry,type PartnerScope } from "@/lib/workspace-registry";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function GET(request:NextRequest) {
  const headers={"cache-control":"private, no-store"};
  try {
    const params=request.nextUrl.searchParams,scope=params.get("scope") as PartnerScope;
    if(!Object.hasOwn(workspaceRegistry,scope))return NextResponse.json({error:"Invalid workspace"},{status:400,headers});
    const viewer=await requirePersona(scope,"admin"),sb=await createClient();
    if(!sb || viewer.demo)return NextResponse.json({error:"A connected account is required"},{status:503,headers});
    const config=workspaceRegistry[scope].find(s=>s.id===(params.get("section")||"overview"));
    if(!config)return NextResponse.json({error:"Unknown section"},{status:400,headers});
    let organizations:Array<{id:string;name:string;role:string}>=[];
    let organizationId:string|null=null;
    if(scope!=="admin") {
      const table=scope==="institute"?"organization_memberships":scope==="employer"?"employer_memberships":"program_memberships";
      const result=await sb.from(table).select("organization_id,role,organizations(name)").eq("user_id",viewer.id).eq("status","active").order("organization_id");
      if(result.error)throw result.error;
      organizations=(result.data??[]).map(row=>({id:row.organization_id,role:row.role,name:String((row.organizations as unknown as {name:string}|null)?.name||"Workspace")}));
      organizationId=params.get("organizationId")||organizations[0]?.id||null;
      if(!organizationId || !organizations.some(o=>o.id===organizationId))throw new AuthError("No active membership in this organization",403);
    }
    const key=config.table==="feature_flags"?"key":"id";
    // The registry, not request input, supplies the table and selected columns.
    // Avoid expanding every possible join into one exponential generated type.
    const recordsClient = sb as unknown as SupabaseClient;
    let query=recordsClient.from(String(config.table)).select(String(config.fields)).order(key).limit(26);
    if(config.org)query=query.eq(config.org,organizationId!);
    const cursor=params.get("cursor");
    if(cursor){if(!/^[a-zA-Z0-9_.-]{1,128}$/.test(cursor))throw new AuthError("Invalid cursor",400);query=query.gt(key,cursor);}
    const q=(params.get("q")||"").trim().slice(0,100);
    if(q&&config.search)query=query.ilike(config.search,`%${q.replace(/[%_\\]/g,"\\$&")}%`);
    const {data,error}=await query;
    if(error)throw error;
    const rows=(data??[]) as unknown as Array<Record<string,unknown>>,items=rows.slice(0,25);
    return NextResponse.json({items,organizations,organizationId,searchable:Boolean(config.search),nextCursor:rows.length>25?String(items.at(-1)?.[key]):null,refreshedAt:new Date().toISOString()},{headers});
  }catch(error){if(error instanceof AuthError)return NextResponse.json({error:error.message},{status:error.status,headers});console.error("Workspace read failed",{code:typeof error==="object"&&error&&"code" in error?error.code:"unknown"});return NextResponse.json({error:"Records could not be loaded. Please retry."},{status:503,headers});}
}
