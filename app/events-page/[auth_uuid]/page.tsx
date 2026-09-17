'use client'

import { DataTable } from "@/components/custom/data-table/data-table";
import { getUserMetadata } from "@/contexts/role-provider";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { columns, Payment } from "@/app/events-page/[auth_uuid]/columns";

type ManageEventSlug = {
    auth_uuid: string
}

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 200,
      status: "failed",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "test@example.com",
    },
    // ...
  ]
}

export default function ManageEventPage(){
    const { auth_uuid } = useParams<ManageEventSlug>();
    const userMetadata = getUserMetadata();
    const router = useRouter();
    const [payment, setPayment] = useState<Payment[]>([]);

    useEffect(() => {
        if(userMetadata?.sub !== auth_uuid){
            router.back(); 
        }
    }, [auth_uuid, router, userMetadata])

    useEffect(() => {
        getData().then((data) => setPayment(data));
    }, [])

    return (<>
        <DataTable columns={columns} data={payment} />
    </>);
}