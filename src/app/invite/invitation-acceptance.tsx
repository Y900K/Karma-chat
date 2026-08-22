"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, CheckCircle2, KeyRound, LoaderCircle, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import "./invite.css";

const homes: Record<string, string> = {
  institute: "/institute",
  employer: "/employer",
  government: "/governance",
};

export default function InvitationAcceptance({ initialToken }: { initialToken: string }) {
  const router = useRouter();
  const [token, setToken] = useState(initialToken);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState<{ persona: string; organization: string } | null>(null);

  const accept = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (token.trim().length < 32) return setError("Enter the complete invitation token.");
    const sb = createClient();
    if (!sb) return setError("Authentication is not configured.");
    setBusy(true);
    const { data, error: rpcError } = await sb.rpc("accept_organization_invitation", { p_token: token.trim() });
    setBusy(false);
    if (rpcError) return setError(rpcError.message);
    const result = data as { persona: string; organization: string };
    setAccepted(result);
    window.setTimeout(() => {
      router.push(homes[result.persona] ?? "/dashboard");
      router.refresh();
    }, 900);
  };

  return (
    <main className="invite-shell">
      <section className="invite-card">
        <Link href="/" className="invite-brand"><span>क</span>KarmaSetu AI</Link>
        {accepted ? (
          <div className="invite-result">
            <CheckCircle2 />
            <h1>Partner access activated</h1>
            <p>You now have verified {accepted.persona} access for <b>{accepted.organization}</b>.</p>
          </div>
        ) : (
          <>
            <div className="invite-icon"><Building2 /></div>
            <p className="invite-kicker"><ShieldCheck /> VERIFIED ORGANIZATION ACCESS</p>
            <h1>Accept your partner invitation</h1>
            <p>The signed-in email must match the invitation. Organization type and role are checked on the server before access changes.</p>
            <form onSubmit={accept}>
              <label>Invitation token<span><KeyRound /><input value={token} onChange={(event) => setToken(event.target.value)} autoComplete="off" required /></span></label>
              {error ? <div className="invite-error" role="alert">{error}</div> : null}
              <button disabled={busy}>{busy ? <LoaderCircle className="spin" /> : <ShieldCheck />}Accept verified invitation</button>
            </form>
            <small>Public registration cannot activate institute, employer, government or admin privileges.</small>
          </>
        )}
      </section>
    </main>
  );
}
