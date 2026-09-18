alter table "public"."profile" add column "uploaded_avatar_path" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$select (auth.jwt()->'user_metadata'->>'user_role') = 'ADMIN'$function$
;

  create policy "Enable read to authenticated user with admin role"
  on "public"."profile"
  as permissive
  for select
  to authenticated
using (public.is_admin());


