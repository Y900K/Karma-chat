import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/onboarding",
  "/diagnostic",
  "/learn",
  "/evidence",
  "/interview",
  "/opportunities",
  "/roles",
  "/portfolio",
  "/resume",
  "/schedule",
  "/settings",
  "/notifications",
  "/invite",
  "/institute",
  "/employer",
  "/governance",
  "/admin",
];
const personaHome: Record<string, string> = {
  learner: "/dashboard",
  institute: "/institute",
  employer: "/employer",
  government: "/governance",
  admin: "/admin",
};
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    isProtected = protectedRoutes.some(
      (path) =>
        request.nextUrl.pathname === path ||
        request.nextUrl.pathname.startsWith(`${path}/`),
    );
  if (!url || !key) {
    if (process.env.NODE_ENV === "production" && isProtected)
      return NextResponse.json(
        { error: "Authentication service is not configured" },
        { status: 503 },
      );
    return NextResponse.next();
  }
  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user && isProtected) {
    const login = request.nextUrl.clone();
    login.pathname = "/auth";
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  if (user && request.nextUrl.pathname === "/auth") {
    const { data: account } = await supabase
      .from("user_accounts")
      .select("persona,status")
      .eq("user_id", user.id)
      .maybeSingle();
    const destination = account?.status === "active" ? personaHome[account.persona] : null;
    return NextResponse.redirect(new URL(destination || "/dashboard", request.url));
  }
  return response;
}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
