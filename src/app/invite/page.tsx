import { requirePagePersona } from "@/lib/auth/dal";
import InvitationAcceptance from "./invitation-acceptance";

export default async function InvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  await requirePagePersona("learner");
  const { token = "" } = await searchParams;
  return <InvitationAcceptance initialToken={token} />;
}
