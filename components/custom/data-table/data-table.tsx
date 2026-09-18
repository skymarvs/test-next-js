"use client"

import { ColumnFiltersState, useTable, type ColumnDef, type RowData } from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { features, type DataTableFeatures } from "@/components/custom/data-table/data-table-features"
import { DataTablePagination } from "./paginations"
import { DataTableViewOptions } from "./toggle"
import { useState } from "react"
import { Input } from "@/components/ui/input"

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  searchFilter?: SearchFilterProps
}

interface SearchFilterProps {
  column_name: string
  placeholder: string
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  searchFilter
}: DataTableProps<TData>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const table = useTable({
        features,
        data,
        columns,
        onColumnFiltersChange: setColumnFilters,
        state: {
            columnFilters
        }
    })

    return (<>
        <div className="flex justify-between gap-2">
            {
                searchFilter && (
                    <Input
                        placeholder={searchFilter.placeholder}
                        value={(table.getColumn(searchFilter.column_name)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(searchFilter.column_name)?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                )
            }
            <DataTableViewOptions table={table}/>
        </div>
        <div className="overflow-hidden rounded-md border my-4">
            <Table>
                <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                        <TableHead key={header.id}>
                            {header.isPlaceholder ? null : (
                            <table.FlexRender header={header} />
                            )}
                        </TableHead>
                        )
                    })}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                    >
                        {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                            <table.FlexRender cell={cell} />
                        </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
        <div className="my-4">
            <DataTablePagination table={table} />
        </div>
    </>);
}