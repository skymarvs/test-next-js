"use server"

import { loginSchema, loginSchemaType, signupSchema, signupSchemaType } from "@/lib/schema";
import createClient from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function signupUser(formData : signupSchemaType){

    const parsedData = signupSchema.safeParse(formData);
    if(!parsedData.success){
        throw new Error(parsedData.error.message)
    }

    const { firstName, lastName, email, password } = parsedData.data;
    
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data : {
                full_name: `${firstName} ${lastName}`
            }
        }
    });

    if(error){
        throw new Error(error.message);
    }

    revalidatePath("/", 'layout');
}

export async function loginUser(formData : loginSchemaType){

    const parsedData = loginSchema.safeParse(formData);
    if(!parsedData.success){
        throw new Error(parsedData.error.message)
    }

    const { email, password } = parsedData.data;
    
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if(error){
        throw new Error(error.message);
    }

    revalidatePath("/", 'layout')
}

export default async function signoutUser () {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if(error){
        throw new Error(error.message);
    }
    revalidatePath("/", 'layout')
}