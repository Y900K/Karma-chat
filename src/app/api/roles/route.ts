import {NextRequest,NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {requireViewer,AuthError} from "@/lib/auth/dal";
import {z} from "zod";
import {readBoundedJson} from "@/lib/bounded-json";
const headers={"cache-control":"private, no-store"};
export async function GET(request:NextRequest){
  try{
    const sb=await createClient();if(!sb)return NextResponse.json({items:[],savedSlugs:[],nextCursor:null},{headers});
    const p=request.nextUrl.searchParams,q=(p.get("q")||"").slice(0,100),cursor=p.get("cursor");
    let query=sb.from("occupation_roles").select("slug,title_en,title_hi,sector,description_en,description_hi,tasks,skill_requirements,wage_min,wage_max,currency,updated_at").eq("status","published").order("slug").limit(26);
    if(q)query=query.ilike("title_en",`%${q.replace(/[%_\\]/g,"\\$&")}%`);
    if(cursor){if(!/^[a-z0-9-]{1,120}$/.test(cursor))return NextResponse.json({error:"Invalid cursor"},{status:400,headers});query=query.gt("slug",cursor);}
    const {data,error}=await query;if(error)throw error;
    const items=(data||[]).slice(0,25),{data:{user}}=await sb.auth.getUser();
    let savedSlugs:string[]=[];
    if(user&&items.length){const saved=await sb.from("saved_roles").select("role_slug").eq("user_id",user.id).in("role_slug",items.map(r=>r.slug));if(saved.error)throw saved.error;savedSlugs=(saved.data||[]).map(r=>r.role_slug);}
    return NextResponse.json({items,savedSlugs,nextCursor:(data||[]).length>25?items.at(-1)?.slug:null},{headers});
  }catch{return NextResponse.json({error:"The approved role registry is temporarily unavailable"},{status:503,headers});}
}
async function save(request:NextRequest,remove:boolean){try{
  const viewer=await requireViewer();if(viewer.demo)throw new AuthError("Sign in to save roles",401);
  const body=await readBoundedJson(request,2048);if(!body.ok)return NextResponse.json({error:body.error},{status:body.status,headers});
  const parsed=z.object({slug:z.string().regex(/^[a-z0-9-]{1,120}$/)}).strict().safeParse(body.value);if(!parsed.success)return NextResponse.json({error:"Invalid role"},{status:400,headers});
  const sb=await createClient();if(!sb)throw Error("Unavailable");
  const {data:role,error:roleError}=await sb.from("occupation_roles").select("slug").eq("slug",parsed.data.slug).eq("status","published").maybeSingle();if(roleError)throw roleError;if(!role)return NextResponse.json({error:"Role is not published"},{status:404,headers});
  const result=remove?await sb.from("saved_roles").delete().eq("user_id",viewer.id).eq("role_slug",role.slug):await sb.from("saved_roles").upsert({user_id:viewer.id,role_slug:role.slug});if(result.error)throw result.error;
  return NextResponse.json({saved:!remove},{headers});
}catch(e){return NextResponse.json({error:e instanceof AuthError?e.message:"Unable to save role"},{status:e instanceof AuthError?e.status:503,headers});}}
export const POST=(request:NextRequest)=>save(request,false);
export const DELETE=(request:NextRequest)=>save(request,true);
