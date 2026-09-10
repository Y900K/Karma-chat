import Link from "next/link";
export default function StudioStatus() {
  return <main style={{maxWidth:800,margin:"60px auto",padding:24}}><h1>Hiring studio</h1><p>View the live hiring pipeline in your workspace. Creating jobs and recording hiring decisions through this studio are not enabled yet; no draft or decision will be saved from this page.</p><Link href="/employer#employer-pipeline">Back to live workspace</Link></main>;
}
