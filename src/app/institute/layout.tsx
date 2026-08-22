import { requirePagePersona } from "@/lib/auth/dal";
export const dynamic = "force-dynamic";
export default async function InstituteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePagePersona("institute", "admin");
  return children;
}
