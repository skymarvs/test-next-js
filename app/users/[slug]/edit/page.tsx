"use client";

import { useAuthPayload } from "@/contexts/auth-provider";
import { useParams, useRouter } from "next/navigation";
import UpdateProfileForm from "./_profile_form";
import UpdatePasswordForm from "./_password_form";
import { useEffect } from "react";

type EditProfileSlug = {
  slug: string;
}

export default function EditProfilePage() {
  const slug = useParams<EditProfileSlug>().slug;
  const auth = useAuthPayload();
  const router = useRouter();

  useEffect(() => {
    if(auth?.sub !== slug){
      router.back();
    }
  }, [auth, router, slug])

  return (<>
    <h1 className="mb-4">Edit Profile</h1>
    <div className="grid lg:flex gap-4 w-full justify-center">
      <UpdateProfileForm />
      {auth?.app_metadata?.provider === 'email' && (
        <UpdatePasswordForm />
      )}
    </div>  
  </>);
}
