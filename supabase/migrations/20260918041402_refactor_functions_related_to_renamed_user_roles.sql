set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_auth_login(event jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
  declare 
    claims jsonb;
    user_metadata jsonb;
    user_role public.profile.roles%type;
begin
  claims := event->'claims';
  user_metadata := claims->'user_metadata';

  select roles into user_role from public.profile where auth_id = (claims->>'sub')::uuid;

  if user_role is not null then 
    user_metadata := jsonb_set(user_metadata, '{user_role}', to_jsonb(user_role));
  else
    user_metadata := jsonb_set(user_metadata, '{user_role}', to_jsonb('null'));
  end if;

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
  insert into public.profile (auth_id)
  values (new.id);
  return new;
end;
$function$
;


