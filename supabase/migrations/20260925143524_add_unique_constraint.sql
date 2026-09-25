CREATE UNIQUE INDEX "unique together subscription" ON public.subscribed_events USING btree (user_id, event_id);

alter table "public"."subscribed_events"
add constraint "unique together subscription" UNIQUE using index "unique together subscription";