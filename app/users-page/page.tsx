"use client"

import { columns, Payment } from "@/app/users-page/columns"
import { DataTable } from "@/components/custom/data-table/data-table"
import { useEffect, useState } from "react"

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

export default function DemoPage() {
    const [payment, setPayment] = useState<Payment[]>([]);
  
    useEffect(() => {
      getData().then((data) => setPayment(data));
    }, []);

    return (<>
        <h1 className="mb-4">Users Page</h1>
        <DataTable columns={columns} data={payment} />
    </>);
}