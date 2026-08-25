import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";

const mode = process.argv[2];
if (!['seed', 'cleanup'].includes(mode) || !process.argv.includes('--confirm')) {
  console.error('Usage: node scripts/audit-fixture.mjs <seed|cleanup> --confirm');
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key || !publicKey) throw new Error('Supabase audit credentials are not configured');

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const tag = 'ks-audit-20260821';
const personas = ['learner', 'institute', 'employer', 'government', 'admin'];
const suppliedPasswords = process.env.AUDIT_PASSWORDS_JSON ? JSON.parse(process.env.AUDIT_PASSWORDS_JSON) : null;
if (suppliedPasswords) {
  for (const persona of personas) {
    if (typeof suppliedPasswords[persona] !== 'string' || suppliedPasswords[persona].length < 12)
      throw new Error(`AUDIT_PASSWORDS_JSON is missing a valid ${persona} password`);
  }
}
const passwords = suppliedPasswords ?? Object.fromEntries(personas.map((persona) => [persona, `Karma-${persona}-${randomBytes(12).toString('base64url')}!A1`]));
const emails = Object.fromEntries(personas.map((persona) => [persona, `${tag}-${persona}@example.com`]));

function must(result, context) {
  if (result.error) throw new Error(`${context}: ${result.error.message}`);
  return result.data;
}

async function findAuditUsers() {
  const found = [];
  for (let page = 1; page <= 10; page += 1) {
    const data = must(await supabase.auth.admin.listUsers({ page, perPage: 100 }), 'list audit users');
    found.push(...data.users.filter((user) => user.email?.startsWith(tag)));
    if (data.users.length < 100) break;
  }
  return found;
}

async function cleanup() {
  const users = await findAuditUsers();
  const userIds = users.map((user) => user.id);
  const organizations = must(
    await supabase.from('organizations').select('id').like('website', `https://${tag}.invalid/%`),
    'find audit organizations',
  );
  const organizationIds = organizations.map((organization) => organization.id);
  const jobs = organizationIds.length
    ? must(await supabase.from('jobs').select('id').in('organization_id', organizationIds), 'find audit jobs')
    : [];
  const jobIds = jobs.map((job) => job.id);
  const applications = jobIds.length
    ? must(await supabase.from('applications').select('id').in('job_id', jobIds), 'find audit applications')
    : [];
  const applicationIds = applications.map((application) => application.id);

  if (applicationIds.length) {
    must(await supabase.from('hiring_pipeline_entries').delete().in('application_id', applicationIds), 'delete audit pipeline');
    must(await supabase.from('applications').delete().in('id', applicationIds), 'delete audit applications');
  }
  if (jobIds.length) {
    must(await supabase.from('opportunity_matches').delete().in('job_id', jobIds), 'delete audit matches');
    must(await supabase.from('jobs').delete().in('id', jobIds), 'delete audit jobs');
  }
  if (organizationIds.length) {
    must(await supabase.from('aggregate_metric_snapshots').delete().in('program_organization_id', organizationIds), 'delete audit metrics');
    must(await supabase.from('governance_cases').delete().in('program_organization_id', organizationIds), 'delete audit cases');
    must(await supabase.from('partner_verification_cases').delete().in('organization_id', organizationIds), 'delete audit partner cases');
    must(await supabase.from('organizations').delete().in('id', organizationIds), 'delete audit organizations');
  }
  must(await supabase.from('external_resources').delete().eq('external_id', tag), 'delete audit resource');
  must(await supabase.from('feature_flags').delete().eq('key', `${tag}-flag`), 'delete audit flag');
  must(await supabase.from('prompt_versions').delete().eq('prompt_key', `${tag}-prompt`), 'delete audit prompt');
  must(await supabase.from('model_releases').delete().eq('model_key', `${tag}-model`), 'delete audit model');
  for (const user of users) must(await supabase.auth.admin.deleteUser(user.id), `delete ${user.email}`);
  console.log(JSON.stringify({ ok: true, mode: 'cleanup', usersRemoved: userIds.length, organizationsRemoved: organizationIds.length }));
}

async function createUser(persona) {
  const existing = (await findAuditUsers()).find((user) => user.email === emails[persona]);
  if (existing) return existing;
  const data = must(
    await supabase.auth.admin.createUser({
      email: emails[persona],
      password: passwords[persona],
      email_confirm: true,
      user_metadata: { persona, display_name: `Audit ${persona}` },
    }),
    `create ${persona}`,
  );
  return data.user;
}

