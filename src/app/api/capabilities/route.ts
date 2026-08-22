import { NextResponse } from "next/server";
import { AuthError, requireViewer } from "@/lib/auth/dal";

export async function GET() {
  try {
    await requireViewer();
    return NextResponse.json({
      evidenceUploads: false,
      evidenceReason: "Evidence upload is paused for the external pilot until server-side quarantine, malware scanning, metadata stripping and transcoding are connected.",
    }, { headers: { "cache-control": "private, no-store" } });
  } catch(error) {
    if(error instanceof AuthError)return NextResponse.json({error:error.message},{status:error.status,headers:{"cache-control":"no-store"}});
    return NextResponse.json({error:"Unable to read capabilities"},{status:500});
  }
}
