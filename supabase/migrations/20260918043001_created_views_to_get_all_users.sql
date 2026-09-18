create or replace view "public"."user_profiles" as  SELECT p.auth_id AS id,
    (u.raw_user_meta_data ->> 'full_name'::text) AS full_name,
    (u.raw_user_meta_data ->> 'avatar_url'::text) AS avatar_link,
    u.email,
    u.created_at
   FROM (public.profile p
     JOIN auth.users u ON ((p.auth_id = u.id)));



