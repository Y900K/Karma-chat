import "server-only";
import {createHmac} from "node:crypto";
import {createAdminClient} from "@/lib/supabase/admin";
import {createChatCompletion} from "@/lib/ai/nvidia";
import {safeError} from "@/lib/observability";
import {z} from "zod";

const outboxEvents=z.array(z.object({id:z.number(),event_type:z.string(),payload:z.record(z.string(),z.unknown())}));
const webhookDeliveries=z.array(z.object({id:z.number(),event_type:z.string(),payload:z.record(z.string(),z.unknown()),endpoint_url:z.string().url(),idempotency_key:z.string().nullable()}));
const backgroundJobs=z.array(z.object({id:z.number(),job_type:z.string(),payload:z.record(z.string(),z.unknown())}));

export async function processOutbox(worker:string,limit=25){
  const admin=createAdminClient();if(!admin)throw new Error("service_role_not_configured");
  const{data,error}=await admin.rpc("claim_outbox_events",{p_worker:worker,p_limit:limit});if(error)throw error;const events=outboxEvents.parse(data);
  let completed=0,failed=0;
  for(const event of events){
    try{
      const routed=await admin.rpc("enqueue_event_webhooks",{p_event_id:event.id});if(routed.error)throw routed.error;
      const consumed=await admin.from("outbox_consumptions").upsert({event_id:event.id,consumer_key:"integration-fanout-v1",status:"completed",result:{webhooks:routed.data||0},completed_at:new Date().toISOString()});if(consumed.error)throw consumed.error;
      const done=await admin.rpc("complete_outbox_event",{p_event_id:event.id,p_worker:worker,p_result:{consumer:"integration-fanout-v1",webhooks:routed.data||0}});if(done.error||done.data!==true)throw done.error||new Error("outbox_lease_lost");completed++;
    }catch(cause){await admin.rpc("fail_outbox_event",{p_event_id:event.id,p_worker:worker,p_error:safeError(cause)});failed++}
  }
  return {claimed:events.length,completed,failed};
}

export async function processWebhooks(worker:string,limit=25){
  const admin=createAdminClient();if(!admin)throw new Error("service_role_not_configured");
  const signingSecret=process.env.WEBHOOK_SIGNING_SECRET;if(!signingSecret)return {claimed:0,delivered:0,failed:0,configured:false};
  const{data,error}=await admin.rpc("claim_webhook_deliveries",{p_worker:worker,p_limit:limit});if(error)throw error;const deliveries=webhookDeliveries.parse(data);
  let delivered=0,failed=0;
  for(const item of deliveries){
    const body=JSON.stringify({id:item.id,type:item.event_type,createdAt:new Date().toISOString(),data:item.payload});
    const signature=createHmac("sha256",signingSecret).update(body).digest("hex");
    try{
      const response=await fetch(item.endpoint_url,{method:"POST",headers:{"content-type":"application/json","user-agent":"KarmaSetu-Webhooks/1.0","x-karmasetu-signature":`sha256=${signature}`,"idempotency-key":item.idempotency_key||`delivery:${item.id}`},body,redirect:"error",signal:AbortSignal.timeout(8000)});
      const ok=response.ok;await admin.rpc("finish_webhook_delivery",{p_delivery_id:item.id,p_worker:worker,p_success:ok,p_response_code:response.status,p_error:ok?null:`HTTP ${response.status}`});if(ok)delivered++;else failed++;
    }catch(cause){await admin.rpc("finish_webhook_delivery",{p_delivery_id:item.id,p_worker:worker,p_success:false,p_response_code:0,p_error:safeError(cause)});failed++}
  }
  return {claimed:deliveries.length,delivered,failed,configured:true};
}

export async function processBackgroundJobs(worker:string,limit=5){
  const admin=createAdminClient();if(!admin)throw new Error("service_role_not_configured");
  if(!process.env.NVIDIA_API_KEY)return {claimed:0,completed:0,failed:0,configured:false};
  const{data,error}=await admin.rpc("claim_background_jobs",{p_worker:worker,p_limit:limit});if(error)throw error;const jobs=backgroundJobs.parse(data);
  let completed=0,failed=0;
  for(const job of jobs){
    try{
      if(job.job_type!=="interview_analysis")throw new Error(`unsupported_job_type:${job.job_type}`);
      const transcript=String(job.payload.transcript||"").slice(0,12000);if(transcript.length<20)throw new Error("transcript_required");
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20_000);
      let response:Response,model:string;
      try{const completion=await createChatCompletion({requestId:`job-${job.id}`,signal:controller.signal,messages:[{role:"system",content:"Analyze this practice interview only for job-related clarity, technical evidence, safety, and next practice actions. Never make a hiring decision, infer protected traits, or invent facts. Return concise JSON with strengths, improvements, and disclaimer."},{role:"user",content:transcript}]});response=completion.response;model=completion.model}finally{clearTimeout(timer)}
      if(!response.ok)throw new Error(`provider_http_${response.status}`);const json=await response.json();const content=String(json.choices?.[0]?.message?.content||"").slice(0,16000);if(!content)throw new Error("empty_analysis");
      const done=await admin.rpc("finish_background_job",{p_job_id:job.id,p_worker:worker,p_success:true,p_result:{content,model},p_error:null});if(done.error)throw done.error;completed++;
    }catch(cause){await admin.rpc("finish_background_job",{p_job_id:job.id,p_worker:worker,p_success:false,p_result:null,p_error:safeError(cause)});failed++}
  }
  return {claimed:jobs.length,completed,failed,configured:true};
}
