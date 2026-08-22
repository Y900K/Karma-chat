"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  Download,
  FileBadge2,
  Filter,
  GraduationCap,
  Languages,
  LayoutDashboard,
  LockKeyhole,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import "./institute.css";
import LiveDashboardStatus from "@/components/live-dashboard-status";

type Lang = "en" | "hi";
const cohorts = [
  {
    name: "Electrician · Semester 4",
    students: 48,
    ready: 68,
    engaged: 82,
    evidence: 61,
  },
  {
    name: "Fitter · Semester 4",
    students: 42,
    ready: 63,
    engaged: 76,
    evidence: 54,
  },
  {
    name: "Electronics Mechanic · Sem 2",
    students: 37,
    ready: 58,
    engaged: 71,
    evidence: 49,
  },
];
const interventions = [
  {
    name: "Ravi Kumar",
    cohort: "Electrician · Sem 4",
    signal: "Diagnostic incomplete",
    action: "Send reminder",
    tone: "amber",
  },
  {
    name: "Neha Joshi",
    cohort: "Electrician · Sem 4",
    signal: "Practical evidence due",
    action: "Review project",
    tone: "blue",
  },
  {
    name: "Sameer Ali",
    cohort: "Fitter · Sem 4",
    signal: "Learning inactive · 9 days",
    action: "Check in",
    tone: "red",
  },
  {
    name: "Pooja Rawat",
    cohort: "Electronics · Sem 2",
    signal: "Interview retry requested",
    action: "Schedule support",
    tone: "teal",
  },
];
const gaps = [
  { skill: "Practical evidence", value: 54, delta: "-18 vs role target" },
  { skill: "Troubleshooting", value: 61, delta: "-12 vs role target" },
  { skill: "Interview explanation", value: 64, delta: "-9 vs role target" },
  { skill: "Safety foundations", value: 84, delta: "+6 above target" },
];

