-- Restore anonymous reads of explicitly public rows without granting anonymous
-- callers access to the privileged is_platform_staff() authorization helper.
-- Staff policies are deliberately restricted to authenticated users; the
-- service_role continues to bypass RLS for trusted server-side operations.
begin;

drop policy if exists "approved resources public" on public.external_resources;
drop policy if exists "staff manage resources" on public.external_resources;
create policy "approved resources public" on public.external_resources
  for select to anon, authenticated
  using(review_status = 'approved' and permission_status = 'valid');
create policy "staff manage resources" on public.external_resources
  for all to authenticated
  using(public.is_platform_staff()) with check(public.is_platform_staff());

drop policy if exists "published roles readable" on public.occupation_roles;
create policy "published roles readable" on public.occupation_roles
  for select to anon, authenticated using(status = 'published');
drop policy if exists "staff read unpublished roles" on public.occupation_roles;
create policy "staff read unpublished roles" on public.occupation_roles
  for select to authenticated using(public.is_platform_staff());

drop policy if exists "published paths readable" on public.learning_path_versions;
drop policy if exists "staff manage path versions" on public.learning_path_versions;
create policy "published paths readable" on public.learning_path_versions
  for select to anon, authenticated using(status = 'published');
create policy "staff manage path versions" on public.learning_path_versions
  for all to authenticated
  using(public.is_platform_staff()) with check(public.is_platform_staff());

drop policy if exists "anyone submits trust reports" on public.public_trust_reports;
drop policy if exists "staff manage trust reports" on public.public_trust_reports;
create policy "anyone submits trust reports" on public.public_trust_reports
  for insert to anon, authenticated with check(true);
create policy "staff manage trust reports" on public.public_trust_reports
  for all to authenticated
  using(public.is_platform_staff()) with check(public.is_platform_staff());

drop policy if exists "published public metrics readable" on public.public_metric_releases;
drop policy if exists "staff manage public metrics" on public.public_metric_releases;
create policy "published public metrics readable" on public.public_metric_releases
  for select to anon, authenticated
  using(published_at is not null and eligible_count >= suppression_threshold);
create policy "staff manage public metrics" on public.public_metric_releases
  for all to authenticated
  using(public.is_platform_staff()) with check(public.is_platform_staff());

drop policy if exists "approved policies readable" on public.public_policy_versions;
drop policy if exists "staff manage policies" on public.public_policy_versions;
create policy "approved policies readable" on public.public_policy_versions
  for select to anon, authenticated using(status = 'approved' and effective_at <= now());
create policy "staff manage policies" on public.public_policy_versions
  for all to authenticated
  using(public.is_platform_staff()) with check(public.is_platform_staff());

drop policy if exists "published documents readable" on public.content_documents;
drop policy if exists "staff manage content documents" on public.content_documents;
create policy "published documents readable" on public.content_documents
  for select to anon, authenticated using(status = 'published' and reviewed_at is not null);
create policy "staff manage content documents" on public.content_documents
  for all to authenticated
  using(public.is_platform_staff()) with check(public.is_platform_staff());

drop policy if exists "published chunks readable" on public.content_chunks;
drop policy if exists "staff manage content chunks" on public.content_chunks;
create policy "published chunks readable" on public.content_chunks
  for select to anon, authenticated
  using(exists(select 1 from public.content_documents d where d.id = document_id and d.status = 'published' and d.reviewed_at is not null));
create policy "staff manage content chunks" on public.content_chunks
  for all to authenticated
  using(public.is_platform_staff()) with check(public.is_platform_staff());

drop policy if exists "published locale packs readable" on public.locale_content_packs;
drop policy if exists "staff manage locale packs" on public.locale_content_packs;
create policy "published locale packs readable" on public.locale_content_packs
  for select to anon, authenticated using(status = 'published');
create policy "staff manage locale packs" on public.locale_content_packs
  for all to authenticated
  using(public.is_platform_staff()) with check(public.is_platform_staff());

drop policy if exists "active metric definitions readable" on public.metric_definitions;
drop policy if exists "staff manage metric definitions" on public.metric_definitions;
create policy "active metric definitions readable" on public.metric_definitions
  for select to anon, authenticated using(status = 'active');
create policy "staff manage metric definitions" on public.metric_definitions
  for all to authenticated
  using(public.is_platform_staff()) with check(public.is_platform_staff());

drop policy if exists "active regions readable" on public.regions;
drop policy if exists "staff manage regions" on public.regions;
create policy "active regions readable" on public.regions
  for select to anon, authenticated using(status = 'active');
create policy "staff manage regions" on public.regions
  for all to authenticated
  using(public.is_platform_staff()) with check(public.is_platform_staff());

drop policy if exists "active taxonomies readable" on public.taxonomy_versions;
drop policy if exists "staff manage taxonomy versions" on public.taxonomy_versions;
create policy "active taxonomies readable" on public.taxonomy_versions
  for select to anon, authenticated using(status = 'active');
create policy "staff manage taxonomy versions" on public.taxonomy_versions
  for all to authenticated
  using(public.is_platform_staff()) with check(public.is_platform_staff());

drop policy if exists "active taxonomy terms readable" on public.taxonomy_terms;
drop policy if exists "staff manage taxonomy terms" on public.taxonomy_terms;
create policy "active taxonomy terms readable" on public.taxonomy_terms
  for select to anon, authenticated
  using(exists(select 1 from public.taxonomy_versions v where v.taxonomy_key = taxonomy_terms.taxonomy_key and v.version = taxonomy_terms.taxonomy_version and v.status = 'active'));
create policy "staff manage taxonomy terms" on public.taxonomy_terms
  for all to authenticated
  using(public.is_platform_staff()) with check(public.is_platform_staff());

drop policy if exists "reviewed taxonomy mappings readable" on public.resource_taxonomy_mappings;
drop policy if exists "staff manage taxonomy mappings" on public.resource_taxonomy_mappings;
create policy "reviewed taxonomy mappings readable" on public.resource_taxonomy_mappings
  for select to anon, authenticated using(reviewed_at is not null);
create policy "staff manage taxonomy mappings" on public.resource_taxonomy_mappings
  for all to authenticated
  using(public.is_platform_staff()) with check(public.is_platform_staff());

drop policy if exists "active slos readable" on public.service_level_objectives;
create policy "active slos readable" on public.service_level_objectives
  for select to anon, authenticated using(status = 'active');
drop policy if exists "staff read inactive slos" on public.service_level_objectives;
create policy "staff read inactive slos" on public.service_level_objectives
  for select to authenticated using(public.is_platform_staff());

-- Fail future migrations in review if an anonymous/public policy calls this
-- privileged helper again. The helper intentionally remains non-executable by anon.
-- Restrict inherited staff ALL policies as well, including tables introduced
-- by intervening migrations. Identifiers are quoted, never concatenated raw.
do $$
declare p record;
begin
  for p in select schemaname, tablename, policyname from pg_policies
    where schemaname = 'public' and cmd = 'ALL'
      and (coalesce(qual, '') like '%is_platform_staff%'
        or coalesce(with_check, '') like '%is_platform_staff%')
  loop
    execute format('alter policy %I on %I.%I to authenticated', p.policyname, p.schemaname, p.tablename);
  end loop;
end $$;
revoke all on function public.is_platform_staff() from public, anon;
grant execute on function public.is_platform_staff() to authenticated;
commit;
