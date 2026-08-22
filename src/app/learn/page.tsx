"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  CirclePlay,
  Download,
  ExternalLink,
  FileText,
  Languages,
  Lightbulb,
  ListChecks,
  LockKeyhole,
  Menu,
  MessageCircleMore,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { completeLesson } from "@/app/actions/learner";
import { LearnerReturnLink } from "@/components/workspace-utilities";
import "./learn.css";

type Lang = "en" | "hi";
type Lesson = {
  id: string;
  type: "video" | "reading" | "practice";
  title: { en: string; hi: string };
  duration: string;
  done: boolean;
};
const units: {
  id: string;
  title: { en: string; hi: string };
  status: "done" | "active" | "locked";
  lessons: Lesson[];
}[] = [
  {
    id: "safety",
    title: { en: "Safety foundations", hi: "Safety foundations" },
    status: "done",
    lessons: [
      {
        id: "loto",
        type: "video",
        title: { en: "Lockout and isolation", hi: "Lockout और isolation" },
        duration: "08:12",
        done: true,
      },
      {
        id: "ppe",
        type: "reading",
        title: { en: "PPE selection guide", hi: "PPE selection guide" },
        duration: "6 min",
        done: true,
      },
    ],
  },
  {
    id: "drawings",
    title: { en: "Electrical drawings", hi: "Electrical drawings" },
    status: "active",
    lessons: [
      {
        id: "symbols",
        type: "video",
        title: { en: "Reading control symbols", hi: "Control symbols पढ़ना" },
        duration: "08:42",
        done: false,
      },
      {
        id: "worksheet",
        type: "reading",
        title: { en: "Symbol reference sheet", hi: "Symbol reference sheet" },
        duration: "PDF",
        done: false,
      },
      {
        id: "check",
        type: "practice",
        title: { en: "Knowledge checkpoint", hi: "Knowledge checkpoint" },
        duration: "5 questions",
        done: false,
      },
    ],
  },
  {
    id: "meters",
    title: { en: "Measurement and meters", hi: "Measurement और meters" },
    status: "locked",
    lessons: [
      {
        id: "multimeter",
        type: "video",
        title: { en: "Multimeter essentials", hi: "Multimeter essentials" },
        duration: "11:20",
        done: false,
      },
    ],
  },
  {
    id: "evidence",
    title: { en: "Practical evidence", hi: "Practical evidence" },
    status: "locked",
    lessons: [
      {
        id: "board",
        type: "practice",
        title: { en: "Wiring-board project", hi: "Wiring-board project" },
        duration: "Project",
        done: false,
      },
    ],
  },
];
const lesson = units[1].lessons[0];

