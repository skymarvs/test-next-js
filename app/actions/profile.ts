"use server";

import { PasswordEditSchema, PasswordEditSchemaType, ProfileEditSchema, ProfileEditSchemaType } from "@/lib/schema";
import { Profile } from "@/lib/types/models";
import signoutUser, { loginUser } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";

export async function getProfile(): Promise<Profile[] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profile").select("*");

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function updateProfile (formData : ProfileEditSchemaType) {
  const parsedData = ProfileEditSchema.safeParse(formData);
  if (!parsedData.success) {
    throw new Error(parsedData.error.message);
  }

  const { firstName, lastName, email } = parsedData.data;

  const supabase = await createClient();
  const jwtToken =  await supabase.auth.getClaims();

  if(jwtToken.error || !jwtToken.data) {
    throw new Error("Not authenticated");
  }

  const profile = await supabase.from("profile")
    .update({ first_name: firstName, last_name: lastName, email: email })
    .eq('auth_id', jwtToken.data.claims.sub);
  const auth = await supabase.auth.updateUser({ email: email})

  if(profile.error) {
    throw new Error(profile.error.message);
  }
  if(auth.error) {
    throw new Error(auth.error.message);
  }

  await signoutUser();
}

export async function updatePassword (formData : PasswordEditSchemaType) {
  const parsedData = PasswordEditSchema.safeParse(formData);
  if (!parsedData.success) {
    throw new Error(parsedData.error.message);
  }

  const supabase = await createClient();
  const jwtToken =  await supabase.auth.getClaims();
  if(jwtToken.error || !jwtToken.data) {
    throw new Error("Not authenticated");
  }

  const { oldPassword, newPassword } = parsedData.data;
  await loginUser({
    email: jwtToken.data?.claims?.user_metadata?.email,
    password: oldPassword!
  });

  const { error } = await supabase.auth.updateUser({ password: newPassword})

  if(error) {
    throw new Error("Update Failed");
  }

  await signoutUser();
}