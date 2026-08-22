"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  ClipboardList,
  Database,
  Download,
  FileWarning,
  Gauge,
  Languages,
  LayoutDashboard,
  LockKeyhole,
  MapPinned,
  Scale,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import "./governance.css";
import LiveDashboardStatus from "@/components/live-dashboard-status";

const districts = [
  { name: "Dehradun", learners: 1240, ready: 72, placed: 184, retained: 88 },
  { name: "Haridwar", learners: 980, ready: 66, placed: 139, retained: 84 },
  {
    name: "Udham Singh Nagar",
    learners: 830,
    ready: 63,
    placed: 102,
    retained: 81,
  },
  { name: "Nainital", learners: 615, ready: 69, placed: 86, retained: 86 },
];
const demand = [
  { skill: "Industrial electrical safety", jobs: 342, gap: 18 },
  { skill: "Motor controls & PLC basics", jobs: 281, gap: 26 },
  { skill: "Preventive maintenance", jobs: 226, gap: 14 },
  { skill: "Quality inspection", jobs: 194, gap: 21 },
];
const reviews = [
  {
    item: "Interview feedback disparity check",
    owner: "Model governance",
    due: "Today",
    tone: "amber",
  },
  {
    item: "Employer verification appeal · KS-218",
    owner: "Trust & Safety",
    due: "4h SLA",
    tone: "red",
  },
  {
    item: "Hindi diagnostic equivalence review",
    owner: "Assessment",
    due: "Tomorrow",
    tone: "blue",
  },
];

