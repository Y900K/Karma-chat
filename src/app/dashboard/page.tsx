"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Bell,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleUserRound,
  FileBadge2,
  Home,
  Languages,
  LogOut,
  MessageCircleMore,
  Play,
  Search,
  Settings,
  Sparkles,
  Trophy,
  Upload,
  Zap,
} from "lucide-react";
import LiveDashboardStatus from "@/components/live-dashboard-status";
import "./dashboard.css";
import "./dashboard-fixes.css";

type Lang = "en" | "hi";
const content = {
  en: {
    hello: "Good afternoon, Aarav.",
    sub: "You’re closer than yesterday. Here’s the one action that matters now.",
    next: "YOUR NEXT BEST ACTION",
    lesson: "Complete your practical evidence",
    lessonSub:
      "Upload the wiring-board project from Unit 3. A verified project can lift Practical Evidence from 68 to 81.",
    continue: "Add project evidence",
    readiness: "Your JobReady Index",
    match: "Strong foundation",
    explanation: "Why 72?",
    weekly: "This week",
    journey: "Your journey",
    opportunities: "Opportunity signals",
    coach: "Ask Karma, your AI coach",
    placeholder: "Ask about your next step…",
    active: "3-day learning streak",
    nav: [
      "Home",
      "My Skill Graph",
      "Learning path",
      "Evidence",
      "AI interview",
      "Opportunities",
    ],
  },
  hi: {
    hello: "नमस्ते Aarav।",
    sub: "आप कल से एक कदम आगे हैं। अभी सबसे ज़रूरी action यह है।",
    next: "आपका अगला सबसे सही ACTION",
    lesson: "अपना practical evidence पूरा करें",
    lessonSub:
      "Unit 3 का wiring-board project upload करें। Verified project से Practical Evidence 68 से 81 तक बढ़ सकता है।",
    continue: "Project evidence जोड़ें",
    readiness: "आपका JobReady Index",
    match: "मज़बूत foundation",
    explanation: "72 क्यों?",
    weekly: "इस सप्ताह",
    journey: "आपकी journey",
    opportunities: "Opportunity signals",
    coach: "Karma AI coach से पूछें",
    placeholder: "अपने अगले step के बारे में पूछें…",
    active: "3 दिन की learning streak",
    nav: [
      "Home",
      "मेरा Skill Graph",
      "Learning path",
      "Evidence",
      "AI interview",
      "Opportunities",
    ],
  },
};

