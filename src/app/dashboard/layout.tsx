import { requirePagePersona } from "@/lib/auth/dal";

export const dynamic = "force-dynamic";

export default async function LearnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePagePersona("learner", "admin");
  return children;
}
