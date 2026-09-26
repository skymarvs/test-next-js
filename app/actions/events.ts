"use server"

import { CreateEventSchema, UpdateEventSchema } from "@/lib/schema"
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { Event } from "@/lib/types/models";
import { ActionResult } from "@/lib/types/action-result";

export async function createEvent(formData : FormData): Promise<ActionResult> {
    const parsedData = CreateEventSchema.safeParse({
        ...Object.fromEntries(formData),
        slots: Number(formData.get("slots"))
    });

    if(!parsedData.success){
        return { error: parsedData.error.message };
    }

    const supabase = await createClient();
    const jwtToken =  await supabase.auth.getClaims();
    if(jwtToken.error || !jwtToken.data) {
        return { error: "Not authenticated" };
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
        return { error: uploadError.message };
    }

    const { error } = await supabase.from('events').insert([{
        image_link: path,
        title: title,
        description: description,
        max_slot: slots,
        available_slot: slots
    }])

    if(error) {
        return { error: error.message };
    }

    return { data: undefined };
}

export async function updateEvent(formData : FormData): Promise<ActionResult> {
    const image = formData.get("image");

    const parsedData = UpdateEventSchema.safeParse({
        ...Object.fromEntries(formData),
        id: Number(formData.get("id")),
        slots: Number(formData.get("slots")),
        image: image instanceof File && image.size > 0 ? image : undefined
    });

    if(!parsedData.success){
        return { error: parsedData.error.message };
    }

    const supabase = await createClient();
    const jwtToken =  await supabase.auth.getClaims();
    if(jwtToken.error || !jwtToken.data) {
        return { error: "Not authenticated" };
    }

    const { id, image: newImage, title, description, slots } = parsedData.data;

    const { data: existingEvent, error: fetchError } = await supabase
        .from('events')
        .select('created_by, image_link')
        .eq('id', id)
        .single();

    if(fetchError || !existingEvent) {
        return { error: "Event not found" };
    }

    if(existingEvent.created_by !== jwtToken.data.claims.sub) {
        return { error: "You are not allowed to update this event" };
    }

    let imagePath = existingEvent.image_link;

    if(newImage) {
        const ext = newImage.name.split(".").pop();
        imagePath = `events/${crypto.randomUUID()}.${ext}`;

        const { error : uploadError} = await supabase.storage.from("event-cover")
            .upload(
                imagePath,
                newImage,
                {
                    contentType: newImage.type
                }
            );

        if(uploadError) {
            return { error: uploadError.message };
        }
    }

    const { error } = await supabase.from('events').update({
        image_link: imagePath,
        title: title,
        description: description,
        max_slot: slots
    }).eq('id', id);

    if(error) {
        return { error: error.message };
    }

    return { data: undefined };
}

export async function subscribeToEvent(eventId: number): Promise<ActionResult> {
    const supabase = await createClient();
    const jwtToken = await supabase.auth.getClaims();
    if(jwtToken.error || !jwtToken.data) {
        return { error: "Not authenticated" };
    }

    const { error } = await supabase.rpc("subscribe_to_events", {
        param_id: eventId
    });

    if(error) {
        return { error: error.message };
    }

    return { data: undefined };
}

// `subscribed_events` has RLS enabled with no policies defined for it, so a
// plain session-bound client can never see its rows (only the SECURITY
// DEFINER `subscribe_to_events` RPC can write to it). These two reads go
// through the admin client instead, deriving the user id from the caller's
// own session rather than trusting client input.

export async function getMySubscriptionStatus(eventId: number): Promise<ActionResult<boolean>> {
    const supabase = await createClient();
    const jwtToken = await supabase.auth.getClaims();
    if(jwtToken.error || !jwtToken.data) {
        return { data: false };
    }

    const admin = createAdminClient();
    const { data, error } = await admin
        .from("subscribed_events")
        .select("id")
        .eq("event_id", eventId)
        .eq("user_id", jwtToken.data.claims.sub)
        .maybeSingle();

    if(error) {
        return { error: error.message };
    }

    return { data: !!data };
}

export async function getMySubscribedEvents(): Promise<ActionResult<Event[]>> {
    const supabase = await createClient();
    const jwtToken = await supabase.auth.getClaims();
    if(jwtToken.error || !jwtToken.data) {
        return { data: [] };
    }

    const admin = createAdminClient();
    const { data, error } = await admin
        .from("subscribed_events")
        .select("events(*)")
        .eq("user_id", jwtToken.data.claims.sub);

    if(error) {
        return { error: error.message };
    }

    return {
        data: (data ?? [])
            .map((row) => row.events)
            .filter((event): event is Event => event !== null)
    };
}