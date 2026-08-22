import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const destinations: Record<string, string> = {
  learner: "/onboarding",
  institute: "/institute",
  employer: "/employer",
  government: "/governance",
  admin: "/admin",
};

export async function GET(request: Request) {
  const url = new URL(request.url),
    code = url.searchParams.get("code"),
    requestedNext = url.searchParams.get("next");
  if (code) {
    const sb = await createClient();
    const { error } = sb
      ? await sb.auth.exchangeCodeForSession(code)
      : { error: new Error("Supabase is not configured") };
    if (!error && sb) {
      const {
        data: { user },
      } = await sb.auth.getUser();
      const { data: account } = user
        ? await sb.from("user_accounts").select("persona,status").eq("user_id", user.id).maybeSingle()
        : { data: null };
      if (account?.status && account.status !== "active")
        return NextResponse.redirect(new URL("/auth?error=inactive", url.origin));
      const safeNext = requestedNext?.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : null;
      return NextResponse.redirect(
        new URL(safeNext ?? destinations[account?.persona ?? "learner"] ?? "/dashboard", url.origin),
      );
    }
  }
  return NextResponse.redirect(new URL("/auth?error=verification", url.origin));
}
