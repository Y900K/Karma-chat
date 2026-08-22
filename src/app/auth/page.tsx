"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Languages,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import "./auth.css";

type Mode = "login" | "signup" | "forgot";
const destinations = {
  learner: "/dashboard",
  institute: "/institute",
  employer: "/employer",
  government: "/governance",
  admin: "/admin",
};
export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login"),
    [lang, setLang] = useState<"en" | "hi">("en"),
    [show, setShow] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const form = new FormData(e.currentTarget),
      email = String(form.get("email") || "").trim(),
      password = String(form.get("password") || "");
    const sb = createClient();
    if (!sb) {
      setError(
        "Supabase is not configured yet. Use the local demo links below.",
      );
      return;
    }
    setBusy(true);
    try {
      if (mode === "forgot") {
        const { error: x } = await sb.auth.resetPasswordForEmail(email, {
          redirectTo: `${location.origin}/auth/callback?next=/auth/reset-password`,
        });
        if (x) throw x;
        setMessage("Password reset link sent. Please check your email.");
        return;
      }
      if (mode === "signup") {
        if (password.length < 10)
          throw new Error("Use at least 10 characters for your password.");
        const { data, error: x } = await sb.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback`,
            data: { persona: "learner" },
          },
        });
        if (x) throw x;
        if (!data.session) {
          setMessage("Account created. Verify your email to continue.");
          return;
        }
        router.push("/onboarding");
        router.refresh();
        return;
      }
      const { data, error: x } = await sb.auth.signInWithPassword({
        email,
        password,
      });
      if (x) throw x;
      const { data: account, error: accountError } = await sb
        .from("user_accounts")
        .select("persona,status")
        .eq("user_id", data.user.id)
        .single();
      if (accountError) throw new Error("Your account role could not be verified.");
      if (account.status !== "active") throw new Error("This account is not active.");
      const persona = account.persona as keyof typeof destinations;
      router.push(destinations[persona] || "/dashboard");
      router.refresh();
    } catch (x) {
      setError(
        x instanceof Error
          ? x.message
          : "Authentication failed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  const c =
    lang === "en"
      ? {
          title:
            mode === "login"
              ? "Welcome back."
              : mode === "signup"
                ? "Create your KarmaSetu account."
                : "Reset your password.",
          sub:
            mode === "login"
              ? "Continue your journey from skill to meaningful work."
              : mode === "signup"
                ? "Your evidence, choices and progress stay under your control."
                : "We’ll send a secure recovery link to your verified email.",
          email: "Email address",
          password: "Password",
          action:
            mode === "login"
              ? "Sign in securely"
              : mode === "signup"
                ? "Create account"
                : "Send reset link",
        }
      : {
          title:
            mode === "login"
              ? "फिर से स्वागत है।"
              : mode === "signup"
                ? "अपना KarmaSetu account बनाएँ।"
                : "Password reset करें।",
          sub:
            mode === "login"
              ? "Skill से meaningful work तक अपनी journey जारी रखें।"
              : mode === "signup"
                ? "आपके evidence, choices और progress पर आपका control रहता है।"
                : "आपके verified email पर secure recovery link भेजा जाएगा।",
          email: "Email address",
          password: "Password",
          action:
            mode === "login"
              ? "Secure sign in"
              : mode === "signup"
                ? "Account बनाएँ"
                : "Reset link भेजें",
        };
  return (
    <main className="auth-shell">
      <section className="auth-story">
        <Link href="/" className="auth-brand">
          <span>क</span>
          <div>
            KarmaSetu <b>AI</b>
            <small>कौशल से करियर तक</small>
          </div>
        </Link>
        <div className="story-copy">
          <p>
            <Sparkles />
            TRUSTED EMPLOYABILITY INFRASTRUCTURE
          </p>
          <h1>
            Build skills.
            <br />
            <em>Prove what you can do.</em>
            <br />
            Reach better work.
          </h1>
          <span>
            One identity connects learning, practical evidence, interviews and
            opportunities—with consent at every step.
          </span>
          <div>
            {[
              "Your data remains yours",
              "AI explains; humans decide",
              "English + हिंदी by design",
            ].map((x) => (
              <p key={x}>
                <Check />
                {x}
              </p>
            ))}
          </div>
        </div>
        <div className="auth-quote">
          “मेरी degree से आगे, अब मेरा काम बोलता है।”
          <small>— Pilot learner story</small>
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-top">
          <Link href="/">← Back to story</Link>
          <button onClick={() => setLang(lang === "en" ? "hi" : "en")}>
            <Languages />
            {lang === "en" ? "हिंदी + EN" : "EN + हिंदी"}
          </button>
        </div>
        <div className="auth-card">
          <span className="secure">
            <ShieldCheck />
            Secure account access
          </span>
          <h2>{c.title}</h2>
          <p>{c.sub}</p>
          {!configured && (
            <div className="demo-note">
              <LockKeyhole />
              <span>
                <b>Local demo mode</b>Connect Supabase keys to activate real
                sign-in. The product previews remain available below.
              </span>
            </div>
          )}
          <form onSubmit={submit}>
            {mode === "signup" && (
              <div className="demo-note">
                <ShieldCheck />
                <span><b>Learner registration</b>Institute, employer and government access is activated only through a verified organization invitation.</span>
              </div>
            )}
            <label>
              {c.email}
              <span>
                <Mail />
                <input
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </span>
            </label>
            {mode !== "forgot" && (
              <label>
                {c.password}
                <span>
                  <LockKeyhole />
                  <input
                    required
                    name="password"
                    type={show ? "text" : "password"}
                    minLength={mode === "signup" ? 10 : 6}
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    aria-label="Show password"
                  >
                    {show ? <EyeOff /> : <Eye />}
                  </button>
                </span>
              </label>
            )}
            {mode === "login" && (
              <button
                type="button"
                className="forgot"
                onClick={() => setMode("forgot")}
              >
                Forgot password?
              </button>
            )}
            {error && <div className="auth-error">{error}</div>}
            {message && <div className="auth-success">{message}</div>}
            <button className="auth-submit" disabled={busy}>
              {busy ? <LoaderCircle className="spin" /> : null}
              {c.action}
              <ArrowRight />
            </button>
          </form>
          <div className="auth-switch">
            {mode === "login" ? (
              <p>
                New to KarmaSetu?{" "}
                <button onClick={() => setMode("signup")}>
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button onClick={() => setMode("login")}>Sign in</button>
              </p>
            )}
          </div>
          {!configured && (
            <div className="demo-links">
              <p>Explore local persona previews</p>
              <div>
                <Link href="/dashboard">Learner</Link>
                <Link href="/institute">Institute</Link>
                <Link href="/employer">Employer</Link>
                <Link href="/governance">Governance</Link>
                <Link href="/admin">Admin</Link>
              </div>
            </div>
          )}
          <small className="legal">
            By continuing, you agree to the Terms and acknowledge the Privacy
            Notice. KarmaSetu never sells learner visibility.
          </small>
        </div>
      </section>
    </main>
  );
}