export default function Institute() {
  const [lang, setLang] = useState<Lang>("en"),
    [cohort, setCohort] = useState(0),
    [privacy, setPrivacy] = useState(true);
  const c =
    lang === "en"
      ? {
          hello: "Good afternoon, Placement Team.",
          sub: "Here is where learner support can improve this week’s outcomes.",
          readiness: "Cohort readiness",
          engagement: "Weekly engagement",
          evidence: "Verified evidence",
          placements: "Active applications",
          priority: "Priority interventions",
          gaps: "Skill gaps to address",
          cohorts: "Cohort performance",
          pipeline: "Placement pipeline",
          privacy: "Consent-aware view",
        }
      : {
          hello: "नमस्ते Placement Team।",
          sub: "इस सप्ताह learner support से outcomes कहाँ improve हो सकते हैं।",
          readiness: "Cohort readiness",
          engagement: "Weekly engagement",
          evidence: "Verified evidence",
          placements: "Active applications",
          priority: "Priority interventions",
          gaps: "जिन skill gaps पर काम ज़रूरी है",
          cohorts: "Cohort performance",
          pipeline: "Placement pipeline",
          privacy: "Consent-aware view",
        };
  return (
    <main className="inst-shell pilot-live">
      <aside>
        <Link href="/" className="inst-brand">
          <span>क</span>
          <div>
            KarmaSetu <b>AI</b>
            <small>INSTITUTE WORKSPACE</small>
          </div>
        </Link>
        <div className="institute-name">
          <Building2 />
          <p>
            <b>Government ITI Dehradun</b>
            <small>Verified institute · Pilot</small>
          </p>
          <ChevronDown />
        </div>
        <nav>
          {[
            [LayoutDashboard, "Overview"],
            [Users, "Learners"],
            [GraduationCap, "Cohorts"],
            [BookOpen, "Learning"],
            [FileBadge2, "Evidence review"],
            [Target, "Placements"],
            [BarChart3, "Reports"],
          ].map(([Icon, label], i) => {
            const I = Icon as typeof LayoutDashboard;
            return (
              <a
                className={i === 0 ? "active" : ""}
                href={`#${label}`}
                key={String(label)}
              >
                <I />
                {String(label)}
                {i === 4 && <em>7</em>}
              </a>
            );
          })}
        </nav>
        <div className="inst-side-bottom">
          <a href="#settings">
            <Settings />
            Workspace settings
          </a>
          <div>
            <CircleUserRound />
            <p>
              <b>Anita Verma</b>
              <small>Placement Officer</small>
            </p>
          </div>
        </div>
      </aside>
      <section className="inst-main">
        <header>
          <label>
            <Search />
            <input placeholder="Search learner, cohort or employer…" />
          </label>
          <button onClick={() => setLang(lang === "en" ? "hi" : "en")}>
            <Languages />
            {lang === "en" ? "हिंदी + EN" : "EN + हिंदी"}
          </button>
          <button className="notify">
            <Bell />
            <i />
          </button>
          <CircleUserRound />
        </header>
        <div className="inst-content">
          <div className="inst-welcome">
            <div>
              <p>
                <Sparkles />
                PILOT WEEK 6 · UPDATED TODAY
              </p>
              <h1>{c.hello}</h1>
              <span>{c.sub}</span>
            </div>
            <div className="inst-controls">
              <button>
                <CalendarDays />
                This month
                <ChevronDown />
              </button>
              <button>
                <Download />
                Export aggregate report
              </button>
            </div>
          </div>
          <LiveDashboardStatus scope="institute" />
          <div className="privacy-banner">
            <ShieldCheck />
            <p>
              <b>{c.privacy}</b>
              <span>
                Aggregate data is shown by default. Learner-level details
                require an active institute membership, educational purpose and
                learner consent.
              </span>
            </p>
            <button onClick={() => setPrivacy(!privacy)}>
              {privacy ? "Privacy controls on" : "Review privacy"}
              <ChevronDown />
            </button>
          </div>
          <div className="inst-kpis">
            {[
              [TrendingUp, c.readiness, "68%", "+6 pts", "Target: 75%"],
              [BookOpen, c.engagement, "78%", "+9%", "104 active this week"],
              [FileBadge2, c.evidence, "57%", "+14", "72 verified projects"],
              [Target, c.placements, "31", "+8", "11 interviews scheduled"],
            ].map(([Icon, label, value, delta, note]) => {
              const I = Icon as typeof TrendingUp;
              return (
                <article key={String(label)}>
                  <div>
                    <I />
                    <span>{String(label)}</span>
                  </div>
                  <b>{String(value)}</b>
                  <em>{String(delta)}</em>
                  <small>{String(note)}</small>
                </article>
              );
            })}
          </div>
          <div className="inst-grid">
            <article className="readiness-chart">
              <div className="inst-card-head">
                <div>
                  <p>READINESS TREND</p>
                  <h2>{c.readiness}</h2>
                </div>
                <select
                  value={cohort}
                  onChange={(e) => setCohort(Number(e.target.value))}
                >
                  {cohorts.map((x, i) => (
                    <option value={i} key={x.name}>
                      {x.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="chart-area">
                <div className="ylabels">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>
                <div className="chart">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <div className="line-points">
                    <span style={{ left: "4%", bottom: "42%" }} />
                    <span style={{ left: "22%", bottom: "48%" }} />
                    <span style={{ left: "41%", bottom: "51%" }} />
                    <span style={{ left: "61%", bottom: "57%" }} />
                    <span style={{ left: "80%", bottom: "62%" }} />
                    <span style={{ left: "97%", bottom: "68%" }} />
                  </div>
                  <svg viewBox="0 0 100 50" preserveAspectRatio="none">
                    <polyline points="4,29 22,26 41,24.5 61,21.5 80,19 97,16" />
                  </svg>
                </div>
              </div>
              <div className="xlabels">
                <span>W1</span>
                <span>W2</span>
                <span>W3</span>
                <span>W4</span>
                <span>W5</span>
                <span>W6</span>
              </div>
              <div className="chart-note">
                <TrendingUp />
                <p>
                  <b>Readiness improved 12 points in six weeks.</b>
                  <span>
                    Largest contribution: completed learning paths and verified
                    practical evidence.
                  </span>
                </p>
              </div>
            </article>
            <article className="gap-card">
              <div className="inst-card-head">
                <div>
                  <p>COHORT SIGNALS</p>
                  <h2>{c.gaps}</h2>
                </div>
                <button>
                  <Filter />
                  Filter
                </button>
              </div>
              <div className="gap-list">
                {gaps.map((g, i) => (
                  <div key={g.skill}>
                    <span>{i + 1}</span>
                    <p>
                      <b>{g.skill}</b>
                      <small>{g.delta}</small>
                    </p>
                    <div>
                      <i style={{ width: `${g.value}%` }} />
                    </div>
                    <strong>{g.value}</strong>
                  </div>
                ))}
              </div>
              <div className="gap-action">
                <Wrench />
                <p>
                  <b>Recommended intervention</b>
                  <span>
                    Assign the wiring-board evidence clinic to 22 learners.
                  </span>
                </p>
                <button>
                  Assign
                  <ArrowRight />
                </button>
              </div>
            </article>
            <article className="interventions">
              <div className="inst-card-head">
                <div>
                  <p>SUPPORT QUEUE</p>
                  <h2>{c.priority}</h2>
                </div>
                <a href="#all">
                  View all 18
                  <ArrowRight />
                </a>
              </div>
              <div className="intervention-table">
                <div className="thead">
                  <span>Learner</span>
                  <span>Signal</span>
                  <span>Suggested action</span>
                  <span>Status</span>
                </div>
                {interventions.map((x) => (
                  <div className="trow" key={x.name}>
                    <span>
                      <i>
                        {x.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </i>
                      <p>
                        <b>{x.name}</b>
                        <small>{x.cohort}</small>
                      </p>
                    </span>
                    <span>
                      <em className={x.tone} />
                      {x.signal}
                    </span>
                    <span>
                      <button>
                        {x.action}
                        <ChevronDown />
                      </button>
                    </span>
                    <span>
                      <small>Open</small>
                    </span>
                  </div>
                ))}
              </div>
              <div className="queue-safety">
                <LockKeyhole />
                <span>
                  Suggested actions support learners; they do not lower scores
                  or restrict opportunity access.
                </span>
              </div>
            </article>
            <article className="cohort-card">
              <div className="inst-card-head">
                <div>
                  <p>PROGRAM VIEW</p>
                  <h2>{c.cohorts}</h2>
                </div>
                <a href="#cohorts">
                  Manage cohorts
                  <ArrowRight />
                </a>
              </div>
              {cohorts.map((x) => (
                <div className="cohort-row" key={x.name}>
                  <div>
                    <b>{x.name}</b>
                    <span>{x.students} learners</span>
                  </div>
                  <p>
                    <span>Readiness</span>
                    <i>
                      <em style={{ width: `${x.ready}%` }} />
                    </i>
                    <b>{x.ready}%</b>
                  </p>
                  <p>
                    <span>Engaged</span>
                    <i>
                      <em style={{ width: `${x.engaged}%` }} />
                    </i>
                    <b>{x.engaged}%</b>
                  </p>
                  <p>
                    <span>Evidence</span>
                    <i>
                      <em style={{ width: `${x.evidence}%` }} />
                    </i>
                    <b>{x.evidence}%</b>
                  </p>
                  <ChevronDown />
                </div>
              ))}
            </article>
            <article className="pipeline-card">
              <div className="inst-card-head">
                <div>
                  <p>PLACEMENT OUTCOMES</p>
                  <h2>{c.pipeline}</h2>
                </div>
                <span>Current graduating cohort</span>
              </div>
              <div className="pipeline">
                <div>
                  <b>127</b>
                  <span>Eligible learners</span>
                </div>
                <i>
                  <ArrowRight />
                </i>
                <div>
                  <b>74</b>
                  <span>Employer visible</span>
                </div>
                <i>
                  <ArrowRight />
                </i>
                <div>
                  <b>31</b>
                  <span>Applied</span>
                </div>
                <i>
                  <ArrowRight />
                </i>
                <div>
                  <b>11</b>
                  <span>Interviewing</span>
                </div>
                <i>
                  <ArrowRight />
                </i>
                <div className="success">
                  <b>6</b>
                  <span>Offers</span>
                </div>
              </div>
              <div className="pipeline-note">
                <CheckCircle2 />
                <p>
                  <b>All six offers include a declared wage range.</b>
                  <span>
                    Joining and 90-day retention follow-up will be tracked after
                    learner confirmation.
                  </span>
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
