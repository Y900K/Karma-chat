"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  FileCheck2,
  Filter,
  Handshake,
  Languages,
  LayoutDashboard,
  LockKeyhole,
  MapPin,
  Plus,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import "./employer.css";
import LiveDashboardStatus from "@/components/live-dashboard-status";
import {useWorkspaceLanguage,WorkspaceHeaderLink,WorkspaceSearch,WorkspaceSignOut} from "@/components/workspace-utilities";

const candidates = [
  {
    name: "Aarav S.",
    role: "Industrial Electrician",
    place: "Dehradun",
    match: 92,
    skills: ["Safety", "Panel wiring", "Fault finding"],
    evidence: 4,
    status: "New match",
  },
  {
    name: "Meera K.",
    role: "Electrical Technician",
    place: "Haridwar",
    match: 88,
    skills: ["Motor control", "Testing", "Maintenance"],
    evidence: 5,
    status: "Shortlisted",
  },
  {
    name: "Kabir R.",
    role: "Maintenance Trainee",
    place: "Roorkee",
    match: 84,
    skills: ["Tools", "Preventive care", "Documentation"],
    evidence: 3,
    status: "Interview",
  },
];
const jobs = [
  {
    title: "Junior Industrial Electrician",
    open: 18,
    stage: "Published",
    matches: 64,
    interviews: 9,
  },
  {
    title: "Maintenance Technician Trainee",
    open: 8,
    stage: "Published",
    matches: 31,
    interviews: 5,
  },
  {
    title: "Panel Wiring Apprentice",
    open: 12,
    stage: "Draft",
    matches: 0,
    interviews: 0,
  },
];

