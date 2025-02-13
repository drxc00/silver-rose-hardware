"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Plus, Printer, Search } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { CategoryTree } from "@/app/types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends CategoryTree, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getSubRows: (row) => (row as any).subcategories, // Add this line to handle subcategories
    state: {
      sorting,
      columnFilters,
    },
    filterFns: {
      includeSubcategories: (row, columnId, filterValue) => {
        // Check if main category matches
        const mainCategoryMatch = String(row.original.name)
          .toLowerCase()
          .includes(filterValue.toLowerCase());
        // If main category matches, return true immediately
        if (mainCategoryMatch) return true;
        // Check subcategories if main category doesn't match
        const subcategories = row.original.subcategories || [];
        return subcategories.some((subcategory: CategoryTree) =>
          String(subcategory.name)
            .toLowerCase()
            .includes(filterValue.toLowerCase())
        );
      },
    },
  });
  return (
    <Card>
      <div className="flex items-center justify-between px-4">
        <div className="py-4">
          <div className="flex h-10 items-center rounded-lg border bg-sidebar pl-3 pr-1 text-sm ring-offset-background">
            <Search className="h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder="Tools, Metal and Steel, etc."
              value={
                (table.getColumn("category")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("category")?.setFilterValue(event.target.value)
              }
              className="w-full p-2 bg-sidebar placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Link href="/admin/categories/add">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Category
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-background border-b">
        <Table>
          <TableHeader className="bg-muted border-t">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.id === "dropdown" ? "1px" : "auto",
                      }} // Add this line
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const originalData = row.original || {};
                // Check if the row has subcategories
                const hasSubcategories =
                  originalData.subcategories &&
                  originalData.subcategories.length > 0;
                return (
                  <React.Fragment key={row.id}>
                    <TableRow data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {/* Display sub categories when triggered */}
                    {row.getIsExpanded() &&
                      hasSubcategories &&
                      originalData.subcategories.map((subcategory) => (
                        <TableRow key={subcategory.id} className="bg-muted/50">
                          {row.getVisibleCells().map((cell) => {
                            // Skip the dropdown column for subcategories
                            if (cell.column.id === "dropdown") {
                              return (
                                <TableCell key={`empty-${cell.id}`}></TableCell>
                              );
                            }
                            return (
                              <TableCell key={`sub-${cell.id}`}>
                                {flexRender(cell.column.columnDef.cell, {
                                  ...cell.getContext(),
                                  row: {
                                    ...row,
                                    original: subcategory as TData,
                                    getValue: (columnId: string) => {
                                      return (subcategory as any)[columnId];
                                    },
                                  },
                                })}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                  </React.Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="py-4 px-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of{" "}
          {table.getRowModel().rows.length}
        </p>
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}
