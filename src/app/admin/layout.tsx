import { requirePagePersona } from "@/lib/auth/dal";
export const dynamic = "force-dynamic";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePagePersona("admin");
  return children;
}
