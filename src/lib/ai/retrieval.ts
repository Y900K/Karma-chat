import "server-only";
import {createEmbedding} from "./nvidia";
import {createClient} from "@/lib/supabase/server";
import {z} from "zod";

export type Citation={id:string;title:string;sourceUrl:string|null;reviewedAt:string|null};
export async function retrieveApprovedContext(query:string,signal?:AbortSignal){const sb=await createClient();if(!sb)return{context:"",citations:[] as Citation[]};try{const embedding=await createEmbedding(query,signal);const{data,error}=await sb.rpc("match_approved_content",{p_query_text:query,p_query_embedding:embedding,p_match_count:5});if(error)return{context:"",citations:[] as Citation[]};const rows=z.array(z.object({chunk_id:z.string(),title:z.string(),content:z.string(),source_url:z.string().nullable(),reviewed_at:z.string().nullable()})).parse(data);return{context:rows.map((row,index)=>`[S${index+1}] ${row.title}\n${row.content}`).join("\n\n"),citations:rows.map((row)=>({id:row.chunk_id,title:row.title,sourceUrl:row.source_url,reviewedAt:row.reviewed_at}))}}catch{return{context:"",citations:[] as Citation[]}}}
