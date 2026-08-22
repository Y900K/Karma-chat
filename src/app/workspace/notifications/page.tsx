import Link from "next/link";
import { Bell, Building2, DatabaseZap, ShieldCheck } from "lucide-react";
import { requirePagePersona, type Persona } from "@/lib/auth/dal";
import LiveDashboardStatus from "@/components/live-dashboard-status";
import "../workspace.css";

export const dynamic = "force-dynamic";
const homes: Record<Persona,string>={learner:"/dashboard",institute:"/institute",employer:"/employer",government:"/governance",admin:"/admin"};
const labels:Record<Persona,string>={learner:"Learner",institute:"Institute",employer:"Employer",government:"Government",admin:"Platform operations"};

export default async function WorkspaceNotifications(){
  const viewer=await requirePagePersona("learner","institute","employer","government","admin");
  const label=labels[viewer.persona];
  return <main className="workspace-page"><header><Link href={homes[viewer.persona]}><span>क</span>KarmaSetu <b>AI</b></Link></header><div className="workspace-body"><Link className="workspace-back" href={homes[viewer.persona]}>← Back to {label.toLowerCase()} workspace</Link><div className="workspace-title"><div><p>ROLE-SCOPED ACTIVITY</p><h1>{label} notifications</h1><span>Operational updates and review items for the current authenticated role.</span></div></div><LiveDashboardStatus scope={viewer.persona}/><section className="workspace-card"><h2>Current notification channels</h2><div className="workspace-list"><div className="workspace-item"><i><Bell/></i><p><b>In-app operational alerts</b><span>Generated from live role-scoped dashboard records.</span></p><em>Active</em></div><div className="workspace-item"><i><ShieldCheck/></i><p><b>Security and access notices</b><span>Critical account notices remain visible regardless of optional preferences.</span></p><em>Required</em></div><div className="workspace-item"><i>{viewer.persona==="admin"?<DatabaseZap/>:<Building2/>}</i><p><b>Workspace review queue</b><span>Open the relevant dashboard section to act on pending records.</span></p><em>Live</em></div></div></section></div></main>;
}
