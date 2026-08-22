import { requirePagePersona } from "@/lib/auth/dal";

export default async function LearnerRouteLayout({ children }: { children: React.ReactNode }) {
  await requirePagePersona("learner", "admin");
  return children;
}
