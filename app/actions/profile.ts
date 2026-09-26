"use server";

import { PasswordEditSchema, PasswordEditSchemaType, ProfileEditSchema, ProfileEditSchemaType } from "@/lib/schema";
import { Profile } from "@/lib/types/models";
import { ActionResult } from "@/lib/types/action-result";
import signoutUser, { loginUser } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";

export async function getProfile(): Promise<ActionResult<Profile[] | null>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profile").select("*");

  if (error) {
    return { error: error.message };
  }
  return { data };
}

export async function updateProfile (formData : ProfileEditSchemaType): Promise<ActionResult> {
  const parsedData = ProfileEditSchema.safeParse(formData);
  if (!parsedData.success) {
    return { error: parsedData.error.message };
  }

  const { firstName, lastName, email } = parsedData.data;

  const supabase = await createClient();
  const jwtToken =  await supabase.auth.getClaims();

  if(jwtToken.error || !jwtToken.data) {
    return { error: "Not authenticated" };
  }

  const profile = await supabase.from("profile")
    .update({ first_name: firstName, last_name: lastName, email: email })
    .eq('auth_id', jwtToken.data.claims.sub);
  const auth = await supabase.auth.updateUser({ email: email})

  if(profile.error) {
    return { error: profile.error.message };
  }
  if(auth.error) {
    return { error: auth.error.message };
  }

  await signoutUser();
  return { data: undefined };
}

export async function updatePassword (formData : PasswordEditSchemaType): Promise<ActionResult> {
  const parsedData = PasswordEditSchema.safeParse(formData);
  if (!parsedData.success) {
    return { error: parsedData.error.message };
  }

  const supabase = await createClient();
  const jwtToken =  await supabase.auth.getClaims();
  if(jwtToken.error || !jwtToken.data) {
    return { error: "Not authenticated" };
  }

  const { oldPassword, newPassword } = parsedData.data;
  const loginResult = await loginUser({
    email: jwtToken.data?.claims?.user_metadata?.email,
    password: oldPassword!
  });

  if (loginResult.error) {
    return { error: loginResult.error };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword})

  if(error) {
    return { error: "Update Failed" };
  }

  await signoutUser();
  return { data: undefined };
}