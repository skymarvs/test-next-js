"use server";

import {
  LoginSchema,
  LoginSchemaType,
  SignupSchema,
  SignupSchemaType,
} from "@/lib/schema";
import createClient from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function signupUser(formData: SignupSchemaType) {
  const parsedData = SignupSchema.safeParse(formData);
  if (!parsedData.success) {
    throw new Error(parsedData.error.message);
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
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
}

export async function loginUser(formData: LoginSchemaType) {
  const parsedData = LoginSchema.safeParse(formData);
  if (!parsedData.success) {
    throw new Error(parsedData.error.message);
  }

  const { email, password } = parsedData.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
}

export default async function signoutUser() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/", "layout");
}
