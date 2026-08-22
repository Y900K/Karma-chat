"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  IndianRupee,
  Languages,
  LockKeyhole,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrainFront,
  TriangleAlert,
  Wrench,
  X,
} from "lucide-react";
import { submitApplication } from "@/app/actions/learner";
import { createClient } from "@/lib/supabase/client";
import "./opportunities.css";

type Lang = "en" | "hi";
type Job = {
  id: string;
  role: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  match: number;
  verified: boolean;
  skills: string[];
  missing: string[];
  why: string[];
  shift: string;
  posted: string;
};
export default function Opportunities() {
  const [lang, setLang] = useState<Lang>("en"),
    [jobs, setJobs] = useState<Job[]>([]),
    [selected, setSelected] = useState<Job | null>(null),
    [query, setQuery] = useState(""),
    [onlyStrong, setOnlyStrong] = useState(false),
    [apply, setApply] = useState(false),
    [consent, setConsent] = useState(false),
    [applied, setApplied] = useState<string[]>([]),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    const initial = window.setTimeout(async () => {
      const supabase = createClient();
      if (!supabase) {
        setError("Opportunity data is not configured.");
        setLoading(false);
        return;
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Please sign in to view your matches.");
        setLoading(false);
        return;
      }
      const [matchResult, applicationResult] = await Promise.all([
        supabase
          .from("opportunity_matches")
          .select("score,explanation,missing_signals,jobs(id,title,location,work_type,shift_details,salary_min,salary_max,currency,requirements,organizations(name,verification_status))")
          .eq("user_id", user.id)
          .order("score", { ascending: false }),
        supabase.from("applications").select("job_id").eq("user_id", user.id),
      ]);
      if (matchResult.error || applicationResult.error) {
        setError("Your live opportunity matches could not be loaded.");
        setLoading(false);
        return;
      }
      const mapped = (matchResult.data ?? []).flatMap((row) => {
        const job = row.jobs as unknown as {
          id: string;
          title: string;
          location: string;
          work_type: string;
          shift_details: string | null;
          salary_min: number;
          salary_max: number;
          currency: string;
          requirements: unknown;
          organizations: { name: string; verification_status: string } | null;
        } | null;
        if (!job) return [];
        const requirements = job.requirements as { skills?: string[] } | string[] | null;
        const explanation = row.explanation as { reasons?: string[] } | string[] | null;
        const missing = row.missing_signals as { labels?: string[] } | string[] | null;
        return [{
          id: job.id,
          role: job.title,
          company: job.organizations?.name ?? "Verified employer",
          location: job.location,
          salary: `₹${job.salary_min.toLocaleString("en-IN")}–${job.salary_max.toLocaleString("en-IN")} / month`,
          type: job.work_type.replaceAll("_", " "),
          match: row.score,
          verified: job.organizations?.verification_status === "verified",
          skills: Array.isArray(requirements) ? requirements : requirements?.skills ?? [],
          missing: Array.isArray(missing) ? missing : missing?.labels ?? [],
          why: Array.isArray(explanation) ? explanation : explanation?.reasons ?? ["Matched from your current verified Skill Graph"],
          shift: job.shift_details ?? "See role details",
          posted: "Live listing",
        } satisfies Job];
      });
      setJobs(mapped);
      setSelected(mapped[0] ?? null);
      setApplied((applicationResult.data ?? []).map((item) => item.job_id));
      setLoading(false);
    }, 0);
    return () => window.clearTimeout(initial);
  }, []);
  const filtered = useMemo(
    () =>
      jobs.filter(
        (j) =>
          (!onlyStrong || j.match >= 80) &&
          `${j.role} ${j.company} ${j.location}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [jobs, query, onlyStrong],
  );
  const submit = async () => {
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      await submitApplication(selected.id, crypto.randomUUID());
      setApplied((v) => [...v, selected.id]);
      setApply(false);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The application could not be submitted.");
    } finally {
      setBusy(false);
    }
  };
  const c =
    lang === "en"
      ? {
          title: "Opportunities that fit the evidence—not just the résumé.",
          sub: "Every match explains what aligns, what is missing and what you control before sharing.",
          search: "Search role, company or location",
          matches: "Recommended for you",
          why: "Why this match",
          missing: "What would strengthen it",
          skills: "Role requirements",
          apply: "Review and apply",
          applied: "Application submitted",
          control: "You control what is shared",
        }
      : {
          title:
            "ऐसी opportunities जो résumé नहीं, evidence से match होती हैं।",
          sub: "हर match बताता है कि क्या align होता है, क्या missing है और share करने से पहले control आपका है।",
          search: "Role, company या location search करें",
          matches: "आपके लिए recommended",
          why: "यह match क्यों",
          missing: "इसे क्या मज़बूत बनाएगा",
          skills: "Role requirements",
          apply: "Review करके apply करें",
          applied: "Application submit हुई",
          control: "क्या share हो, यह आप तय करते हैं",
        };
  if (loading)
    return <main className="opp-shell"><section className="opp-hero"><div><p>LIVE OPPORTUNITIES</p><h1>Loading your verified matches…</h1></div></section></main>;
  if (!selected)
    return <main className="opp-shell"><header><Link href="/dashboard" className="opp-brand"><span>क</span><div>KarmaSetu <b>AI</b><small>कौशल से करियर तक</small></div></Link></header><section className="opp-hero"><div><p>LIVE OPPORTUNITIES</p><h1>No verified matches yet.</h1><span>{error || "Complete your diagnostic and evidence steps. New published roles will appear here automatically."}</span></div></section></main>;
  return (
    <main className="opp-shell">
      <header>
        <Link href="/dashboard" className="opp-brand">
          <span>क</span>
          <div>
            KarmaSetu <b>AI</b>
            <small>कौशल से करियर तक</small>
          </div>
        </Link>
        <div>
          <span>
            <ShieldCheck />
            Verified employers only
          </span>
          <button onClick={() => setLang(lang === "en" ? "hi" : "en")}>
            <Languages />
            {lang === "en" ? "हिंदी + EN" : "EN + हिंदी"}
          </button>
        </div>
      </header>
      <section className="opp-hero">
        <div>
          <p>
            <Sparkles />
            EXPLAINABLE OPPORTUNITY MATCHING
          </p>
          <h1>{c.title}</h1>
          <span>{c.sub}</span>
        </div>
        <aside>
          <div>
            <b>{jobs.length}</b>
            <span>relevant roles</span>
          </div>
          <div>
            <b>{jobs.filter((job) => job.match >= 80).length}</b>
            <span>strong matches</span>
          </div>
        </aside>
      </section>
      <section className="opp-layout">
        <aside className="opp-list">
          <div className="opp-tools">
            <label>
              <Search />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={c.search}
              />
            </label>
            <button
              className={onlyStrong ? "active" : ""}
              onClick={() => setOnlyStrong(!onlyStrong)}
            >
              <SlidersHorizontal />
              80%+ match
            </button>
          </div>
          <div className="list-title">
            <p>
              <b>{c.matches}</b>
              <span>{filtered.length} shown · Updated today</span>
            </p>
            <CircleHelp />
          </div>
          {filtered.map((job) => (
            <button
              className={`job-card ${selected.id === job.id ? "selected" : ""}`}
              key={job.id}
              onClick={() => setSelected(job)}
            >
              <div className="job-logo">{job.company[0]}</div>
              <div>
                <span>
                  {job.verified && (
                    <>
                      <CheckCircle2 />
                      VERIFIED MSME
                    </>
                  )}
                </span>
                <h2>{job.role}</h2>
                <p>{job.company}</p>
                <small>
                  <MapPin />
                  {job.location}
                  <IndianRupee />
                  {job.salary}
                </small>
                <div>
                  <em>{job.type}</em>
                  <em>{job.shift}</em>
                </div>
              </div>
              <strong>
                {job.match}%<small>match</small>
              </strong>
            </button>
          ))}
        </aside>
        <article className="opp-detail">
          <div className="detail-top">
            <div className="company-logo">{selected.company[0]}</div>
            <div>
              <span>
                <CheckCircle2 />
                VERIFIED EMPLOYER
              </span>
              <h2>{selected.role}</h2>
              <p>{selected.company}</p>
            </div>
            <div
              className="match-ring"
              style={{
                background: `conic-gradient(#25b5a6 ${selected.match}%,#e1eae6 0)`,
              }}
            >
              <b>{selected.match}%</b>
              <small>match</small>
            </div>
          </div>
          <div className="job-facts">
            <span>
              <MapPin />
              <b>Location</b>
              <small>{selected.location}</small>
            </span>
            <span>
              <IndianRupee />
              <b>Salary</b>
              <small>{selected.salary}</small>
            </span>
            <span>
              <Clock3 />
              <b>Work type</b>
              <small>{selected.type}</small>
            </span>
            <span>
              <TrainFront />
              <b>Shift</b>
              <small>{selected.shift}</small>
            </span>
          </div>
          <div className="explain-box">
            <div>
              <Target />
              <p>
                <b>{c.why}</b>
                <span>Based on your current Skill Graph and preferences</span>
              </p>
            </div>
            {selected.why.map((x) => (
              <p key={x}>
                <Check />
                {x}
              </p>
            ))}
          </div>
          <div className="detail-columns">
            <section>
              <h3>{c.skills}</h3>
              {selected.skills.map((x) => (
                <div className="skill-row" key={x}>
                  <CheckCircle2 />
                  <p>
                    <b>{x}</b>
                    <span>Evidence found in your Skill Graph</span>
                  </p>
                  <em>Matched</em>
                </div>
              ))}
            </section>
            <section>
              <h3>{c.missing}</h3>
              {selected.missing.map((x) => (
                <div className="gap-row" key={x}>
                  <TriangleAlert />
                  <p>
                    <b>{x}</b>
                    <span>Not a rejection—this is an improvement signal.</span>
                  </p>
                </div>
              ))}
              <Link href="/evidence">
                <Wrench />
                Strengthen my evidence
                <ChevronRight />
              </Link>
            </section>
          </div>
          <div className="role-summary">
            <h3>About the role</h3>
            <p>
              Support preventive maintenance, read basic electrical drawings,
              diagnose safe entry-level faults and document completed work under
              a senior technician.
            </p>
            <h3>Eligibility</h3>
            <ul>
              <li>ITI Electrician or related trade</li>
              <li>0–1 year experience; freshers welcome</li>
              <li>Comfortable with documented safety procedures</li>
            </ul>
          </div>
          <footer>
            <div>
              <LockKeyhole />
              <p>
                <b>{c.control}</b>
                <span>
                  The employer sees nothing until you review and confirm.
                </span>
              </p>
            </div>
            <button
              onClick={() => setApply(true)}
              disabled={applied.includes(selected.id)}
            >
              {applied.includes(selected.id) ? (
                <>
                  <Check />
                  {c.applied}
                </>
              ) : (
                <>
                  {c.apply}
                  <ArrowRight />
                </>
              )}
            </button>
          </footer>
        </article>
      </section>
      {apply && (
        <div
          className="apply-modal"
          onMouseDown={(e) => e.target === e.currentTarget && setApply(false)}
        >
          <section>
            <button className="close" onClick={() => setApply(false)}>
              <X />
            </button>
            <p>BEFORE YOU APPLY</p>
            <h2>{c.control}</h2>
            <span>
              Review the exact information Apex Motion Systems will receive for
              this application.
            </span>
            <div className="share-list">
              <div>
                <Check />
                <p>
                  <b>Basic profile</b>
                  <small>Name, trade, education and location preference</small>
                </p>
              </div>
              <div>
                <Check />
                <p>
                  <b>JobReady dimensions</b>
                  <small>
                    Scores, versions and plain-language explanations
                  </small>
                </p>
              </div>
              <div>
                <Check />
                <p>
                  <b>Verified evidence only</b>
                  <small>
                    Approved project title, rubric outcome and reviewer status
                  </small>
                </p>
              </div>
              <div className="not-shared">
                <X />
                <p>
                  <b>Not shared</b>
                  <small>
                    Private notes, AI conversations, raw diagnostic answers or
                    unrelated files
                  </small>
                </p>
              </div>
            </div>
            <button
              className={`consent ${consent ? "checked" : ""}`}
              onClick={() => setConsent(!consent)}
            >
              <i>{consent && <Check />}</i>
              <span>
                I choose to share the listed information with {selected.company}{" "}
                for this role. I can withdraw before employer review begins.
              </span>
            </button>
            {error ? <div className="auth-error" role="alert">{error}</div> : null}
            <button
              className="confirm-apply"
              disabled={!consent || busy}
              onClick={submit}
            >
              {busy ? "Submitting securely…" : "Confirm and apply"}
              <ArrowRight />
            </button>
            <small>No automatic application. No automatic rejection.</small>
          </section>
        </div>
      )}
    </main>
  );
}
