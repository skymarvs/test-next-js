'use client'

import { DataTable } from "@/components/custom/data-table/data-table";
import { getUserMetadata } from "@/contexts/role-provider";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { columns } from "@/app/events-page/[auth_uuid]/columns";
import createClient from "@/lib/supabase/client";
import { Event } from "@/lib/types/models";

type ManageEventSlug = {
    auth_uuid: string
}

async function getData() : Promise<Event[] | null>{
  const supabase = await createClient();
  const { data, error} = await supabase.from('events').select('*');
  return data;
}

export default function ManageEventPage(){
    const { auth_uuid } = useParams<ManageEventSlug>();
    const userMetadata = getUserMetadata();
    const router = useRouter();
    const [events, setEvents] = useState<Event[] | null>([]);

    useEffect(() => {
        if(userMetadata?.sub !== auth_uuid){
            router.back(); 
        }
    }, [auth_uuid, router, userMetadata])

    useEffect(() => {
        getData().then((data) => setEvents(data));
    }, [])

    return (<>
        <DataTable columns={columns} data={events ?? []} searchFilter={ {column_name: 'title', placeholder: "Search by title"}}/>
    </>);
}