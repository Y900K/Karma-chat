import Link from "next/link";
import { Building2, Languages, LockKeyhole, ShieldCheck } from "lucide-react";
import { requirePagePersona, type Persona } from "@/lib/auth/dal";
import "../workspace.css";

export const dynamic = "force-dynamic";
const homes: Record<Persona,string>={learner:"/dashboard",institute:"/institute",employer:"/employer",government:"/governance",admin:"/admin"};
const labels:Record<Persona,string>={learner:"Learner",institute:"Institute",employer:"Employer",government:"Government program",admin:"Platform operations"};

export default async function WorkspaceSettings(){
  const viewer=await requirePagePersona("learner","institute","employer","government","admin");
  return <main className="workspace-page"><header><Link href={homes[viewer.persona]}><span>क</span>KarmaSetu <b>AI</b></Link><form action="/auth/signout" method="post"><button type="submit">Sign out</button></form></header><div className="workspace-body"><Link className="workspace-back" href={homes[viewer.persona]}>← Back to workspace</Link><div className="workspace-title"><div><p>ACCOUNT & WORKSPACE</p><h1>{labels[viewer.persona]} settings</h1><span>Verified identity, access scope and language controls for this workspace.</span></div></div><div className="workspace-grid"><section className="workspace-card"><h2>Authenticated account</h2><label className="workspace-field">Email<span>{viewer.email??"Verified account"}</span></label><label className="workspace-field">Role<span>{viewer.persona}</span></label><div className="workspace-note"><LockKeyhole/>Role changes require a verified invitation or platform administrator review.</div></section><section className="workspace-card"><h2>Workspace controls</h2><div className="workspace-list"><div className="workspace-item"><i><Building2/></i><p><b>Organization access</b><span>Only active memberships approved for this account are available.</span></p><em>Verified</em></div><div className="workspace-item"><i><Languages/></i><p><b>English + हिंदी</b><span>Use the workspace header toggle to change bilingual operational copy.</span></p><em>Enabled</em></div><div className="workspace-item"><i><ShieldCheck/></i><p><b>Audit protection</b><span>Access and data reads remain protected by Supabase RLS.</span></p><em>Active</em></div></div></section></div><div className="workspace-actions"><Link href={homes[viewer.persona]}>Return to dashboard</Link><Link className="secondary" href="/trust">Open Trust Center</Link></div></div></main>;
}
