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
  to authenticated
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


CREATE TRIGGER protect_bucket_control_insert BEFORE INSERT ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.protect_bucket_control_columns('service_role');

CREATE TRIGGER protect_bucket_control_update BEFORE UPDATE OF lifecycle_configuration, lifecycle_configuration_generation ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.protect_bucket_control_columns();

CREATE TRIGGER protect_bucket_control_update_role AFTER UPDATE OF lifecycle_configuration, lifecycle_configuration_generation ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_lifecycle_service_role('service_role');


