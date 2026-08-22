-- Employer dashboard members may read applications to jobs owned by their organization.
-- Candidate identity access remains controlled separately by talent_access_requests.
create policy "employer members read job applications"
on public.applications
for select
to authenticated
using (
  exists (
    select 1
    from public.jobs job
    where job.id = applications.job_id
      and public.is_active_employer_member(job.organization_id)
  )
);