export default function Governance() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const c =
    lang === "en"
      ? {
          title: "Outcomes with accountability.",
          sub: "Monitor program impact, fairness and system health without turning learners into surveillance data.",
          district: "District outcomes",
          demand: "Regional skill demand",
          queue: "Governance review queue",
        }
      : {
          title: "Outcomes के साथ जवाबदेही।",
          sub: "Learners को surveillance data बनाए बिना program impact, fairness और system health monitor करें।",
          district: "District outcomes",
          demand: "Regional skill demand",
          queue: "Governance review queue",
        };
  return (
    <main className="gov-shell">
      <aside>
        <Link href="/" className="gov-brand">
          <span>क</span>
          <div>
            KarmaSetu <b>AI</b>
            <small>PROGRAM GOVERNANCE</small>
          </div>
        </Link>
        <div className="program">
          <MapPinned />
          <p>
            <b>Uttarakhand Skills Mission</b>
            <small>State pilot · Authorized</small>
          </p>
          <ChevronDown />
        </div>
        <nav>
          {[
            [LayoutDashboard, "Overview"],
            [MapPinned, "Districts"],
            [Building2, "Institutes"],
            [TrendingUp, "Demand signals"],
            [Scale, "Fairness"],
            [ShieldCheck, "AI governance"],
            [FileWarning, "Grievances"],
            [Database, "Data exports"],
          ].map(([Icon, label], i) => {
            const I = Icon as typeof LayoutDashboard;
            return (
              <a
                className={i === 0 ? "active" : ""}
                href={`#${String(label)}`}
                key={String(label)}
              >
                <I />
                {String(label)}
                {i === 6 && <em>3</em>}
              </a>
            );
          })}
        </nav>
        <div className="gov-bottom">
          <a href="#settings">
            <Settings />
            Program settings
          </a>
          <div>
            <CircleUserRound />
            <p>
              <b>Priya Nair</b>
              <small>Program Administrator</small>
            </p>
          </div>
        </div>
      </aside>
      <section className="gov-main">
        <header>
          <label>
            <Search />
            <input
              aria-label="Search"
              placeholder="Search district, institute or metric…"
            />
          </label>
          <button onClick={() => setLang(lang === "en" ? "hi" : "en")}>
            <Languages />
            {lang === "en" ? "हिंदी + EN" : "EN + हिंदी"}
          </button>
          <button className="alerts">
            <Bell />
            <i />
          </button>
          <CircleUserRound />
        </header>
        <div className="gov-content">
          <div className="gov-welcome">
            <div>
              <p>
                <Sparkles />
                AGGREGATED VIEW · UPDATED 08:30 IST
              </p>
              <h1>{c.title}</h1>
              <span>{c.sub}</span>
            </div>
            <div>
              <button>
                Q2 pilot
                <ChevronDown />
              </button>
              <button className="export">
                <Download />
                Request export
              </button>
            </div>
          </div>
          <LiveDashboardStatus scope="government" />
          <div className="guardrail">
            <LockKeyhole />
            <p>
              <b>Privacy threshold active: minimum cohort size 10</b>
              <span>
                Small groups are suppressed, exports are purpose-bound, and
                every access is logged. Individual learner drill-down is
                unavailable here.
              </span>
            </p>
            <button>
              Review policy
              <ArrowRight />
            </button>
          </div>
          <div className="gov-kpis">
            {[
              [Users, "Activated learners", "3,665", "+11% this quarter"],
              [Gauge, "Role readiness", "68%", "+7 points"],
              [
                CheckCircle2,
                "Verified placements",
                "511",
                "86% retained at 90d",
              ],
              [Activity, "Platform health", "99.96%", "2 open incidents"],
            ].map(([Icon, label, value, note]) => {
              const I = Icon as typeof Users;
              return (
                <article key={String(label)}>
                  <div>
                    <I />
                    <span>{String(label)}</span>
                  </div>
                  <b>{String(value)}</b>
                  <small>{String(note)}</small>
                </article>
              );
            })}
          </div>
          <div className="gov-grid">
            <article className="districts">
              <div className="ghead">
                <div>
                  <p>PROGRAM DELIVERY</p>
                  <h2>{c.district}</h2>
                </div>
                <a href="#districts">
                  View all 13
                  <ArrowRight />
                </a>
              </div>
              <div className="dtable">
                <div className="dh">
                  <span>District</span>
                  <span>Learners</span>
                  <span>Ready</span>
                  <span>Placed</span>
                  <span>90d retained</span>
                </div>
                {districts.map((x) => (
                  <div className="dr" key={x.name}>
                    <b>{x.name}</b>
                    <span>{x.learners.toLocaleString("en-IN")}</span>
                    <span>
                      <i>
                        <em style={{ width: `${x.ready}%` }} />
                      </i>
                      {x.ready}%
                    </span>
                    <span>{x.placed}</span>
                    <strong>{x.retained}%</strong>
                  </div>
                ))}
              </div>
              <div className="method">
                <ShieldCheck />
                <span>
                  Placement is counted only after learner confirmation;
                  retention requires a 90-day follow-up.
                </span>
              </div>
            </article>
            <article className="demand">
              <div className="ghead">
                <div>
                  <p>EMPLOYER SIGNALS</p>
                  <h2>{c.demand}</h2>
                </div>
                <button>
                  90 days
                  <ChevronDown />
                </button>
              </div>
              {demand.map((x, i) => (
                <div className="skill" key={x.skill}>
                  <span>{i + 1}</span>
                  <p>
                    <b>{x.skill}</b>
                    <small>{x.jobs} open roles</small>
                  </p>
                  <div>
                    <i style={{ width: `${x.gap * 3}%` }} />
                  </div>
                  <strong>{x.gap}% gap</strong>
                </div>
              ))}
              <div className="insight">
                <TrendingUp />
                <p>
                  <b>Curriculum opportunity</b>
                  <span>
                    Motor controls demand is growing fastest across three
                    industrial clusters.
                  </span>
                </p>
              </div>
            </article>
            <article className="fairness">
              <div className="ghead">
                <div>
                  <p>RESPONSIBLE AI</p>
                  <h2>Fairness & model health</h2>
                </div>
                <span className="healthy">
                  <CheckCircle2 />
                  Within guardrails
                </span>
              </div>
              <div className="fair-grid">
                <div>
                  <b>1.8 pp</b>
                  <span>Largest exposure-rate gap</span>
                  <small>Threshold: 5 pp</small>
                </div>
                <div>
                  <b>96.2%</b>
                  <span>Grounded AI responses</span>
                  <small>Last 2,400 samples</small>
                </div>
                <div>
                  <b>0</b>
                  <span>Automated rejections</span>
                  <small>Human decision required</small>
                </div>
                <div>
                  <b>v0.4.2</b>
                  <span>Matching model</span>
                  <small>Reviewed 12 Aug 2026</small>
                </div>
              </div>
              <button className="model">
                <BarChart3 />
                Open model card and evaluation history
                <ArrowRight />
              </button>
            </article>
            <article className="reviews">
              <div className="ghead">
                <div>
                  <p>HUMAN OVERSIGHT</p>
                  <h2>{c.queue}</h2>
                </div>
                <a href="#queue">
                  Open queue
                  <ArrowRight />
                </a>
              </div>
              {reviews.map((x) => (
                <div className="review" key={x.item}>
                  <i className={x.tone} />
                  <p>
                    <b>{x.item}</b>
                    <small>{x.owner}</small>
                  </p>
                  <span>{x.due}</span>
                  <button>
                    <ArrowRight />
                  </button>
                </div>
              ))}
              <div className="sla">
                <AlertTriangle />
                <span>No learner-impacting grievance is past SLA.</span>
              </div>
            </article>
            <article className="lineage">
              <div className="ghead">
                <div>
                  <p>DATA RESPONSIBILITY</p>
                  <h2>Export & audit status</h2>
                </div>
                <ClipboardList />
              </div>
              <div className="audit-flow">
                <div>
                  <Database />
                  <b>Aggregate request</b>
                  <span>Purpose + fields</span>
                </div>
                <ArrowRight />
                <div>
                  <ShieldCheck />
                  <b>Privacy check</b>
                  <span>Threshold + scope</span>
                </div>
                <ArrowRight />
                <div>
                  <ClipboardList />
                  <b>Approval</b>
                  <span>Two-person review</span>
                </div>
                <ArrowRight />
                <div>
                  <Download />
                  <b>Expiring export</b>
                  <span>Watermarked + logged</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
