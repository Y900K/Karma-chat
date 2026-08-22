import { requirePagePersona } from "@/lib/auth/dal";
export const dynamic = "force-dynamic";
export default async function GovernanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePagePersona("government", "admin");
  return children;
}
