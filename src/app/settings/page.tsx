"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Building2,
  Check,
  ChevronRight,
  CircleUserRound,
  Database,
  Download,
  Eye,
  FilePenLine,
  Languages,
  LockKeyhole,
  LogOut,
  Mail,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import "./settings.css";

type ToggleProps = {
  on: boolean;
  set: (x: boolean) => void;
  label: string;
  detail: string;
  purpose?: string;
};
function Toggle({ on, set, label, detail, purpose }: ToggleProps) {
  const change = async () => {
    const next = !on;
    set(next);
    const sb = createClient();
    if (sb && purpose) {
      const {
        data: { user },
      } = await sb.auth.getUser();
      if (user)
        await sb
          .from("consent_records")
          .insert({
            user_id: user.id,
            purpose,
            granted: next,
            withdrawn_at: next ? null : new Date().toISOString(),
          });
    }
  };
  return (
    <div className="setting-row">
      <p>
        <b>{label}</b>
        <span>{detail}</span>
      </p>
      <button
        className={on ? "toggle on" : "toggle"}
        onClick={change}
        aria-pressed={on}
      >
        <i />
      </button>
    </div>
  );
}
export default function SettingsPage() {
  const [lang, setLang] = useState<"en" | "hi">("en"),
    [displayName, setDisplayName] = useState(""),
    [accountEmail, setAccountEmail] = useState(""),
    [loading, setLoading] = useState(true),
    [saveError, setSaveError] = useState(""),
    [visibility, setVisibility] = useState("matched_employers"),
    [ai, setAi] = useState(true),
    [employer, setEmployer] = useState(true),
    [research, setResearch] = useState(false),
    [email, setEmail] = useState(true),
    [weekly, setWeekly] = useState(true),
    [interviews, setInterviews] = useState(true),
    [quietStart, setQuietStart] = useState("21:00"),
    [quietEnd, setQuietEnd] = useState("08:00");
  useEffect(() => { void (async () => { try { const response=await fetch("/api/account",{cache:"no-store"}); const body=await response.json(); if(!response.ok)throw new Error(body.error); setDisplayName(body.account?.displayName??""); setAccountEmail(body.account?.email??""); setLang(body.account?.preferredLanguage??"en"); setVisibility(body.profile?.profile_visibility??"private"); setAi(body.consents?.ai_personalization??false); setEmployer(body.consents?.employer_visibility??false); setResearch(body.consents?.research??false); setEmail(body.preferences?.email_enabled??true); setInterviews(body.preferences?.interview_reminders??true); setWeekly(body.preferences?.weekly_summary??true); setQuietStart(String(body.preferences?.quiet_hours_start??"21:00").slice(0,5)); setQuietEnd(String(body.preferences?.quiet_hours_end??"08:00").slice(0,5)); } catch(reason){setSaveError(reason instanceof Error?reason.message:"Account information could not be loaded");} finally{setLoading(false);} })(); },[]);
  const c =
    lang === "en"
      ? {
          title: "Your account. Your choices.",
          sub: "Review what KarmaSetu stores, shares and uses—and change your mind at any time.",
          privacy: "Privacy & consent",
          communication: "Communication preferences",
        }
      : {
          title: "आपका account। आपके choices।",
          sub: "KarmaSetu क्या store, share और use करता है, उसे देखें—और कभी भी अपना decision बदलें।",
          privacy: "Privacy और consent",
          communication: "Communication preferences",
        };
  return (
    <main className="set-shell">
      <header>
        <Link href="/dashboard" className="set-brand">
          <span>क</span>
          <div>
            KarmaSetu <b>AI</b>
            <small>ACCOUNT & CONSENT</small>
          </div>
        </Link>
        <div>
          <button onClick={() => setLang(lang === "en" ? "hi" : "en")}>
            <Languages />
            {lang === "en" ? "हिंदी + EN" : "EN + हिंदी"}
          </button>
          <Bell />
          <CircleUserRound />
        </div>
      </header>
      <div className="set-layout">
        <aside>
          <Link href="/dashboard">
            <ArrowLeft />
            Back to dashboard
          </Link>
          <nav>
            {[
              [UserRound, "Profile"],
              [ShieldCheck, "Privacy & consent"],
              [Bell, "Notifications"],
              [Building2, "Organization access"],
              [Database, "Your data"],
              [LockKeyhole, "Security"],
            ].map(([Icon, label], i) => {
              const I = Icon as typeof UserRound;
              return (
                <a
                  className={i === 1 ? "active" : ""}
                  href={`#s${i}`}
                  key={String(label)}
                >
                  <I />
                  {String(label)}
                  <ChevronRight />
                </a>
              );
            })}
          </nav>
          <form action="/auth/signout" method="post">
          <button className="logout" type="submit">
            <LogOut />
            Sign out
          </button>
          </form>
        </aside>
        <section className="set-main">
          <div className="set-title">
            <div>
              <p>
                <ShieldCheck />
                CONTROL CENTER
              </p>
              <h1>{c.title}</h1>
              <span>{c.sub}</span>
            </div>
            <form action="/api/account" method="post">
              <input type="hidden" name="displayName" value={displayName}/>
              <input type="hidden" name="preferredLanguage" value={lang}/>
              <input type="hidden" name="profileVisibility" value={visibility}/>
              <input type="hidden" name="emailEnabled" value={String(email)}/>
              <input type="hidden" name="interviewReminders" value={String(interviews)}/>
              <input type="hidden" name="weeklySummary" value={String(weekly)}/>
              <input type="hidden" name="quietHoursStart" value={quietStart}/>
              <input type="hidden" name="quietHoursEnd" value={quietEnd}/>
              <button type="submit" disabled={loading||displayName.trim().length<2}>
                <Check />Save changes
              </button>
            </form>
          </div>
          <div className="set-grid">
            <article id="s0">
              <div className="card-title">
                <UserRound />
                <div>
                  <h2>Profile & language</h2>
                  <p>Basic information used across your experience.</p>
                </div>
              </div>
              <div className="fields">
                <label>
                  Display name
                  <input value={displayName} onChange={(event)=>setDisplayName(event.target.value)} placeholder="Your display name" />
                </label>
                <label>
                  Account email
                  <span className="locked">
                    <Mail />
                    {accountEmail||"Loading account email…"}
                    <LockKeyhole />
                  </span>
                </label>
                <label>
                  Preferred language
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value as "en" | "hi")}
                  >
                    <option value="en">English + Hinglish</option>
                    <option value="hi">हिंदी + English</option>
                  </select>
                </label>
              </div>
            </article>
            <article id="s1" className="privacy-card">
              <div className="card-title">
                <ShieldCheck />
                <div>
                  <h2>{c.privacy}</h2>
                  <p>
                    Each purpose is independent. Essential account processing
                    cannot be disabled here.
                  </p>
                </div>
              </div>
              <label className="visibility">
                <span>
                  <Eye />
                  <p>
                    <b>Profile visibility</b>
                    <small>Choose who can discover your verified work.</small>
                  </p>
                </span>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                >
                  <option value="private">Private — only me</option>
                  <option value="matched_employers">
                    Matched verified employers
                  </option>
                  <option value="public_link">Expiring public link</option>
                </select>
              </label>
              <Toggle
                on={employer}
                set={setEmployer}
                purpose="employer_visibility"
                label="Employer visibility"
                detail="Allow anonymized matching. Identity is shared only after you accept a request."
              />
              <Toggle
                on={ai}
                set={setAi}
                purpose="ai_personalization"
                label="AI personalization"
                detail="Use your learning and assessment context to explain gaps and recommend next actions."
              />
              <Toggle
                on={research}
                set={setResearch}
                purpose="research"
                label="Privacy-safe research"
                detail="Allow de-identified outcomes to improve program quality. This never affects opportunities."
              />
              <div className="consent-proof">
                <Check />
                <span>
                  <b>Every change is recorded</b>Your consent history includes
                  purpose, policy version, time and withdrawal.
                </span>
                <button>
                  View history
                  <ArrowRight />
                </button>
              </div>
            </article>
            <article id="s2">
              <div className="card-title">
                <Bell />
                <div>
                  <h2>{c.communication}</h2>
                  <p>
                    Critical security and account notices cannot be turned off.
                  </p>
                </div>
              </div>
              <Toggle
                on={email}
                set={setEmail}
                label="Email notifications"
                detail="Application, evidence and account activity."
              />
              <Toggle
                on={interviews}
                set={setInterviews}
                label="Interview reminders"
                detail="Scheduling, rescheduling and preparation alerts."
              />
              <Toggle
                on={weekly}
                set={setWeekly}
                label="Weekly progress summary"
                detail="One summary with readiness changes and next actions."
              />
              <label className="quiet">
                Quiet hours{" "}
                <span>
                  <input type="time" value={quietStart} onChange={(event)=>setQuietStart(event.target.value)} />
                  to
                  <input type="time" value={quietEnd} onChange={(event)=>setQuietEnd(event.target.value)} />
                </span>
              </label>
            </article>
            <article id="s3">
              <div className="card-title">
                <Building2 />
                <div>
                  <h2>Organization access</h2>
                  <p>
                    Institutes and employers with an active, purpose-bound
                    relationship.
                  </p>
                </div>
              </div>
              <div className="org-note">
                <Users />
                Organization relationships appear here only after a verified grant or invitation. No sample organization is shown.
              </div>
            </article>
            <article id="s4" className="data-card">
              <div className="card-title">
                <Database />
                <div>
                  <h2>Your data rights</h2>
                  <p>
                    Request a portable copy, correction or deletion from one
                    place.
                  </p>
                </div>
              </div>
              <button>
                <Download />
                <p>
                  <b>Export my data</b>
                  <span>JSON + documents · secure expiring link</span>
                </p>
                <ArrowRight />
              </button>
              <button>
                <FilePenLine />
                <p>
                  <b>Request a correction</b>
                  <span>
                    Challenge incorrect profile, score or evidence data
                  </span>
                </p>
                <ArrowRight />
              </button>
              <button className="danger">
                <Trash2 />
                <p>
                  <b>Request account deletion</b>
                  <span>
                    Review consequences and retention obligations first
                  </span>
                </p>
                <ArrowRight />
              </button>
            </article>
            <article id="s5">
              <div className="card-title">
                <LockKeyhole />
                <div>
                  <h2>Security</h2>
                  <p>Password, sessions and recent account activity.</p>
                </div>
              </div>
              <button className="security-link">
                Change password
                <ArrowRight />
              </button>
              <button className="security-link">
                Review active sessions
                <ArrowRight />
              </button>
              <div className="security-ok">
                <ShieldCheck />
                <p>
                  <b>Session protected by Supabase authentication.</b>
                  <span>Device and location claims are hidden until a verified session-audit feed is connected.</span>
                </p>
              </div>
            </article>
          </div>
          <div className="rights-note">
            <AlertTriangle />
            <p>
              <b>
                Withdrawing consent will not erase lawful historical records
                immediately.
              </b>
              <span>
                KarmaSetu will stop future optional processing and explain any
                legal or contractual retention that still applies.
              </span>
            </p>
          </div>
          {saveError?<div className="rights-note" role="alert"><AlertTriangle/><p><b>Account data needs attention.</b><span>{saveError}</span></p></div>:null}
        </section>
      </div>
    </main>
  );
}
