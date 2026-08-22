import { createHash, randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

if (!process.argv.includes("--confirm")) {
  console.error("Refusing to create temporary P0 fixtures without --confirm");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !publishable || !serviceRole) throw new Error("Supabase audit environment is incomplete");

const admin = createClient(url, serviceRole, { auth: { persistSession: false, autoRefreshToken: false } });
const client = createClient(url, publishable, { auth: { persistSession: false, autoRefreshToken: false } });
const tag = `p0-${Date.now()}-${randomBytes(3).toString("hex")}`;
const inviterEmail = `${tag}-owner@example.com`;
const inviteeEmail = `${tag}-partner@example.com`;
const password = randomBytes(24).toString("base64url");
const token = randomBytes(32).toString("base64url");
const tokenHash = createHash("sha256").update(token).digest("hex");
let inviter;
let invitee;
let organization;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function cleanupAuditFixtures() {
  const { data: organizations, error: organizationReadError } = await admin.from("organizations").select("id").like("name", "P0 Employer p0-%");
  if (organizationReadError) throw organizationReadError;
  const organizationIds = (organizations ?? []).map((item) => item.id);
  if (organizationIds.length) {
    const { error: auditDeleteError } = await admin.from("audit_events").delete().in("organization_id", organizationIds).eq("action", "organization_invitation.accepted");
    if (auditDeleteError) throw auditDeleteError;
    const { error: organizationDeleteError } = await admin.from("organizations").delete().in("id", organizationIds);
    if (organizationDeleteError) throw organizationDeleteError;
  }
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    const fixtures = data.users.filter((user) => /^p0-\d+-[a-f0-9]+-(owner|partner)@example\.com$/.test(user.email ?? ""));
    for (const user of fixtures) {
      const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
      if (deleteError) throw deleteError;
    }
    if (data.users.length < 100) break;
  }
}

try {
  await cleanupAuditFixtures();
  const inviterResult = await admin.auth.admin.createUser({ email: inviterEmail, password, email_confirm: true });
  if (inviterResult.error) throw inviterResult.error;
  inviter = inviterResult.data.user;
  const inviteeResult = await admin.auth.admin.createUser({ email: inviteeEmail, password, email_confirm: true, user_metadata: { persona: "employer" } });
  if (inviteeResult.error) throw inviteeResult.error;
  invitee = inviteeResult.data.user;

  const { data: initialAccount, error: initialError } = await admin.from("user_accounts").select("persona").eq("user_id", invitee.id).single();
  if (initialError) throw initialError;
  assert(initialAccount.persona === "learner", "new-user trigger accepted privileged metadata");

  const organizationResult = await admin.from("organizations").insert({ name: `P0 Employer ${tag}`, organization_type: "employer", verification_status: "verified" }).select("id,name").single();
  if (organizationResult.error) throw organizationResult.error;
  organization = organizationResult.data;
  const { error: invitationError } = await admin.from("organization_invitations").insert({ organization_id: organization.id, email: inviteeEmail, role: "recruiter", token_hash: tokenHash, invited_by: inviter.id });
  if (invitationError) throw invitationError;

  const { error: signInError } = await client.auth.signInWithPassword({ email: inviteeEmail, password });
  if (signInError) throw signInError;
  const { error: escalationError } = await client.from("user_accounts").update({ persona: "admin" }).eq("user_id", invitee.id);
  assert(Boolean(escalationError), "authenticated user retained direct persona-update privilege");

  const { error: profileError } = await client.rpc("update_own_account_profile", { p_display_name: "P0 Partner", p_preferred_language: "hi" });
  if (profileError) throw profileError;
  const { data: updatedProfile } = await admin.from("user_accounts").select("display_name,preferred_language,persona").eq("user_id", invitee.id).single();
  assert(updatedProfile?.display_name === "P0 Partner" && updatedProfile?.preferred_language === "hi" && updatedProfile?.persona === "learner", "safe profile RPC changed protected identity fields");

  const { error: wrongTokenError } = await client.rpc("accept_organization_invitation", { p_token: randomBytes(32).toString("base64url") });
  assert(Boolean(wrongTokenError), "invalid invitation token was accepted");

  const { data: acceptance, error: acceptanceError } = await client.rpc("accept_organization_invitation", { p_token: token });
  if (acceptanceError) throw acceptanceError;
  assert(acceptance.persona === "employer", "invitation did not activate employer persona");
  const [{ data: finalAccount }, { data: membership }] = await Promise.all([
    admin.from("user_accounts").select("persona").eq("user_id", invitee.id).single(),
    admin.from("employer_memberships").select("role,status").eq("organization_id", organization.id).eq("user_id", invitee.id).single(),
  ]);
  assert(finalAccount?.persona === "employer", "partner persona was not persisted");
  assert(membership?.role === "recruiter" && membership?.status === "active", "partner membership was not activated");
  const { error: replayError } = await client.rpc("accept_organization_invitation", { p_token: token });
  assert(Boolean(replayError), "accepted invitation could be replayed");
  console.log(JSON.stringify({ passed: true, initialPersona: "learner", directEscalationBlocked: true, safeProfileUpdate: true, invalidTokenBlocked: true, invitationPersona: acceptance.persona, membership: membership.status, replayBlocked: true }));
} finally {
  await client.auth.signOut();
  await cleanupAuditFixtures();
}
