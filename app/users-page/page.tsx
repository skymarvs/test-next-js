import { columns, Payment } from "@/app/users-page/columns"
import { DataTable } from "@/components/custom/data-table/data-table"

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

export default async function DemoPage() {
    const data = await getData()
    return (<>
        <h1 className="mb-4">Users Page</h1>
        <DataTable columns={columns} data={data} />
    </>);
}