type ApprovedResource = {
  provider: "youtube" | "google_drive";
  external_id: string;
  embed_url: string;
  captions_available: boolean;
  text_fallback: string | null;
};
export default function Learn() {
  const [lang, setLang] = useState<Lang>("en"),
    [completed, setCompleted] = useState(false),
    [note, setNote] = useState(""),
    [quiz, setQuiz] = useState<number | null>(null),
    [saved, setSaved] = useState(false),
    [resources, setResources] = useState<ApprovedResource[]>([]),
    [resourceError, setResourceError] = useState("");
  const video = resources.find((x) => x.provider === "youtube"),
    drive = resources.find((x) => x.provider === "google_drive");
  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/learning/lesson?id=symbols", {
          cache: "no-store",
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error);
        setResources(body.resources ?? []);
      } catch (reason) {
        setResourceError(
          reason instanceof Error
            ? reason.message
            : "Approved resources could not be loaded",
        );
      }
    })();
  }, []);
  const markComplete = async () => {
    await completeLesson(
      { lessonId: lesson.id, progressPercent: 100, lastPositionSeconds: 522 },
      crypto.randomUUID(),
    );
    setCompleted(true);
  };
  const c =
    lang === "en"
      ? {
          path: "MY LEARNING PATH",
          title: "Close the gaps that matter.",
          sub: "Built from your Industrial Electrician diagnostic",
          lesson: "Reading industrial control symbols",
          about:
            "In this lesson, you’ll learn to recognize the symbols that appear in starter and control circuits—and trace how current moves through the drawing.",
          outcomes: "After this lesson, you can",
          complete: "Mark lesson complete",
          done: "Lesson completed",
          resources: "Lesson resources",
          notes: "My notes",
          placeholder: "Write a note in your own words…",
          save: "Save note",
        }
      : {
          path: "मेरा LEARNING PATH",
          title: "सिर्फ़ ज़रूरी gaps पूरे करें।",
          sub: "आपके Industrial Electrician diagnostic से बना path",
          lesson: "Industrial control symbols पढ़ना",
          about:
            "इस lesson में आप starter और control circuits के symbols पहचानना और drawing में current का flow trace करना सीखेंगे।",
          outcomes: "इस lesson के बाद आप",
          complete: "Lesson complete करें",
          done: "Lesson पूरा हुआ",
          resources: "Lesson resources",
          notes: "मेरे notes",
          placeholder: "अपने शब्दों में note लिखें…",
          save: "Note save करें",
        };
  return (
    <main className="learn-shell">
      <header>
        <Link href="/dashboard" className="learn-brand">
          <span>क</span>
          <div>
            KarmaSetu <b>AI</b>
            <small>कौशल से करियर तक</small>
          </div>
        </Link>
        <div className="learn-actions">
          <LearnerReturnLink />
          <span>
            <Sparkles />
            3-day learning streak
          </span>
          <button onClick={() => setLang(lang === "en" ? "hi" : "en")}>
            <Languages />
            {lang === "en" ? "हिंदी + EN" : "EN + हिंदी"}
          </button>
          <button aria-label="Menu">
            <Menu />
          </button>
        </div>
      </header>
      <div className="learn-layout">
        <aside className="curriculum">
          <Link href="/dashboard">
            <ArrowLeft />
            Dashboard
          </Link>
          <p>{c.path}</p>
          <h1>{c.title}</h1>
          <span>{c.sub}</span>
          <div className="overall">
            <div>
              <b>64%</b>
              <small>path complete</small>
            </div>
            <i>
              <span />
            </i>
          </div>
          <div className="unit-list">
            {units.map((u, ui) => (
              <section key={u.id} className={u.status}>
                <button>
                  <i>
                    {u.status === "done" ? (
                      <Check />
                    ) : u.status === "locked" ? (
                      <LockKeyhole />
                    ) : (
                      ui + 1
                    )}
                  </i>
                  <p>
                    <b>{lang === "en" ? u.title.en : u.title.hi}</b>
                    <small>
                      {u.status === "done"
                        ? "Completed"
                        : u.status === "active"
                          ? "3 lessons · In progress"
                          : "Complete previous unit"}
                    </small>
                  </p>
                  <ChevronDown />
                </button>
                {u.status === "active" && (
                  <div>
                    {u.lessons.map((l, i) => (
                      <a
                        className={i === 0 ? "current" : ""}
                        href={`#${l.id}`}
                        key={l.id}
                      >
                        {l.type === "video" ? (
                          <CirclePlay />
                        ) : l.type === "reading" ? (
                          <FileText />
                        ) : (
                          <ListChecks />
                        )}
                        <p>
                          <b>{lang === "en" ? l.title.en : l.title.hi}</b>
                          <small>{l.duration}</small>
                        </p>
                        {l.done && <CheckCircle2 />}
                      </a>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </aside>
        <section className="lesson-main">
          <div className="lesson-breadcrumb">
            <span>Electrical drawings</span>
            <ArrowRight />
            <b>Lesson 1</b>
          </div>
          <div className="lesson-heading">
            <div>
              <p>VIDEO LESSON · 08:42</p>
              <h2>{c.lesson}</h2>
              <span>Skill: Control-circuit interpretation · Foundation</span>
            </div>
            <div className="verified">
              <ShieldCheck />
              <span>
                <b>Reviewed content</b>
                <small>Technical reviewer · Aug 2026</small>
              </span>
            </div>
          </div>
          <div className="media-grid">
            <article className="player">
              {video ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.external_id}?rel=0&playsinline=1&hl=${lang}`}
                  title={c.lesson}
                  allow="accelerometer; encrypted-media; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div className="player-placeholder">
                  <LockKeyhole />
                  <p>
                    <b>No approved video yet</b>
                    <span>
                      {resourceError ||
                        "A reviewed YouTube resource will appear after registry approval."}
                    </span>
                  </p>
                </div>
              )}
              <div className="player-foot">
                <span>
                  CC ·{" "}
                  {video?.captions_available
                    ? lang === "en"
                      ? "English / हिंदी captions"
                      : "हिंदी / English captions"
                    : "Caption status not verified"}
                </span>
                <small>
                  External playback begins only after you press play.
                </small>
              </div>
            </article>
            <aside className="lesson-side">
              <h3>{c.resources}</h3>
              <a
                className={!drive ? "disabled" : ""}
                href={drive?.embed_url || "#"}
                target={drive ? "_blank" : undefined}
                rel="noreferrer"
              >
                <FileText />
                <p>
                  <b>Control symbol reference</b>
                  <span>
                    {drive
                      ? "Approved Google Drive resource"
                      : "No approved Drive resource"}
                  </span>
                </p>
                {drive ? <ExternalLink /> : <LockKeyhole />}
              </a>
              <button disabled={!video?.text_fallback}>
                <Download />
                <p>
                  <b>Low-bandwidth lesson notes</b>
                  <span>
                    {video?.text_fallback
                      ? "Approved text fallback available"
                      : "Text fallback awaiting review"}
                  </span>
                </p>
              </button>
              <div className="resource-safety">
                <ShieldCheck />
                Only valid, staff-approved registry resources appear here.
              </div>
            </aside>
          </div>
          <div className="lesson-columns">
            <article className="lesson-copy">
              <h3>Why this matters</h3>
              <p>{c.about}</p>
              <h3>{c.outcomes}</h3>
              <ul>
                <li>
                  <Check />
                  Identify NO, NC, coil and overload symbols
                </li>
                <li>
                  <Check />
                  Trace a basic start/stop control circuit
                </li>
                <li>
                  <Check />
                  Spot an unsafe or incomplete drawing
                </li>
              </ul>
              <div className="coach-tip">
                <MessageCircleMore />
                <p>
                  <b>Karma tip</b>
                  <span>
                    Say each symbol’s function aloud while tracing the circuit.
                    It improves both recall and interview explanation.
                  </span>
                </p>
              </div>
            </article>
            <article className="checkpoint">
              <p>PRACTICE CHECK</p>
              <h3>What happens when the START push button is pressed?</h3>
              {[
                "The contact opens and removes power",
                "The NO contact closes and energizes the coil",
                "The overload relay always trips",
              ].map((x, i) => (
                <button
                  key={x}
                  className={quiz === i ? (i === 1 ? "correct" : "wrong") : ""}
                  onClick={() => setQuiz(i)}
                >
                  <i>{String.fromCharCode(65 + i)}</i>
                  {x}
                  {quiz === i && <Check />}
                </button>
              ))}
              {quiz !== null && (
                <div className={quiz === 1 ? "feedback good" : "feedback"}>
                  <Lightbulb />
                  <span>
                    <b>{quiz === 1 ? "Correct" : "Not quite"}</b>The
                    normally-open START contact closes while pressed, allowing
                    current to energize the contactor coil.
                  </span>
                </div>
              )}
            </article>
          </div>
          <div className="notes-complete">
            <article>
              <div>
                <BookOpen />
                <h3>{c.notes}</h3>
              </div>
              <textarea
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  setSaved(false);
                }}
                placeholder={c.placeholder}
              />
              <button onClick={() => setSaved(true)} disabled={!note.trim()}>
                {saved ? (
                  <>
                    <Check />
                    Saved locally for this session
                  </>
                ) : (
                  c.save
                )}
              </button>
            </article>
            <article className={completed ? "completed" : ""}>
              <Trophy />
              <p>
                <b>{completed ? c.done : "Ready for the next step?"}</b>
                <span>
                  {completed
                    ? "Your learning path and dashboard are updated."
                    : "Complete the practice check, then record this lesson."}
                </span>
              </p>
              <button disabled={quiz !== 1 || completed} onClick={markComplete}>
                {completed ? <Check /> : null}
                {completed ? c.done : c.complete}
              </button>
            </article>
          </div>
          <footer className="lesson-footer">
            <button disabled>
              <ArrowLeft />
              Previous lesson
            </button>
            <span>Lesson 1 of 3 · Electrical drawings</span>
            <button>
              Next: Reference sheet
              <ArrowRight />
            </button>
          </footer>
        </section>
      </div>
    </main>
  );
}
