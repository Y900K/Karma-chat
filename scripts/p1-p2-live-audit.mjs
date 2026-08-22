import {createClient} from '@supabase/supabase-js';
import {createHash,randomUUID} from 'node:crypto';

if(!process.argv.includes('--confirm'))throw new Error('Use --confirm only against the intended KarmaSetu project');
const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url||!key)throw new Error('Supabase service configuration is missing');
const sb=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}}),tag=`scale-audit-${Date.now()}`,worker=`audit-${randomUUID()}`;
const state={orgId:null,clientId:null,outboxId:null,rateHash:createHash('sha256').update(tag).digest('hex')};
const checks=[];const pass=(name,detail={})=>checks.push({name,ok:true,...detail});
const must=(result,label)=>{if(result.error)throw new Error(`${label}: ${result.error.code||''} ${result.error.message}`);return result.data};
try{
  const metrics=must(await sb.from('metric_definitions').select('metric_key,version').eq('status','active'),'metric definitions');if(metrics.length<3)throw new Error('active metric definitions missing');pass('versioned metrics',{count:metrics.length});
  const regions=must(await sb.from('regions').select('code').in('code',['IN','IN-UK','IN-MH','IN-KA']),'regions');if(regions.length!==4)throw new Error('regional hierarchy incomplete');pass('regional hierarchy',{count:regions.length});
  const rate=[];for(let i=0;i<3;i++){const result=await sb.rpc('consume_rate_limit',{p_subject_type:'ip',p_subject_hash:state.rateHash,p_action:tag,p_limit:2,p_window_seconds:60});rate.push(must(result,'rate limit'))}if(JSON.stringify(rate)!==JSON.stringify([true,true,false]))throw new Error(`rate limit sequence ${JSON.stringify(rate)}`);pass('atomic rate limit',{sequence:rate});
  const invalid=await sb.from('external_resources').insert({provider:'youtube',external_id:tag,title_en:'Invalid scale audit',language:'en',owner_name:'Audit',embed_url:'https://www.youtube-nocookie.com/embed/audit',permission_status:'valid',review_status:'approved'});if(!invalid.error)throw new Error('content gate accepted incomplete approval');pass('content approval gate',{code:invalid.error.code});
  state.orgId=must(await sb.from('organizations').insert({name:tag,organization_type:'government',verification_status:'verified'}).select('id').single(),'organization').id;
  must(await sb.from('aggregate_metric_snapshots').insert([{program_organization_id:state.orgId,geography_level:'state',geography_code:'IN-UK',metric_key:tag,metric_value:50,cohort_size:9,period_start:'2026-08-01',period_end:'2026-08-31'},{program_organization_id:state.orgId,geography_level:'state',geography_code:'IN-MH',metric_key:tag,metric_value:60,cohort_size:10,period_start:'2026-08-01',period_end:'2026-08-31'}]),'aggregates');
  const visible=must(await sb.from('government_metric_rollups').select('geography_code,cohort_size').eq('program_organization_id',state.orgId),'suppressed view');if(visible.length!==1||visible[0].cohort_size!==10)throw new Error(`suppression failed ${JSON.stringify(visible)}`);pass('SQL minimum-group suppression',{visible:visible.length});
  state.clientId=must(await sb.from('integration_clients').insert({organization_id:state.orgId,name:tag,client_type:'webhook',scopes:['application.submitted']}).select('id').single(),'integration client').id;
  must(await sb.from('webhook_subscriptions').insert({integration_client_id:state.clientId,event_type:'application.submitted',endpoint_url:'https://example.invalid/karmasetu'}),'webhook subscription');
  state.outboxId=must(await sb.from('transactional_outbox').insert({aggregate_type:'audit',aggregate_id:tag,event_type:'application.submitted',payload:{audit:true}}).select('id').single(),'outbox fixture').id;
  const claimed=must(await sb.rpc('claim_outbox_events',{p_worker:worker,p_limit:10}),'claim outbox');if(!claimed.some(x=>x.id===state.outboxId))throw new Error('fixture outbox not claimed');
  const first=must(await sb.rpc('enqueue_event_webhooks',{p_event_id:state.outboxId}),'webhook fanout'),second=must(await sb.rpc('enqueue_event_webhooks',{p_event_id:state.outboxId}),'webhook replay');if(first!==1||second!==0)throw new Error(`webhook idempotency failed ${first}/${second}`);pass('idempotent webhook fanout',{first,second});
  const done=must(await sb.rpc('complete_outbox_event',{p_event_id:state.outboxId,p_worker:worker,p_result:{audit:true}}),'complete outbox');if(done!==true)throw new Error('outbox completion failed');const row=must(await sb.from('transactional_outbox').select('status,attempt_count').eq('id',state.outboxId).single(),'outbox state');if(row.status!=='completed'||row.attempt_count!==1)throw new Error('outbox state invalid');pass('leased outbox completion',row);
  console.log(JSON.stringify({ok:true,project:new URL(url).hostname.split('.')[0],checks},null,2));
}finally{
  if(state.outboxId)await sb.from('transactional_outbox').delete().eq('id',state.outboxId);
  if(state.clientId)await sb.from('integration_clients').delete().eq('id',state.clientId);
  if(state.orgId){await sb.from('aggregate_metric_snapshots').delete().eq('program_organization_id',state.orgId);await sb.from('organizations').delete().eq('id',state.orgId)}
  await sb.from('rate_limit_buckets').delete().eq('subject_hash',state.rateHash).eq('action',tag);
  await sb.from('external_resources').delete().eq('external_id',tag);
}

