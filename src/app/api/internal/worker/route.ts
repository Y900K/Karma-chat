import {NextRequest,NextResponse} from "next/server";
import {processBackgroundJobs,processOutbox,processWebhooks} from "@/lib/operations/worker";
import {recordOperationalError,requestId,safeError} from "@/lib/observability";

export const maxDuration=60;
function authorized(request:NextRequest){const secret=process.env.CRON_SECRET;return Boolean(secret&&request.headers.get("authorization")===`Bearer ${secret}`)}
export async function GET(request:NextRequest){
  const id=requestId(request);if(!authorized(request))return NextResponse.json({error:"Unauthorized",requestId:id},{status:401,headers:{"x-request-id":id}});
  const worker=`vercel-${id}`;
  try{
    const[outbox,webhooks,background]=await Promise.all([processOutbox(worker,25),processWebhooks(worker,25),processBackgroundJobs(worker,3)]);
    return NextResponse.json({ok:true,outbox,webhooks,background,ranAt:new Date().toISOString(),requestId:id},{headers:{"cache-control":"no-store","x-request-id":id}});
  }catch(error){await recordOperationalError({service:"worker",code:"worker_run_failed",route:"/api/internal/worker",requestId:id,severity:"critical",metadata:{message:safeError(error)}});return NextResponse.json({error:"Worker run failed",requestId:id},{status:500,headers:{"x-request-id":id}})}
}