export default function Employer() {
  const {lang,toggleLanguage}=useWorkspaceLanguage();
  const copy =
    lang === "en"
      ? {
          hello: "Build a trusted, job-ready team.",
          sub: "Hire from verified skills and practical evidence—not pedigree or guesswork.",
          talent: "Recommended talent",
          jobs: "Active roles",
          funnel: "Hiring pipeline",
        }
      : {
          hello: "भरोसेमंद, job-ready team बनाएँ।",
          sub: "Hiring verified skills और practical evidence से करें—सिर्फ degree या अनुमान से नहीं।",
          talent: "Recommended talent",
          jobs: "Active roles",
          funnel: "Hiring pipeline",
        };
  return (
    <main className="emp-shell pilot-live">
      <aside>
        <Link href="/" className="emp-brand">
          <span>क</span>
          <div>
            KarmaSetu <b>AI</b>
            <small>EMPLOYER WORKSPACE</small>
          </div>
        </Link>
        <Link href="/workspace/settings" className="company" aria-label="Open employer workspace settings">
          <Building2 />
          <p>
            <b>Shakti Auto Components</b>
            <small>Verified employer</small>
          </p>
          <ChevronDown />
        </Link>
        <nav>
          {[
            [LayoutDashboard, "Overview","employer-overview"],
            [BriefcaseBusiness, "Jobs","employer-jobs"],
            [Users, "Talent","employer-talent"],
            [CalendarClock, "Interviews","employer-pipeline"],
            [Handshake, "Offers","employer-pipeline"],
            [BarChart3, "Outcomes","employer-pipeline"],
          ].map(([Icon, label,target], i) => {
            const I = Icon as typeof LayoutDashboard;
            return (
              <a
                className={i === 0 ? "active" : ""}
                href={`#${String(target)}`}
                key={String(label)}
              >
                <I />
                {String(label)}
                {i === 2 && <em>12</em>}
              </a>
            );
          })}
        </nav>
        <div className="emp-bottom">
          <Link href="/workspace/settings">
            <Settings />
            Workspace settings
          </Link>
          <WorkspaceSignOut/>
          <Link href="/workspace/settings" className="workspace-profile">
            <CircleUserRound />
            <p>
              <b>Rohit Malhotra</b>
              <small>Hiring Manager</small>
            </p>
          </Link>
        </div>
      </aside>
      <section className="emp-main">
        <header>
          <WorkspaceSearch placeholder="Search talent, jobs or interviews…" targets={{"talent|candidate|skill":"employer-talent","job|role|vacancy":"employer-jobs","interview|offer|outcome|pipeline":"employer-pipeline"}}/>
          <button onClick={toggleLanguage}>
            <Languages />
            {lang === "en" ? "हिंदी + EN" : "EN + हिंदी"}
          </button>
          <WorkspaceHeaderLink href="/workspace/notifications" label="Employer notifications" className="bell"><Bell/><i/></WorkspaceHeaderLink>
          <WorkspaceHeaderLink href="/workspace/settings" label="Employer account settings"><CircleUserRound/></WorkspaceHeaderLink>
        </header>
        <div className="emp-content" id="employer-overview">
          <div className="emp-welcome">
            <div>
              <p>
                <Sparkles />
                VERIFIED EMPLOYER · TALENT WITH PROOF
              </p>
              <h1>{copy.hello}</h1>
              <span>{copy.sub}</span>
            </div>
            <button className="primary">
              <Plus />
              Create transparent job
            </button>
          </div>
          <LiveDashboardStatus scope="employer" />
          <div className="trust">
            <ShieldCheck />
            <p>
              <b>Consent-first talent access</b>
              <span>
                Browse anonymized readiness signals. Identity and contact
                details unlock only after the learner accepts your request.
              </span>
            </p>
            <button>
              View hiring principles
              <ArrowRight />
            </button>
          </div>
          <div className="emp-kpis">
            {[
              [BriefcaseBusiness, "Open roles", "2", "26 vacancies", "employer-jobs"],
              [Users, "Qualified matches", "95", "12 new this week", "employer-talent"],
              [CalendarClock, "Interviews", "14", "5 awaiting feedback", "employer-pipeline"],
              [Handshake, "Offers accepted", "8", "80% acceptance", "employer-pipeline"],
            ].map(([Icon, label, value, note, target]) => {
              const I = Icon as typeof BriefcaseBusiness;
              return (
                <a className="workspace-kpi" href={`#${String(target)}`} key={String(label)}><article>
                  <div>
                    <I />
                    <span>{String(label)}</span>
                  </div>
                  <b>{String(value)}</b>
                  <small>{String(note)}</small>
                </article></a>
              );
            })}
          </div>
          <div className="emp-grid">
            <article className="talent" id="employer-talent">
              <div className="card-head">
                <div>
                  <p>EXPLAINABLE MATCHING</p>
                  <h2>{copy.talent}</h2>
                </div>
                <button>
                  <Filter />
                  Role: Electrician
                  <ChevronDown />
                </button>
              </div>
              <div className="candidate-list">
                {candidates.map((x, i) => (
                  <div className="candidate" key={x.name}>
                    <div className="avatar">
                      {x.name.slice(0, 1)}
                      <i />
                    </div>
                    <div className="identity">
                      <b>{x.name}</b>
                      <span>
                        {x.role} · <MapPin />
                        {x.place}
                      </span>
                      <div>
                        {x.skills.map((s) => (
                          <em key={s}>{s}</em>
                        ))}
                      </div>
                    </div>
                    <div className="proof">
                      <FileCheck2 />
                      <b>{x.evidence}</b>
                      <span>verified evidence</span>
                    </div>
                    <div className="score">
                      <strong>{x.match}%</strong>
                      <span>role match</span>
                      <button
                        onClick={() =>
                          alert(
                            "Candidate profile stays anonymized until consent is granted.",
                          )
                        }
                      >
                        {i === 0 ? "Review match" : x.status}
                        <ArrowRight />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="match-note">
                <LockKeyhole />
                <span>
                  Match scores show skill overlap, missing signals and evidence
                  quality. Protected attributes are never used.
                </span>
              </div>
            </article>
            <article className="roles" id="employer-jobs">
              <div className="card-head">
                <div>
                  <p>ROLE HEALTH</p>
                  <h2>{copy.jobs}</h2>
                </div>
                <a href="#employer-jobs">
                  Manage all
                  <ArrowRight />
                </a>
              </div>
              {jobs.map((x) => (
                <div className="job" key={x.title}>
                  <div>
                    <b>{x.title}</b>
                    <span>
                      <i className={x.stage === "Draft" ? "draft" : ""} />
                      {x.stage} · {x.open} openings
                    </span>
                  </div>
                  <p>
                    <b>{x.matches}</b>
                    <span>matches</span>
                  </p>
                  <p>
                    <b>{x.interviews}</b>
                    <span>interviews</span>
                  </p>
                  <button aria-label={`Open ${x.title}`}>
                    <ArrowRight />
                  </button>
                </div>
              ))}
              <button className="role-add">
                <Plus />
                Create another role
              </button>
            </article>
            <article className="pipeline-card" id="employer-pipeline">
              <div className="card-head">
                <div>
                  <p>FAIR HIRING OPERATIONS</p>
                  <h2>{copy.funnel}</h2>
                </div>
                <span>Last 30 days</span>
              </div>
              <div className="hiring-pipeline">
                {[
                  ["95", "Qualified"],
                  ["28", "Consent requests"],
                  ["19", "Shortlisted"],
                  ["14", "Interviewed"],
                  ["10", "Offers"],
                  ["8", "Accepted"],
                ].map(([n, l], i) => (
                  <div key={l} className={i === 5 ? "won" : ""}>
                    <b>{n}</b>
                    <span>{l}</span>
                    {i < 5 && <ArrowRight />}
                  </div>
                ))}
              </div>
              <div className="outcomes">
                <CheckCircle2 />
                <p>
                  <b>Structured feedback completed for 93% of interviews.</b>
                  <span>
                    Next: collect joining confirmation and 30/90-day retention
                    outcomes.
                  </span>
                </p>
                <Star />
                <span>Candidate experience 4.7/5</span>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
