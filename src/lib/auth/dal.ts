import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Persona =
  "learner" | "institute" | "employer" | "government" | "admin";
export type Viewer = {
  id: string;
  email: string | null;
  persona: Persona;
  demo: boolean;
};
export class AuthError extends Error {
  status: number;
  constructor(message = "Authentication required", status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}
function readUnverifiedSessionIdentity(accessToken: string) {
  try {
    const payload = JSON.parse(
      Buffer.from(accessToken.split(".")[1], "base64url").toString("utf8"),
    ) as { sub?: unknown; email?: unknown };
    return typeof payload.sub === "string"
      ? { id: payload.sub, email: typeof payload.email === "string" ? payload.email : null }
      : null;
  } catch {
    return null;
  }
}
export const getViewer = cache(async (): Promise<Viewer | null> => {
  const sb = await createClient();
  if (!sb) {
    if (process.env.NODE_ENV !== "production")
      return {
        id: "00000000-0000-0000-0000-000000000000",
        email: "demo@localhost",
        persona: "learner",
        demo: true,
      };
    return null;
  }
  const { data: sessionData, error: sessionError } = await sb.auth.getSession();
  const session = sessionData.session;
  const identity = session ? readUnverifiedSessionIdentity(session.access_token) : null;
  if (sessionError || !identity) return null;
  const userId = identity.id;
  const email = identity.email;
  // The decoded cookie payload is not authorization. This RLS-protected query
  // must validate its JWT and return only the matching auth.uid() account row.
  const { data: account, error: accountError } = await sb
    .from("user_accounts")
    .select("persona,status")
    .eq("user_id", userId)
    .maybeSingle();
  if (accountError || !account) return null;
  if (account?.status && account.status !== "active")
    throw new AuthError("Account is not active", 403);
  return {
    id: userId,
    email,
    persona: (account?.persona ?? "learner") as Persona,
    demo: false,
  };
});
export async function requireViewer() {
  const viewer = await getViewer();
  if (!viewer) throw new AuthError();
  return viewer;
}
export async function requirePersona(...allowed: Persona[]) {
  const viewer = await requireViewer();
  if (viewer.demo && process.env.NODE_ENV !== "production") return viewer;
  if (!allowed.includes(viewer.persona))
    throw new AuthError("You do not have access to this workspace", 403);
  return viewer;
}
const personaHome: Record<Persona, string> = {
  learner: "/dashboard",
  institute: "/institute",
  employer: "/employer",
  government: "/governance",
  admin: "/admin",
};
export async function requirePagePersona(...allowed: Persona[]) {
  const viewer = await getViewer();
  if (!viewer) redirect("/auth");
  if (viewer.demo && process.env.NODE_ENV !== "production") return viewer;
  if (!allowed.includes(viewer.persona)) redirect(personaHome[viewer.persona]);
  return viewer;
}
export async function requireOrganizationRole(
  organizationId: string,
  kind: "institute" | "employer" | "program",
  roles: string[],
) {
  const viewer = await requireViewer();
  if (viewer.demo && process.env.NODE_ENV !== "production") return viewer;
  const sb = await createClient();
  if (!sb) throw new AuthError();
  const table =
    kind === "institute"
      ? "organization_memberships"
      : kind === "employer"
        ? "employer_memberships"
        : "program_memberships";
  const { data } = await sb
    .from(table)
    .select("role,status")
    .eq("organization_id", organizationId)
    .eq("user_id", viewer.id)
    .eq("status", "active")
    .maybeSingle();
  if (!data || !roles.includes(String(data.role)))
    throw new AuthError("Required organization role is missing", 403);
  return viewer;
}
