"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Placeholder data — no backend wiring yet, UI only.
const event = {
  imageUrl: "https://avatar.vercel.sh/shadcn1",
  title: "Community Meetup",
  description:
    "Join fellow developers for an evening of talks, demos, and networking. Light refreshments will be provided.",
  availableSlots: 24,
};

export default function EventSubscribePage() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <>
      <h1 className="mb-4">Event Details</h1>
      <div className="grid lg:flex min-h-[75vh] gap-12">
        {/* Left: event image */}
        <div className="w-full">
          <div className="relative flex h-full min-h-80 w-full items-center justify-center overflow-hidden rounded-lg border bg-muted/30">
            <img
              src={event.imageUrl}
              alt={`${event.title} cover`}
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
            <p className="text-lg font-semibold">{event.title}</p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Description
            </span>
            <p className="min-h-40 text-sm">{event.description}</p>
          </div>

          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Available slots
              </span>
              <Badge variant="secondary">{event.availableSlots} open</Badge>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                disabled={subscribed}
                onClick={() => setSubscribed(true)}
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Subscribed
                  </>
                ) : (
                  "Subscribe"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
