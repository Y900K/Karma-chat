import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import "./policy.css";

const policies = {
  privacy: {
    title: "Privacy notice",
    summary: "How KarmaSetu collects, uses, shares and protects personal data.",
    sections: [
      ["What we collect", "Account details, learning activity, evidence you submit, consent choices, opportunity activity and security logs. We do not ask learners to add passwords, government identifiers or unrelated sensitive data to evidence."],
      ["Why we use it", "To provide role-scoped learning and opportunity services, verify evidence, prevent misuse, support learners and produce privacy-safe pilot reporting."],
      ["Sharing and control", "Employers receive identity or contact data only for a declared purpose and after the required learner consent. Institutes and government programs receive only records within their authorized scope."],
      ["Your rights", "You may review, correct, export or request deletion of eligible data, withdraw optional consent, and challenge an automated recommendation through Settings or the public concern form."],
    ],
  },
  terms: {
    title: "Terms of use",
    summary: "The rules that keep learning, evidence and hiring activity trustworthy.",
    sections: [
      ["Accounts", "Use your own account, keep credentials private and provide accurate role and organization information. Partner workspaces require a verified invitation."],
      ["Evidence and content", "Submit work you are authorized to share. Do not fabricate credentials, impersonate another person, upload malware or use the platform to discriminate."],
      ["AI limitations", "AI output is guidance, not a promise of employment or a final high-impact decision. Human review remains available for disputed recommendations."],
      ["Enforcement and disputes", "Access may be limited to protect users or investigate misuse. You can challenge a restriction using the public concern form and receive a human-reviewed response."],
    ],
  },
  accessibility: {
    title: "Accessibility statement",
    summary: "Our direction for an inclusive, keyboard-friendly and bilingual experience.",
    sections: [
      ["Target", "KarmaSetu aims to meet WCAG 2.2 Level AA across public and authenticated journeys, including keyboard operation, visible focus, meaningful labels and adequate contrast."],
      ["Language and media", "Core journeys support English and Hinglish using Devanagari for Hindi words. Approved video resources should include captions or an equivalent transcript wherever available."],
      ["Known work", "Complex data visualizations, legacy dashboard controls and third-party embedded media require continued testing across screen readers, zoom levels and low-bandwidth devices."],
      ["Request help", "Report a barrier through the public concern form. Include the page, assistive technology and desired accommodation when you can; do not include passwords."],
    ],
  },
  retention: {
    title: "Data retention schedule",
    summary: "How long major record categories are kept and the reason for each period.",
    sections: [
      ["Active account records", "Kept while the account is active and then placed into a limited deletion or legal-hold workflow. Optional profile and consent records are removed when no longer needed."],
      ["Learning and evidence", "Kept while needed for the learner's portfolio, verification and an active program. Learners can request deletion where no contractual or fraud-prevention duty applies."],
      ["Security and audit logs", "Kept for a limited security, compliance and incident-response period with access restricted to authorized operators."],
      ["Aggregated pilot metrics", "Privacy-safe aggregate outcomes may be kept for longitudinal evaluation. Small groups are suppressed and individual records are not published."],
    ],
  },
  outcomes: {
    title: "Outcome methodology",
    summary: "How pilot outcomes will be checked, aggregated and published without overstating evidence.",
    sections: [
      ["Publication gate", "KarmaSetu publishes an outcome only after the metric definition, eligible population, measurement window and source are approved. Targets and current scope are always labelled separately from observed outcomes."],
      ["Denominators and follow-up", "Every rate states its denominator. Learners who could not be reached are reported as missing follow-up, not silently counted as successful or unsuccessful."],
      ["Privacy protection", "Groups smaller than 10 are suppressed. Public releases contain aggregates only and never expose a learner, employer or institute record."],
      ["Versioning and correction", "Each release records its period and method version. Material corrections remain traceable and replace—not silently rewrite—the earlier display."],
    ],
  },
  verification: {
    title: "Partner verification standard",
    summary: "The minimum checks required before an institute, employer or government program receives partner access.",
    sections: [
      ["Organization identity", "Verify the legal or public identity, official domain and operating location using authoritative records or an accountable program owner."],
      ["Authorized representative", "Confirm that the invited administrator or recruiter is authorized to act for the organization. Shared public email accounts do not receive privileged access by default."],
      ["Purpose and scope", "Record the approved program, learner cohort, hiring purpose, geography and access expiry. Data outside that scope remains unavailable."],
      ["Ongoing assurance", "Reverify material changes, review suspicious access, expire inactive invitations and remove access when the approved relationship ends."],
    ],
  },
} as const;

export function generateStaticParams() {
  return Object.keys(policies).map((policy) => ({ policy }));
}

export default async function PolicyPage({ params }: { params: Promise<{ policy: string }> }) {
  const { policy } = await params;
  const content = policies[policy as keyof typeof policies];
  if (!content) notFound();
  return <main className="policy-page"><nav><Link href="/"><span>क</span>KarmaSetu <b>AI</b></Link><Link href="/trust"><ArrowLeft/>Trust center</Link></nav><article><p className="policy-version"><ShieldCheck/>PUBLIC COMMITMENT · VERSION 2026-08</p><h1>{content.title}</h1><div className="policy-summary">{content.summary}</div>{content.sections.map(([title, body]) => <section key={title}><h2>{title}</h2><p>{body}</p></section>)}<aside>This plain-language pilot policy is an operational commitment, not a substitute for jurisdiction-specific legal advice. Material changes will receive a new version date.</aside><Link className="policy-report" href="/trust#report">Ask a question or report a concern</Link></article></main>;
}