const dimensions = [
  {
    label: "Technical knowledge",
    hi: "Technical knowledge",
    value: 78,
    tone: "teal",
  },
  {
    label: "Practical evidence",
    hi: "Practical evidence",
    value: 68,
    tone: "yellow",
  },
  { label: "Communication", hi: "Communication", value: 71, tone: "blue" },
  {
    label: "Interview readiness",
    hi: "Interview readiness",
    value: 74,
    tone: "purple",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("en");
  const [query, setQuery] = useState("");
  const [headerSearch, setHeaderSearch] = useState("");
  const [identity, setIdentity] = useState({ displayName: "Learner", trade: "Current pathway", semester: null as number | null });
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const c = content[lang];
  const searchNavigate = () => {
    const value = headerSearch.trim().toLowerCase();
    const destination = /lesson|learn|course|path/.test(value) ? "/learn" : /evidence|proof|project/.test(value) ? "/evidence" : /interview|practice/.test(value) ? "/interview" : /job|opportun|application/.test(value) ? "/opportunities" : "/roles";
    router.push(destination);
  };
  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/dashboard?scope=learner", { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (payload?.data?.identity) setIdentity({ displayName: String(payload.data.identity.displayName || "Learner"), trade: String(payload.data.identity.trade || "Current pathway"), semester: typeof payload.data.identity.semester === "number" ? payload.data.identity.semester : null });
        if (typeof payload?.data?.metrics?.unreadNotifications === "number") setUnreadNotifications(payload.data.metrics.unreadNotifications);
      }).catch(() => undefined);
    return () => controller.abort();
  }, []);
  const askCoach = async () => {
    if (!query.trim()) return;
    setBusy(true);
    setAnswer("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "career-coach",
          locale: lang,
          messages: [{ role: "user", content: query }],
        }),
      });
      const data = await res.json();
      setAnswer(data.message || data.error || "Please try again.");
    } catch {
      setAnswer("The coach is taking a short break. Please try again.");
    }
    setBusy(false);
  };
  return (
    <main className="dash-shell pilot-live">
      <aside className="dash-sidebar">
        <Link className="dash-brand" href="/">
          <span>क</span>
          <div>
            KarmaSetu <b>AI</b>
            <small>कौशल से करियर तक</small>
          </div>
        </Link>
        <nav className="side-nav">
          {[
            Home,
            Activity,
            BookOpen,
            FileBadge2,
            BrainCircuit,
            BriefcaseBusiness,
          ].map((Icon, i) => (
            <Link
              href={
                i === 1
                  ? "/portfolio"
                  : i === 2
                    ? "/learn"
                    : i === 3
                      ? "/evidence"
                      : i === 4
                        ? "/interview"
                        : i === 5
                          ? "/opportunities"
                  : "/dashboard"
              }
              className={i === 0 ? "active" : ""}
              key={c.nav[i]}
            >
              <Icon />
              {c.nav[i]}
              {i === 3 && <em>1</em>}
            </Link>
          ))}
        </nav>
        <div className="side-bottom">
            <Link href="/settings">
              <Settings /> Settings
            </Link>
            <form action="/auth/signout" method="post">
              <button className="signout-button" type="submit"><LogOut /> Sign out</button>
            </form>
          <div className="profile-mini">
            <CircleUserRound />
            <span>
              <b>{identity.displayName}</b>
              <small>{identity.trade}{identity.semester ? ` · Semester ${identity.semester}` : ""}</small>
            </span>
          </div>
        </div>
      </aside>
      <section className="dash-main">
        <header className="dash-top">
          <div className="mobile-brand">क</div>
          <form className="dash-search" onSubmit={(event) => { event.preventDefault(); searchNavigate(); }}>
            <Search />
            <input value={headerSearch} onChange={(event) => setHeaderSearch(event.target.value)} placeholder="Search skills, lessons, opportunities…" aria-label="Search roles and skills" />
          </form>
          <button
            className="lang-switch"
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
          >
            <Languages /> {lang === "en" ? "हिंदी" : "EN"}
          </button>
          <Link className="icon-btn" href="/notifications" aria-label={`Notifications${unreadNotifications ? ` (${unreadNotifications} unread)` : ""}`}>
            <Bell />
            {unreadNotifications > 0 && <span />}
          </Link>
          <Link href="/settings" aria-label="Account settings"><CircleUserRound className="mobile-avatar" /></Link>
        </header>
        <div className="dash-content">
          <div className="welcome">
            <div>
              <p className="dash-eyebrow">
                <Sparkles /> {c.active}
              </p>
              <h1>{lang === "en" ? `Good afternoon, ${identity.displayName}.` : `नमस्ते ${identity.displayName}।`}</h1>
              <p>{c.sub}</p>
            </div>
            <div className="week-stat">
              <small>{c.weekly}</small>
              <b>+6</b>
              <span>readiness points</span>
            </div>
          </div>
          <LiveDashboardStatus scope="learner" />
          <article className="next-action">
            <div className="next-icon">
              <Upload />
            </div>
            <div className="next-copy">
              <p>{c.next}</p>
              <h2>{c.lesson}</h2>
              <span>{c.lessonSub}</span>
            </div>
            <Link href="/learn">
              Continue learning
              <ArrowRight />
            </Link>
            <div className="action-progress">
              <span />
            </div>
          </article>
          <div className="dashboard-grid">
            <article className="readiness-card">
              <div className="card-head">
                <div>
                  <p className="dash-label">{c.readiness}</p>
                  <h3>{c.match}</h3>
                </div>
                <Link href="/portfolio">
                  {c.explanation}
                  <ChevronRight />
                </Link>
              </div>
              <div className="readiness-body">
                <div className="score-ring">
                  <div>
                    <b>72</b>
                    <span>/100</span>
                  </div>
                </div>
                <div className="dimensions">
                  {dimensions.map((d) => (
                    <div key={d.label}>
                      <div>
                        <span>{lang === "en" ? d.label : d.hi}</span>
                        <b>{d.value}</b>
                      </div>
                      <div className={`bar ${d.tone}`}>
                        <span style={{ width: `${d.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="transparent-note">
                <Zap /> Based on 4 verified signals · Updated today
              </div>
            </article>
            <article className="journey-card">
              <div className="card-head">
                <div>
                  <p className="dash-label">{c.journey}</p>
                  <h3>Industrial Electrician</h3>
                </div>
                <span className="path-percent">64%</span>
              </div>
              <div className="path-list">
                {[
                  ["Baseline diagnostic", "Completed · 12 Aug", true],
                  ["Safety foundations", "4 of 4 units", true],
                  ["Electrical drawings", "3 of 4 units", false],
                  ["Practical evidence", "1 project required", false],
                  ["AI mock interview", "Unlocks next", false],
                ].map((x, i) => (
                  <div
                    className={x[2] ? "done" : i === 2 ? "current" : ""}
                    key={String(x[0])}
                  >
                    <span className="path-dot">{x[2] ? <Check /> : i + 1}</span>
                    <p>
                      <b>{x[0]}</b>
                      <small>{x[1]}</small>
                    </p>
                    {i === 2 && (
                      <Link href="/learn">
                        <Play /> Continue
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </article>
            <article className="opportunity-card">
              <div className="card-head">
                <div>
                  <p className="dash-label">{c.opportunities}</p>
                  <h3>Roles moving closer</h3>
                </div>
                <Link href="/opportunities">View all</Link>
              </div>
              {[
                {
                  role: "Junior Electrical Technician",
                  company: "Apex Motion Systems",
                  place: "Noida · ₹18–22K",
                  match: 86,
                },
                {
                  role: "Maintenance Apprentice",
                  company: "Shivam Components",
                  place: "Haridwar · ₹14–17K",
                  match: 79,
                },
              ].map((job) => (
                <div className="job" key={job.role}>
                  <div className="company-mark">{job.company[0]}</div>
                  <div>
                    <b>{job.role}</b>
                    <span>{job.company}</span>
                    <small>{job.place}</small>
                  </div>
                  <strong>
                    {job.match}%<small>match</small>
                  </strong>
                </div>
              ))}
              <div className="unlock-note">
                <Trophy /> Add practical evidence to unlock 7 more relevant
                roles.
              </div>
            </article>
            <article className="coach-card">
              <div className="coach-head">
                <div className="karma-orb">
                  <MessageCircleMore />
                </div>
                <div>
                  <p className="dash-label">KARMA AI</p>
                  <h3>{c.coach}</h3>
                </div>
                <span>ONLINE</span>
              </div>
              <p>
                “Your practical score is the fastest route to a stronger match.
                Want a 20-minute plan for today?”
              </p>
              {answer && <div className="coach-answer">{answer}</div>}
              <div className="coach-input">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && askCoach()}
                  placeholder={c.placeholder}
                />
                <button onClick={askCoach} disabled={busy}>
                  {busy ? "…" : <ArrowRight />}
                </button>
              </div>
              <div className="suggestions">
                <button
                  onClick={() => setQuery("Make my 20-minute learning plan")}
                >
                  Make my 20-minute plan
                </button>
                <button onClick={() => setQuery("Explain my JobReady Index")}>
                  Explain my score
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
