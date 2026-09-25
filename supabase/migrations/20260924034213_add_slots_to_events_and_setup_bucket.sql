alter table "public"."events" add column "max_slot" smallint;


  create policy "allow CRUD only for authenticated users 1ijsq84_0"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'event-cover'::text));



  create policy "allow CRUD only for authenticated users 1ijsq84_1"
  on "storage"."objects"
  as permissive
  for select
  to anon
using ((bucket_id = 'event-cover'::text));



  create policy "allow CRUD only for authenticated users 1ijsq84_2"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using ((bucket_id = 'event-cover'::text));



  create policy "allow CRUD only for authenticated users 1ijsq84_3"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using ((bucket_id = 'event-cover'::text));


