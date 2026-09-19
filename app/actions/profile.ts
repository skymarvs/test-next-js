"use server"

import createClient from "@/lib/supabase/server";
import { Profile } from "@/lib/types/models";

export async function getProfile() : Promise<Profile[] | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('profile').select('*');

    if(error){
        throw new Error(error.message);
    }
    return data;
}