async function seed() {
  await cleanup();
  const users = {};
  for (const persona of personas) {
    users[persona] = await createUser(persona);
    must(await supabase.from('user_accounts').update({ persona }).eq('user_id', users[persona].id), `assign audited ${persona} persona`);
  }

  const organizations = must(
    await supabase
      .from('organizations')
      .insert([
        { name: 'Audit Government ITI', organization_type: 'institute', verification_status: 'verified', website: `https://${tag}.invalid/institute` },
        { name: 'Audit Manufacturing Ltd', organization_type: 'employer', verification_status: 'verified', website: `https://${tag}.invalid/employer` },
        { name: 'Audit Skills Mission', organization_type: 'government', verification_status: 'verified', website: `https://${tag}.invalid/government` },
      ])
      .select('id,organization_type'),
    'create audit organizations',
  );
  const institute = organizations.find((item) => item.organization_type === 'institute');
  const employer = organizations.find((item) => item.organization_type === 'employer');
  const government = organizations.find((item) => item.organization_type === 'government');

  must(await supabase.from('organization_memberships').insert({ organization_id: institute.id, user_id: users.institute.id, role: 'placement_officer', status: 'active' }), 'create institute membership');
  must(await supabase.from('employer_memberships').insert({ organization_id: employer.id, user_id: users.employer.id, role: 'recruiter', status: 'active' }), 'create employer membership');
  must(await supabase.from('program_memberships').insert({ organization_id: government.id, user_id: users.government.id, role: 'program_admin', status: 'active' }), 'create government membership');
  must(await supabase.from('platform_roles').insert({ user_id: users.admin.id, role: 'super_admin', active: true }), 'create platform role');

  must(await supabase.from('learner_profiles').insert({
    user_id: users.learner.id,
    full_name: 'Audit Learner',
    institute_name: 'Audit Government ITI',
    education_level: 'ITI',
    trade: 'Electrician',
    current_semester: 4,
    target_role_slug: 'industrial-electrician',
    home_location: 'Dehradun',
    mobility_preference: 'state',
    preferred_language: 'en',
    profile_visibility: 'matched_employers',
    onboarding_completed_at: new Date().toISOString(),
  }), 'create learner profile');
  must(await supabase.from('assessment_attempts').insert({ user_id: users.learner.id, assessment_slug: 'industrial-electrician-baseline', assessment_version: '1.0', status: 'completed', score: 76, completed_at: new Date().toISOString() }), 'create assessment');
  must(await supabase.from('learning_progress').insert({ user_id: users.learner.id, lesson_id: 'symbols', status: 'completed', progress_percent: 100, last_position_seconds: 522, started_at: new Date().toISOString(), completed_at: new Date().toISOString() }), 'create learning progress');
  must(await supabase.from('skill_evidence').insert([
    { user_id: users.learner.id, skill_slug: 'electrical-safety', evidence_type: 'project', title: 'Audit safety evidence', verification_status: 'verified', verified_at: new Date().toISOString() },
    { user_id: users.learner.id, skill_slug: 'panel-wiring', evidence_type: 'project', title: 'Audit wiring evidence', verification_status: 'pending' },
  ]), 'create evidence');
  must(await supabase.from('skill_graph_nodes').insert([
    { user_id: users.learner.id, role_slug: 'industrial-electrician', skill_slug: 'electrical-safety', proficiency_score: 84, confidence: 'high', evidence_strength: 82, calculation_version: tag, explanation: {} },
    { user_id: users.learner.id, role_slug: 'industrial-electrician', skill_slug: 'panel-wiring', proficiency_score: 72, confidence: 'medium', evidence_strength: 65, calculation_version: tag, explanation: {} },
  ]), 'create skill graph');

  const cohort = must(await supabase.from('cohorts').insert({ organization_id: institute.id, name: 'Audit Electrician Cohort', trade: 'Electrician', academic_year: '2026-27', semester: 4, status: 'active' }).select('id').single(), 'create cohort');
  must(await supabase.from('cohort_enrollments').insert({ cohort_id: cohort.id, learner_user_id: users.learner.id, status: 'active' }), 'create enrollment');
  must(await supabase.from('institute_data_grants').insert({ learner_user_id: users.learner.id, organization_id: institute.id, purpose: 'education_support', scopes: ['progress', 'evidence'] }), 'create institute grant');
  must(await supabase.from('cohort_metric_snapshots').insert({ cohort_id: cohort.id, captured_on: new Date().toISOString().slice(0, 10), learner_count: 1, readiness_percent: 78, engagement_percent: 100, evidence_percent: 50, application_count: 1, offer_count: 0 }), 'create cohort snapshot');
  must(await supabase.from('learner_support_actions').insert({ organization_id: institute.id, cohort_id: cohort.id, learner_user_id: users.learner.id, signal_type: 'evidence_pending', suggested_action: 'Review audit wiring evidence', status: 'open' }), 'create support action');

  const jobId = `${tag}-job`;
  must(await supabase.from('jobs').insert({ id: jobId, organization_id: employer.id, title: 'Audit Junior Electrician', target_role_slug: 'industrial-electrician', description: 'Temporary cross-dashboard audit role', location: 'Dehradun', work_type: 'full_time', salary_min: 18000, salary_max: 22000, requirements: { openings: 2 }, status: 'published', published_at: new Date().toISOString() }), 'create job');
  must(await supabase.from('opportunity_matches').insert({ user_id: users.learner.id, job_id: jobId, match_version: tag, score: 86, explanation: {}, missing_signals: [] }), 'create match');
  const application = must(await supabase.from('applications').insert({ user_id: users.learner.id, job_id: jobId, status: 'submitted', profile_share_consent: true, shared_snapshot: { audit: true } }).select('id').single(), 'create application');
  must(await supabase.from('hiring_pipeline_entries').insert({ application_id: application.id, stage: 'offer', owner_user_id: users.employer.id }), 'create pipeline entry');

  must(await supabase.from('aggregate_metric_snapshots').insert({ program_organization_id: government.id, geography_level: 'district', geography_code: 'AUDIT-DDN', metric_key: 'activated_learners', metric_value: 25, cohort_size: 25, period_start: '2026-08-01', period_end: '2026-08-21', dimensions: { audit: true } }), 'create government metric');
  must(await supabase.from('governance_cases').insert({ program_organization_id: government.id, case_type: 'fairness_review', severity: 'high', status: 'open', summary: 'Temporary audit fixture governance case' }), 'create government case');
  must(await supabase.from('model_releases').insert({ model_key: `${tag}-model`, version: '1.0', purpose: 'Audit fixture', provider: 'test', evaluation_summary: {}, risk_level: 'low', approved_by: users.admin.id, approved_at: new Date().toISOString(), status: 'approved' }), 'create model release');

  must(await supabase.from('external_resources').insert({ provider: 'youtube', external_id: tag, title_en: 'Audit resource', language: 'en', owner_name: 'Audit', embed_url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', captions_available: true, text_fallback: 'Temporary audit fixture', permission_status: 'valid', review_status: 'approved', reviewed_by: users.admin.id, reviewed_at: new Date().toISOString(), next_review_at: new Date(Date.now()+30*86400000).toISOString(), metadata: { translation_reviewed: true, accessibility_reviewed: true } }), 'create resource');
  must(await supabase.from('partner_verification_cases').insert({ organization_id: employer.id, assigned_to: users.admin.id, checks: { audit: true }, risk_rating: 'low', status: 'reviewing' }), 'create partner case');
  must(await supabase.from('feature_flags').insert({ key: `${tag}-flag`, description: 'Temporary audit fixture', enabled: true, rollout_percent: 10, risk_tier: 'low', updated_by: users.admin.id }), 'create feature flag');
  must(await supabase.from('prompt_versions').insert({ prompt_key: `${tag}-prompt`, version: '1.0', system_template: 'Audit only', input_schema: {}, output_schema: {}, model_key: `${tag}-model`, status: 'production', created_by: users.admin.id, approved_by: users.admin.id }), 'create prompt');

  const verification = {};
  for (const persona of personas) {
    const client = createClient(url, publicKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const session = must(await client.auth.signInWithPassword({ email: emails[persona], password: passwords[persona] }), `sign in ${persona}`);
    const account = must(await client.from('user_accounts').select('persona,status').eq('user_id', session.user.id).single(), `read ${persona} account`);
    if (account.persona !== persona || account.status !== 'active') throw new Error(`${persona} account scope mismatch`);
    const membershipTable = persona === 'institute' ? 'organization_memberships' : persona === 'employer' ? 'employer_memberships' : persona === 'government' ? 'program_memberships' : null;
    const membership = membershipTable ? must(await client.from(membershipTable).select('status').eq('user_id', session.user.id).eq('status', 'active'), `read ${persona} membership`) : [];
    if (membershipTable && membership.length !== 1) throw new Error(`${persona} membership missing`);
    verification[persona] = { authenticated: true, persona: account.persona, membership: membershipTable ? 'active' : 'not_required' };
    await client.auth.signOut();
  }
  console.log(JSON.stringify({
    ok: true,
    mode: 'seed',
    accounts: Object.fromEntries(personas.map((persona) => [persona, { email: emails[persona], password: suppliedPasswords ? 'supplied-by-operator' : passwords[persona] }])),
    verification,
  }));
}

if (mode === 'seed') await seed();
else await cleanup();
