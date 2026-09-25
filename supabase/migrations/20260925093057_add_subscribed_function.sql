set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.subscribe_to_events(param_id bigint)
 RETURNS public.subscribed_events
 LANGUAGE plpgsql
 SECURITY INVOKER
 SET search_path TO 'public'
AS $function$
declare
  subscription_row public.subscribed_events;
begin
  if auth.uid() is null then
    raise exception 'Not Authenticated';
  end if;

  update public.events set available_slot = available_slot - 1 where id = param_id and available_slot > 0 and created_by <> auth.uid();

  if not found then
    raise exception 'No available slots for event %', param_id;
  end if;

  insert into public.subscribed_events (event_id, user_id) values (param_id, auth.uid())
  returning * into subscription_row;

  return subscription_row;
end;
$function$
;