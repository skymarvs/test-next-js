"use server";

import {
  LoginSchema,
  LoginSchemaType,
  SignupSchema,
  SignupSchemaType,
} from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ActionResult } from "@/lib/types/action-result";

export async function signupUser(formData: SignupSchemaType): Promise<ActionResult> {
  const parsedData = SignupSchema.safeParse(formData);
  if (!parsedData.success) {
    return { error: parsedData.error.message };
  }

  const { firstName, lastName, email, password } = parsedData.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        full_name: `${firstName} ${lastName}`,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { data: undefined };
}

export async function loginUser(formData: LoginSchemaType): Promise<ActionResult> {
  const parsedData = LoginSchema.safeParse(formData);
  if (!parsedData.success) {
    return { error: parsedData.error.message };
  }

  const { email, password } = parsedData.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { data: undefined };
}

export default async function signoutUser(): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/", "layout");
  return { data: undefined };
}
