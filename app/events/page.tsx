"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAuthPayload } from "@/contexts/auth-provider";

import { EventCard } from "./_components/event-card";
import createClient from "@/lib/supabase/client";
import { Event } from "@/lib/types/models";
import { useEffect, useState } from "react";

const getEvents = async (): Promise<Event[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("events").select("*");
  if(error){
    throw new Error(error.message);
  }
  return data;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const auth = useAuthPayload();

  useEffect(() => {
    const _getEvents = async () => {
      setEvents(await getEvents());
    }

    _getEvents();
  }, [events])

  const router = useRouter();
  return (
    <>
      <div className="flex items-end justify-between mb-4">
        <h1>Events</h1>
        {auth && (
          <Button
            size="lg"
            onClick={() => router.push(`/events/${auth?.sub}`)}
          >
            Manage Events
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12">
        {events.map((item: Event) => (
          <EventCard key={item.id} {...item}/>
        ))}
      </div>
    </>
  );
}
