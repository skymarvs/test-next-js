"use client"

import { createColumnHelper } from "@tanstack/react-table"

import { type DataTableFeatures } from "@/components/custom/data-table/data-table-features"
import { DataTableColumnHeader } from "@/components/custom/data-table/column-header"
import { Event } from "@/lib/types/models"


// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Event>()

export const columns = columnHelper.columns([
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
  }),
  columnHelper.accessor("created_at", {
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Date Created"} />
    ),
  }),
])