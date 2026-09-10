import Link from "next/link";
export default function StudioStatus() {
  return <main style={{maxWidth:800,margin:"60px auto",padding:24}}><h1>Curriculum authoring</h1><p>View your live learning assignments in the workspace. Authoring and publication controls require a reviewed content workflow and are not enabled here; this page does not save or publish content.</p><Link href="/institute#institute-learning">Back to live workspace</Link></main>;
}
