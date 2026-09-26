"use client";

import { DataTable } from "@/components/custom/data-table/data-table";
import { useAuthPayload } from "@/contexts/auth-provider";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { columns } from "@/app/events/[slug]/_components/columns";
import { subscribedColumns } from "@/app/events/[slug]/_components/subscribed-columns";
import { getMySubscribedEvents } from "@/app/actions/events";
import createClient from "@/lib/supabase/client";
import { Event } from "@/lib/types/models";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ManageEventSlug = {
  slug: string;
};

async function getData(uuid : string): Promise<Event[] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select("*").eq("created_by", uuid);
  if (error) {
    throw new Error("fdsaf");
  }
  return data;
}

export default function ManageEventPage() {
  const slug = useParams<ManageEventSlug>().slug;
  const auth = useAuthPayload();
  const router = useRouter();
  const [events, setEvents] = useState<Event[] | null>([]);
  const [subscribedEvents, setSubscribedEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (auth?.sub !== slug) {
      router.back();
    }
  }, [slug, router, auth]);

  useEffect(() => {
    getData(slug)
      .then((data) => setEvents(data))
      .catch((error) => {
        if (error instanceof Error) {
          toast.add({
            title: "Failed to fetch events.",
            description: error.message,
            type: "error",
          });
        }
      });
  }, [slug]);

  useEffect(() => {
    if (!auth?.sub) return;
    getMySubscribedEvents()
      .then((data) => setSubscribedEvents(data))
      .catch((error) => {
        if (error instanceof Error) {
          toast.add({
            title: "Failed to fetch subscribed events.",
            description: error.message,
            type: "error",
          });
        }
      });
  }, [auth?.sub]);

  return (
    <>
      <h1 className="mb-4">Events Page</h1>
      <Tabs>
        <TabsList>
          <TabsTrigger value="own">Own Events</TabsTrigger>
          <TabsTrigger value="subscribed">Subscribed Events</TabsTrigger>
        </TabsList>
        <TabsContent value="subscribed">
          <DataTable
            columns={subscribedColumns}
            data={subscribedEvents}
            searchFilter={{ column_name: "title", placeholder: "Search by title" }}
          />
        </TabsContent>
        <TabsContent value="own">
          <DataTable
            columns={columns}
            data={events ?? []}
            searchFilter={{ column_name: "title", placeholder: "Search by title" }}
            actionButton={
              <Button onClick={() => router.push(`/events/${slug}/new`)}>
                Create Event
              </Button>
            }
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
