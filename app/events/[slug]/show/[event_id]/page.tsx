"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, MoveLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import createClient from "@/lib/supabase/client";
import { Event } from "@/lib/types/models";
import { useParams, useRouter } from "next/navigation";
import { useAuthPayload } from "@/contexts/auth-provider";
import { subscribeToEvent } from "@/app/actions/events";
import { toast } from "@/components/ui/toast";

const getEvent = async (id : number): Promise<Event> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("events").select("*").eq("id", id).single();
  if(error){
    throw new Error(error.message);
  }
  return data;
};


export default function EventSubscribePage() {
  const auth = useAuthPayload();
  const slug = useParams<{event_id : string}>().event_id;
  const [subscribed, setSubscribed] = useState(false);
  const [event, setEvent] = useState<Event>();
  const router = useRouter();

  const subscribeToShow = (id : number) => {
    toast.promise(subscribeToEvent(id), {
      loading: "Subscribing...",
      success: () => {
        router.refresh();
        setSubscribed(true);
        return "Event Subscribed";
      },
      error: (err) => `Failed: ${err.message}`,
    });
  }

  useEffect(() => {
    if(Number.isNaN(slug)){
      return router.back();
    }
  }, [router, slug])

  useEffect(() => {
    const _getEvent = async () => {
      setEvent(await getEvent(Number(slug)));
    }
    _getEvent();
  }, [slug])

  if(!event) {
    return;
  }

  return (
    <>
      <div className="mb-4 flex gap-4 items-center">
        <Button variant="ghost" onClick={() => router.back()}><MoveLeft /> Back</Button>
        <h1>Event Details</h1>
      </div>
      <div className="grid lg:flex min-h-[75vh] gap-12">
        {/* Left: event image */}
        <div className="w-full">
          <div className="relative flex h-full min-h-80 w-full items-center justify-center overflow-hidden rounded-lg border bg-muted/30">
            <img
              src={`${process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_BUCKET_EVENT_COVER}/${event?.image_link}`}
              alt={`${event?.title} cover`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Right: event details */}
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Title
            </span>
            <p className="text-lg font-semibold">{event?.title}</p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Description
            </span>
            <p className="min-h-40 text-sm">{event?.description}</p>
          </div>

          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Available slots
              </span>
              <Badge variant="secondary">{event?.max_slot} open</Badge>
            </div>
            <div className="flex gap-2">
              {auth?.role === 'authenticated'
                ? (<Button
                    type="button"
                    disabled={subscribed}
                    onClick={() => subscribeToShow(event.id)}
                  >
                    {subscribed ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Subscribed
                      </>
                    ) : (
                      "Subscribe"
                    )}
                  </Button>)
                :(<Button onClick={() => router.push("/login")}>Sign in to Subscribe</Button>)
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
