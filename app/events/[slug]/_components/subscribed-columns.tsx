"use client";

import { createColumnHelper, type Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import { type DataTableFeatures } from "@/components/custom/data-table/data-table-features";
import { DataTableColumnHeader } from "@/components/custom/data-table/column-header";
import { Button } from "@/components/ui/button";
import { Event } from "@/lib/types/models";

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Event>();

function SubscribedEventActionsCell({ row }: { row: Row<DataTableFeatures, Event> }) {
  const router = useRouter();
  const event = row.original;

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => router.push(`/events/${event.created_by}/show/${event.id}`)}
    >
      View
    </Button>
  );
}

export const subscribedColumns = columnHelper.columns([
  columnHelper.accessor("id", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"ID"} />
    ),
  }),
  columnHelper.accessor("title", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Title"} />
    ),
  }),
  columnHelper.accessor("description", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Description"} />
    ),
    cell: ({ getValue })  => {
      return (
        <div className="line-clamp-4 whitespace-normal">
          {getValue()}
        </div>
      );
    }
  }),
  columnHelper.accessor("created_at", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Date Created"} />
    ),
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <SubscribedEventActionsCell row={row} />,
  }),
]);
