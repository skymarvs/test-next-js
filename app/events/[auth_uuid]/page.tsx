"use client";

import { DataTable } from "@/components/custom/data-table/data-table";
import { useUserMetadata } from "@/contexts/role-provider";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { columns } from "@/app/events/[auth_uuid]/_components/columns";
import createClient from "@/lib/supabase/client";
import { Event } from "@/lib/types/models";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

type ManageEventSlug = {
  auth_uuid: string;
};

async function getData(): Promise<Event[] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select("*");
  if (error) {
    throw new Error("fdsaf");
  }
  return data;
}

export default function ManageEventPage() {
  const slug = useParams<ManageEventSlug>().auth_uuid;
  const userMetadata = useUserMetadata();
  const router = useRouter();
  const [events, setEvents] = useState<Event[] | null>([]);

  useEffect(() => {
    if (userMetadata?.sub !== slug) {
      router.back();
    }
  }, [slug, router, userMetadata]);

  useEffect(() => {
    getData()
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
  }, []);

  return (
    <>
      <h1 className="mb-4">Events Page</h1>
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
    </>
  );
}
