"use server"

import { CreateEventSchema } from "@/lib/schema"
import createClient from "@/lib/supabase/server";

export async function createEvent(formData : FormData){
    const parsedData = CreateEventSchema.safeParse({
        ...Object.fromEntries(formData),
        slots: Number(formData.get("slots"))
    });

    if(!parsedData.success){
        throw new Error(parsedData.error.message);
    }

    const supabase = await createClient();
    const jwtToken =  await supabase.auth.getClaims();
    if(jwtToken.error || !jwtToken.data) {
        throw new Error("Not authenticated");
    }

    const { image, title, description, slots } = parsedData.data;

    const ext = image.name.split(".").pop();
    const path = `events/${crypto.randomUUID()}.${ext}`;

    const { error : uploadError} = await supabase.storage.from("event-cover")
        .upload(
            path, 
            image, 
            {
                contentType: image.type
            }
        );
    
    if(uploadError) {
        throw new Error(uploadError.message);
    }

    const { data, error } = await supabase.from('events').insert([{
        image_link: path,
        title: title,
        description: description,
        max_slot: slots
    }])

    if(error) {
        throw new Error(error.message);
    }
}