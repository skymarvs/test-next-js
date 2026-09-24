
  create policy "Enable Update for authenticated own user"
  on "public"."profile"
  as permissive
  for update
  to authenticated
using ((auth_id = auth.uid()))
with check ((auth_id = auth.uid()));



  create policy "Enabled read to own authenticatd user profile"
  on "public"."profile"
  as permissive
  for select
  to authenticated
using ((auth_id = auth.uid()));