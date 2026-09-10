"use client";
import {useCallback,useEffect,useState} from "react";
import Link from "next/link";
import {Bell,Settings,LayoutDashboard,Languages,RefreshCw} from "lucide-react";
import {workspaceRegistry,type PartnerScope} from "@/lib/workspace-registry";
import {WorkspaceSectionLink,WorkspaceMobileNav,WorkspaceSignOut,useWorkspaceLanguage} from "./workspace-utilities";
import LiveDashboardStatus from "./live-dashboard-status";
import "./role-workspace.css";

type Payload={items:Record<string,unknown>[];organizations:{id:string;name:string;role:string}[];organizationId:string|null;nextCursor:string|null;searchable:boolean;refreshedAt:string};
function display(value:unknown):string {
  if(value===null||value===undefined)return "—";
  if(typeof value==="boolean")return value?"Enabled":"Disabled";
  if(typeof value==="object")return Object.entries(value).filter(([key])=>key!=="organization_id").map(([key,v])=>`${key.replaceAll("_"," ")}: ${display(v)}`).join(" · ");
  return String(value);
}
export default function RoleWorkspace({scope}:{scope:PartnerScope}){
  const sections=workspaceRegistry[scope],{lang,toggleLanguage}=useWorkspaceLanguage();
  const [section,setSection]=useState("overview"),[organizationId,setOrganizationId]=useState(""),[q,setQ]=useState(""),[search,setSearch]=useState(""),[cursor,setCursor]=useState(""),[history,setHistory]=useState<string[]>([]);
  const [payload,setPayload]=useState<Payload|null>(null),[error,setError]=useState(""),[loading,setLoading]=useState(true),[revision,setRevision]=useState(0);
  const current=sections.find(s=>s.id===section)||sections[0];
  useEffect(()=>{
    const update=()=>{const id=location.hash.replace(`#${scope}-`,"");setSection(sections.some(s=>s.id===id)?id:"overview");setCursor("");setHistory([]);setSearch("");setQ("");};
    const start=setTimeout(()=>{setOrganizationId(new URLSearchParams(location.search).get("organizationId")||"");update();},0);window.addEventListener("hashchange",update);return()=>{clearTimeout(start);window.removeEventListener("hashchange",update);};
  },[scope,sections]);
  useEffect(()=>{
    const controller=new AbortController();const start=setTimeout(()=>{setLoading(true);setError("");setPayload(null);
    const params=new URLSearchParams({scope,section:current.id,q:search,cursor});if(organizationId)params.set("organizationId",organizationId);
    void fetch(`/api/workspace?${params}`,{signal:controller.signal,cache:"no-store"}).then(async r=>{const body=await r.json();if(!r.ok)throw Error(body.error);return body as Payload;}).then(setPayload).catch(e=>{if(e.name!=="AbortError")setError(e.message);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    },0);return()=>{clearTimeout(start);controller.abort();};
  },[scope,current.id,organizationId,search,cursor,revision]);
  const refresh=useCallback(()=>setRevision(v=>v+1),[]);
  useEffect(()=>{const timer=setInterval(()=>{if(document.visibilityState==="visible")refresh();},60000);return()=>clearInterval(timer);},[refresh]);
  const links=sections.map(s=>({href:`#${scope}-${s.id}`,label:s.label}));
  const name=payload?.organizations.find(o=>o.id===payload.organizationId)?.name||`${scope[0].toUpperCase()}${scope.slice(1)} workspace`;
  const columns=payload?.items[0]?Object.keys(payload.items[0]).filter(k=>k!=="id"&&k!=="organization_id"):[];
  const exportPage=()=>{if(!payload)return;const blob=new Blob([JSON.stringify({scope,section:current.id,organizationId:payload.organizationId,refreshedAt:payload.refreshedAt,records:payload.items},null,2)],{type:"application/json"});const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`${scope}-${current.id}-page.json`;a.click();URL.revokeObjectURL(url);};
  return <main className="live-workspace">
    <aside><Link className="live-brand" href="/">क KarmaSetu <b>AI</b></Link><p>{name}</p><nav aria-label="Workspace sidebar">{links.map((link,i)=><WorkspaceSectionLink key={link.href} href={link.href} overview={i===0}><LayoutDashboard size={18}/>{link.label}</WorkspaceSectionLink>)}</nav><Link href="/workspace/settings">Workspace settings</Link><WorkspaceSignOut/></aside>
    <div className="live-workspace-main"><header><b>{name}</b><button onClick={toggleLanguage}><Languages size={18}/>{lang==="en"?"हिंदी + EN":"English"}</button><Link href="/workspace/notifications" aria-label={`${scope} notifications`}><Bell/></Link><Link href="/workspace/settings" aria-label={`${scope} account settings`}><Settings/></Link></header>
    <div className="live-workspace-content"><WorkspaceMobileNav sections={links}/>
      <h1>{lang==="hi"?"आपका workspace":name}</h1>
      {payload&&payload.organizations.length>1?<label>Organization<select value={organizationId||payload.organizationId||""} onChange={e=>{setOrganizationId(e.target.value);setCursor("");setHistory([]);const url=new URL(location.href);url.searchParams.set("organizationId",e.target.value);window.history.replaceState(null,"",url);}}>{payload.organizations.map(o=><option key={o.id} value={o.id}>{o.name} · {o.role}</option>)}</select></label>:null}
      <LiveDashboardStatus key={organizationId} scope={scope} organizationId={organizationId||undefined}/>
      <section id={`${scope}-${current.id}`} className="live-records" aria-label={current.label}><div className="live-records-head"><div><h2>{current.label}</h2><p>{lang==="hi"?"आपके authorized records · हर minute refresh":"Authorized records · refreshes every minute"}</p></div><button onClick={refresh} disabled={loading}><RefreshCw size={16}/>Refresh</button><button onClick={exportPage} disabled={!payload?.items.length}>Export this page</button></div>
      {current.search?<form onSubmit={e=>{e.preventDefault();setSearch(q);setCursor("");setHistory([]);}}><label>Search {current.label}<input aria-label="Workspace search" value={q} onChange={e=>setQ(e.target.value)} maxLength={100}/></label><button>Search</button></form>:<p>Records are ordered by a stable identifier. Export includes only the currently displayed page.</p>}
      {loading?<p role="status">Loading records…</p>:error?<p role="alert">{error} <button onClick={refresh}>Retry</button></p>:!payload?.items.length?<p>No records match this section yet.</p>:<div className="live-table-scroll"><table><thead><tr>{columns.map(c=><th key={c} scope="col">{c.replaceAll("_"," ")}</th>)}</tr></thead><tbody>{payload.items.map((row,i)=><tr key={String(row.id||row.key||i)}>{columns.map(c=><td key={c}>{display(row[c])}</td>)}</tr>)}</tbody></table></div>}
      <div className="live-records-foot"><button disabled={!history.length||loading} onClick={()=>{setCursor(history.at(-1)||"");setHistory(h=>h.slice(0,-1));}}>Previous</button><span>Page {history.length+1} · up to 25 records</span><button disabled={!payload?.nextCursor||loading} onClick={()=>{setHistory(h=>[...h,cursor]);setCursor(payload!.nextCursor!);}}>Next</button></div>
      {payload?<p>Updated {new Date(payload.refreshedAt).toLocaleString()}. Counts above include all eligible records; this table is paginated.</p>:null}
      </section>
    </div></div>
  </main>;
}
