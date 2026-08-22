import { notFound } from "next/navigation";

export default function PublicProfile() {
  // Sharing remains closed until expiry, revocation, view limits and consented
  // snapshot rendering are verified as one transaction.
  notFound();
}
