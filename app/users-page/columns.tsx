"use client";

import { createColumnHelper } from "@tanstack/react-table";

import { type DataTableFeatures } from "@/components/custom/data-table/data-table-features";
import { DataTableColumnHeader } from "@/components/custom/data-table/column-header";
import { Profile } from "@/lib/types/models";

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Profile>();

export const columns = columnHelper.columns([
  columnHelper.accessor("full_name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Name"} />
    ),
  }),
  columnHelper.accessor("email", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"email"} />
    ),
  }),
  columnHelper.accessor("created_at", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Date Created"} />
    ),
  }),
]);
