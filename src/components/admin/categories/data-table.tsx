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
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryTree } from "@/app/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchInput } from "@/components/ui/search-input";

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
    getSubRows: (row) => (row as CategoryTree).subcategories as any, // Add this line to handle subcategories
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
    <Card className="rounded-sm shadow-none">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="pb-4">
            <SearchInput
              placeholder="Tools, Metal and Steel, etc."
              value={
                (table.getColumn("category")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("category")?.setFilterValue(event.target.value)
              }
              className="max-w-[400px]"
            />
          </div>
        </div>
        <div className="bg-background  border rounded-sm overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted border-none">
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
                          <TableRow
                            key={subcategory.id}
                            className="bg-muted/50"
                          >
                            {row.getVisibleCells().map((cell) => {
                              // Skip the dropdown column for subcategories
                              if (cell.column.id === "dropdown") {
                                return (
                                  <TableCell
                                    key={`empty-${cell.id}`}
                                  ></TableCell>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
