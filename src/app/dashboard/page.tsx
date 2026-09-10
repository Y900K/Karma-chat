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
  Zap,
} from "lucide-react";
import LiveDashboardStatus from "@/components/live-dashboard-status";
import { useWorkspaceLanguage } from "@/components/workspace-utilities";
import "./dashboard.css";
import "./dashboard-fixes.css";

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

type Skill = { skill_slug: string; proficiency_score: number | null };
type Match = { job_id: string; score: number; jobs: { title: string; location: unknown } | null };

export default function Dashboard() {
  const router = useRouter();
  const { lang, toggleLanguage } = useWorkspaceLanguage();
  const [query, setQuery] = useState("");
  const [headerSearch, setHeaderSearch] = useState("");
  const [identity, setIdentity] = useState({
    displayName: "Learner",
    trade: "Current pathway",
    semester: null as number | null,
  });
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [summary, setSummary] = useState<{readiness:number|null; completedLessons:number; pendingEvidence:number; skills:Skill[]; matches:Match[]}>({readiness:null,completedLessons:0,pendingEvidence:0,skills:[],matches:[]});
  const [summaryError, setSummaryError] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [aiStatus, setAiStatus] = useState<
    "idle" | "loading" | "live" | "degraded" | "error"
  >("idle");
  const c = content[lang];
  const searchNavigate = () => {
    const value = headerSearch.trim().toLowerCase();
    const destination = /lesson|learn|course|path/.test(value)
      ? "/learn"
      : /evidence|proof|project/.test(value)
        ? "/evidence"
        : /interview|practice/.test(value)
          ? "/interview"
          : /job|opportun|application/.test(value)
            ? "/opportunities"
            : "/roles";
    router.push(destination);
  };
  useEffect(() => {
    const controller = new AbortController();
    let inFlight = false;
    const refresh = () => {
    if (inFlight || document.hidden) return;
    inFlight = true;
    void fetch("/api/dashboard?scope=learner", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => { if (!response.ok) throw new Error("Dashboard unavailable"); return response.json(); })
      .then((payload) => {
        setSummaryError("");
        if (payload?.data) setSummary({
          readiness: payload.data.metrics?.readiness ?? null,
          completedLessons: payload.data.metrics?.completedLessons ?? 0,
          pendingEvidence: payload.data.metrics?.pendingEvidence ?? 0,
          skills: payload.data.skills ?? [],
          matches: payload.data.matches ?? [],
        });
        if (payload?.data?.identity)
          setIdentity({
            displayName: String(payload.data.identity.displayName || "Learner"),
            trade: String(payload.data.identity.trade || "Current pathway"),
            semester:
              typeof payload.data.identity.semester === "number"
                ? payload.data.identity.semester
                : null,
          });
        if (typeof payload?.data?.metrics?.unreadNotifications === "number")
          setUnreadNotifications(payload.data.metrics.unreadNotifications);
      })
      .catch(() => { if (!controller.signal.aborted) setSummaryError("Summary could not refresh. Previously loaded values may be outdated."); })
      .finally(() => { inFlight = false; });
    };
    refresh();
    const timer = window.setInterval(refresh, 60_000);
    document.addEventListener("visibilitychange", refresh);
    return () => { controller.abort(); clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
  }, []);
  const askCoach = async () => {
    if (!query.trim()) return;
    setBusy(true);
    setAiStatus("loading");
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
      if (!res.ok) throw new Error(data.error || "AI coaching is unavailable");
      setAnswer(data.message || "Please try again.");
      setAiStatus(data.degraded ? "degraded" : "live");
    } catch {
      setAnswer(
        "The coach is reconnecting. Your learning path remains available while live coaching recovers.",
      );
      setAiStatus("error");
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
              {i === 3 && summary.pendingEvidence > 0 && <em>{summary.pendingEvidence}</em>}
            </Link>
          ))}
        </nav>
        <div className="side-bottom">
          <Link href="/settings">
            <Settings /> Settings
          </Link>
          <form action="/auth/signout" method="post">
            <button className="signout-button" type="submit">
              <LogOut /> Sign out
            </button>
          </form>
          <div className="profile-mini">
            <CircleUserRound />
            <span>
              <b>{identity.displayName}</b>
              <small>
                {identity.trade}
                {identity.semester ? ` · Semester ${identity.semester}` : ""}
              </small>
            </span>
          </div>
        </div>
      </aside>
      <section className="dash-main">
        <header className="dash-top">
          <div className="mobile-brand">क</div>
          <form
            className="dash-search"
            onSubmit={(event) => {
              event.preventDefault();
              searchNavigate();
            }}
          >
            <Search />
            <input
              value={headerSearch}
              onChange={(event) => setHeaderSearch(event.target.value)}
              placeholder="Search skills, lessons, opportunities…"
              aria-label="Search roles and skills"
            />
          </form>
          <button className="lang-switch" onClick={toggleLanguage}>
            <Languages /> {lang === "en" ? "हिंदी" : "EN"}
          </button>
          <Link
            className="icon-btn"
            href="/notifications"
            aria-label={`Notifications${unreadNotifications ? ` (${unreadNotifications} unread)` : ""}`}
          >
            <Bell />
            {unreadNotifications > 0 && <span />}
          </Link>
          <Link href="/settings" aria-label="Account settings">
            <CircleUserRound className="mobile-avatar" />
          </Link>
        </header>
        <div className="dash-content">
          <div className="welcome">
            <div>
              <p className="dash-eyebrow">
                <Sparkles /> {lang === "en" ? "Your learning workspace" : "आपका learning workspace"}
              </p>
              <h1>
                {lang === "en"
                  ? `Good afternoon, ${identity.displayName}.`
                  : `नमस्ते ${identity.displayName}।`}
              </h1>
              <p>{c.sub}</p>
            </div>
            <div className="week-stat">
              <small>{lang === "en" ? "Completed lessons" : "पूरे किए lessons"}</small>
              <b>{summary.completedLessons}</b>
              <span>Recorded learning progress</span>
            </div>
          </div>
          <LiveDashboardStatus scope="learner" />
          {summaryError && <p role="alert">{summaryError}</p>}
          <article className="next-action">
            <div className="next-icon">
              <BookOpen />
            </div>
            <div className="next-copy">
              <p>{c.next}</p>
              <h2>{lang === "en" ? "Continue approved learning" : "Approved learning जारी रखें"}</h2>
              <span>{lang === "en" ? "Review your learning path and choose the next available lesson." : "अपना learning path देखें और अगला available lesson चुनें।"}</span>
            </div>
            <Link href="/learn">
              Continue learning
              <ArrowRight />
            </Link>

          </article>
          <div className="dashboard-grid">
            <article className="readiness-card">
              <div className="card-head">
                <div>
                  <p className="dash-label">Recent skill summary</p>
                  <h3>{lang === "en" ? "Recorded skill signals" : "दर्ज किए skill signals"}</h3>
                </div>
                <Link href="/portfolio">
                  View evidence
                  <ChevronRight />
                </Link>
              </div>
              <div className="readiness-body">
                <div className="score-ring" style={{background: `conic-gradient(#1eb5a8 ${(summary.readiness ?? 0) * 3.6}deg, #e5eeeb 0deg)`}}>
                  <div>
                    <b>{summary.readiness ?? "—"}</b>
                    <span>/100</span>
                  </div>
                </div>
                <div className="dimensions">
                  {summary.skills.map((d, i) => (
                    <div key={d.skill_slug}>
                      <div>
                        <span>{d.skill_slug.replaceAll("-", " ")}</span>
                        <b>{d.proficiency_score ?? "—"}</b>
                      </div>
                      <div className={`bar ${["teal","yellow","blue","purple"][i % 4]}`}>
                        <span style={{ width: `${Math.max(0, Math.min(100, d.proficiency_score ?? 0))}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="transparent-note">
                <Zap /> Average of up to 12 recent skill scores; latest assessment used if no skills exist. Not a hiring decision.
              </div>
            </article>
            <article className="journey-card">
              <div className="card-head">
                <div>
                  <p className="dash-label">{c.journey}</p>
                  <h3>{identity.trade}</h3>
                </div>
              </div>
              <div className="path-list">
                {[
                  ["Skill evidence", "/portfolio"],
                  ["Approved lessons", "/learn"],
                  ["Practical evidence", "/evidence"],
                  ["AI practice interview", "/interview"],
                ].map(([label, href], i) => (
                  <div key={href}><span className="path-dot">{i + 1}</span><p><b>{label}</b><small>Open your current records</small></p><Link href={href}><Play /> Open</Link></div>
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
              {summary.matches.length === 0 && <p>No opportunity matches have been recorded yet. Explore published roles to get started.</p>}
              {summary.matches.map((job) => (
                <div className="job" key={job.job_id}>
                  <div className="company-mark"><BriefcaseBusiness /></div>
                  <div><b>{job.jobs?.title ?? "Unavailable listing"}</b><small>{typeof job.jobs?.location === "string" ? job.jobs.location : "See listing for location"}</small></div>
                  <strong>{job.score}<small>recorded score</small></strong>
                </div>
              ))}
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
                <span className={`ai-state ${aiStatus}`}>
                  {aiStatus === "loading"
                    ? "THINKING"
                    : aiStatus === "degraded"
                      ? "SAFE FALLBACK"
                      : aiStatus === "error"
                        ? "RECONNECT"
                        : aiStatus === "live"
                          ? "LIVE"
                          : "READY"}
                </span>
              </div>
              <p>
                Ask for a learning plan or help understanding a skill. Coaching is guidance, not a verified assessment or hiring decision.
              </p>
              {answer && (
                <div className={`coach-answer ${aiStatus}`}>
                  {answer}
                  {(aiStatus === "degraded" || aiStatus === "error") && (
                    <button className="ai-retry" onClick={askCoach}>
                      Retry live coaching
                    </button>
                  )}
                </div>
              )}
              <div className="coach-input">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && askCoach()}
                  placeholder={c.placeholder}
                />
                <button onClick={askCoach} disabled={busy} aria-label="Ask Karma AI coach">
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
