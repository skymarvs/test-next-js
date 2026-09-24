alter table "public"."profile" drop column "full_name";

alter table "public"."profile" add column "first_name" character varying;

alter table "public"."profile" add column "last_name" character varying;

alter table "public"."profile" add constraint "profile_auth_id_fkey" FOREIGN KEY (auth_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profile" validate constraint "profile_auth_id_fkey";

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
  user_metadata := jsonb_set(user_metadata, '{full_name}', coalesce(to_jsonb(concat(profile_record.first_name, ' ', profile_record.last_name)), 'null'::jsonb));
  user_metadata := jsonb_set(user_metadata, '{first_name}', coalesce(to_jsonb(profile_record.first_name), 'null'::jsonb));
  user_metadata := jsonb_set(user_metadata, '{last_name}', coalesce(to_jsonb(profile_record.last_name), 'null'::jsonb));
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
  declare 
    _first_name text;
    _last_name text;
    _full_name text;
begin
  _first_name := new.raw_user_meta_data->>'first_name';
  _last_name := new.raw_user_meta_data->>'last_name';

  if _first_name is null or _last_name is null then 
    _full_name = trim(coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name'
    ));

    _first_name := coalesce(_first_name, split_part(_full_name, ' ', 1));
    _last_name := coalesce(_last_name, split_part(_full_name, ' ', 2));
  end if;

  insert into public.profile (auth_id, email, first_name, last_name) 
  values (new.id, new.email, _first_name, _last_name);

  return new;
end;
$function$
;