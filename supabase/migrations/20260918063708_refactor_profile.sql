alter table "public"."profile" add column "email" character varying;

alter table "public"."profile" add column "full_name" character varying;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_auth_login(event jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
  declare 
    claims jsonb;
    user_metadata jsonb;
    profile_record record;
begin
  claims := event->'claims';
  user_metadata := claims->'user_metadata';

  select * into profile_record from public.profile where auth_id = (claims->>'sub')::uuid;

  user_metadata := jsonb_set(user_metadata, '{user_role}', coalesce(to_jsonb(profile_record.roles), 'null'::jsonb));
  user_metadata := jsonb_set(user_metadata, '{full_name}', coalesce(to_jsonb(profile_record.full_name), 'null'::jsonb));
  user_metadata := jsonb_set(user_metadata, '{email}', coalesce(to_jsonb(profile_record.email), 'null'::jsonb));
  user_metadata := jsonb_set(user_metadata, '{uploaded_avatar_path}', coalesce(to_jsonb(profile_record.uploaded_avatar_path), 'null'::jsonb));

  claims := jsonb_set(claims, '{user_metadata}', user_metadata);
  event := jsonb_set(event, '{claims}', claims);

  return event;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profile (auth_id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$function$
;


