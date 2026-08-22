const required=['NEXT_PUBLIC_SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY'];
const missing=required.filter(key=>!process.env[key]);if(missing.length){console.error(`Missing: ${missing.join(', ')}`);process.exit(1)}
const url=new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);const project=url.hostname.split('.')[0];
const expected=process.env.RECOVERY_STAGING_PROJECT_REF;
if(!expected||project!==expected){console.error('Recovery drill refused: set RECOVERY_STAGING_PROJECT_REF to a non-production Supabase project.');process.exit(2)}
const headers={apikey:process.env.SUPABASE_SERVICE_ROLE_KEY,Authorization:`Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`};
const checks=['user_accounts?select=user_id&limit=1','transactional_outbox?select=id,status&limit=1','audit_events?select=id,created_at&limit=1'];
for(const path of checks){const response=await fetch(`${url.origin}/rest/v1/${path}`,{headers});if(!response.ok)throw new Error(`${path}: HTTP ${response.status}`)}
console.log(JSON.stringify({ok:true,project,scope:'read-only restore validation prerequisites',checkedAt:new Date().toISOString()},null,2));

