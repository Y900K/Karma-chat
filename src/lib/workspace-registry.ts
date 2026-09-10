export type PartnerScope = "institute" | "employer" | "government" | "admin";
export const workspaceRegistry = {
  institute: [
    {id:"overview",label:"Overview",table:"cohorts",fields:"id,name,trade,academic_year,semester,status",org:"organization_id",search:"name"},
    {id:"learners",label:"Learners & evidence",table:"learner_support_actions",fields:"id,signal_type,suggested_action,status,due_at",org:"organization_id",search:"signal_type"},
    {id:"cohorts",label:"Cohorts",table:"cohorts",fields:"id,name,trade,academic_year,semester,status",org:"organization_id",search:"name"},
    {id:"learning",label:"Learning",table:"cohort_assignments",fields:"id,status,due_at,created_at,cohorts!inner(organization_id,name),learning_path_versions(title_en,version)",org:"cohorts.organization_id",search:null},
    {id:"placements",label:"Placements",table:"cohort_metric_snapshots",fields:"id,captured_on,application_count,offer_count,cohorts!inner(organization_id)",org:"cohorts.organization_id",search:null},
    {id:"reports",label:"Reports",table:"cohort_metric_snapshots",fields:"id,captured_on,learner_count,readiness_percent,engagement_percent,evidence_percent,cohorts!inner(organization_id)",org:"cohorts.organization_id",search:null},
  ],
  employer: [
    {id:"overview",label:"Overview",table:"jobs",fields:"id,title,status,location,published_at",org:"organization_id",search:"title"},
    {id:"jobs",label:"Jobs",table:"jobs",fields:"id,title,status,location,salary_min,salary_max,currency,published_at",org:"organization_id",search:"title"},
    {id:"talent",label:"Talent",table:"applications",fields:"id,status,submitted_at,jobs!inner(organization_id,title)",org:"jobs.organization_id",search:null},
    {id:"pipeline",label:"Hiring pipeline",table:"hiring_pipeline_entries",fields:"id,stage,stage_updated_at,applications!inner(jobs!inner(organization_id,title))",org:"applications.jobs.organization_id",search:"stage"},
  ],
  government: [
    {id:"overview",label:"Overview",table:"aggregate_metric_snapshots",fields:"id,geography_code,metric_key,metric_value,cohort_size,period_start,period_end",org:"program_organization_id",search:"metric_key"},
    {id:"districts",label:"District network",table:"aggregate_metric_snapshots",fields:"id,geography_level,geography_code,metric_key,metric_value,cohort_size,period_end",org:"program_organization_id",search:"geography_code"},
    {id:"demand",label:"Demand signals",table:"aggregate_metric_snapshots",fields:"id,geography_code,metric_key,metric_value,cohort_size,period_end",org:"program_organization_id",search:"metric_key"},
    {id:"fairness",label:"Fairness & AI governance",table:"model_releases",fields:"id,model_key,version,purpose,risk_level,status,approved_at",org:null,search:"model_key"},
    {id:"reviews",label:"Grievances",table:"governance_cases",fields:"id,case_type,severity,status,summary,due_at,resolved_at",org:"program_organization_id",search:"summary"},
    {id:"exports",label:"Data exports",table:"data_export_requests",fields:"id,purpose,status,created_at,expires_at",org:"program_organization_id",search:"purpose"},
  ],
  admin: [
    {id:"overview",label:"Command center",table:"operational_errors",fields:"id,service,error_code,severity,route,created_at",org:null,search:"service"},
    {id:"content",label:"Content operations",table:"external_resources",fields:"id,title_en,provider,review_status,permission_status,next_review_at",org:null,search:"title_en"},
    {id:"partners",label:"Partner verification",table:"partner_verification_cases",fields:"id,status,risk_rating,created_at,decided_at",org:null,search:"status"},
    {id:"ai",label:"AI prompts & evals",table:"prompt_versions",fields:"id,prompt_key,version,model_key,status,created_at",org:null,search:"prompt_key"},
    {id:"flags",label:"Feature flags",table:"feature_flags",fields:"key,description,enabled,rollout_percent,risk_tier,updated_at",org:null,search:"description"},
    {id:"health",label:"System health",table:"operational_errors",fields:"id,service,error_code,severity,route,created_at",org:null,search:"service"},
  ],
} as const;
