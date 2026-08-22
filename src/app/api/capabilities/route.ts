import { NextResponse } from "next/server";
import { requireViewer } from "@/lib/auth/dal";

export async function GET() {
  await requireViewer();
  return NextResponse.json({
    evidenceUploads: false,
    evidenceReason: "Evidence upload is paused for the external pilot until server-side quarantine, malware scanning, metadata stripping and transcoding are connected.",
  }, { headers: { "cache-control": "private, no-store" } });
}
