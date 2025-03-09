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
import { cn } from "@/lib/utils";

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
        <div className="bg-background border rounded-sm overflow-x-auto">
          <Table className="table-fixed w-full">
            <TableHeader className="bg-muted border-none">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="h-12">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={cn(
                          "font-semibold text-sm",
                          header.id === "dropdown" ? "w-12" : "",
                          header.id === "category" ? "w-[60%]" : "",
                          header.id === "products" ? "w-[20%]" : "",
                          header.id === "actions" ? "w-[20%]" : ""
                        )}
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
                  const hasSubcategories =
                    originalData.subcategories &&
                    originalData.subcategories.length > 0;
                  return (
                    <React.Fragment key={row.id}>
                      <TableRow 
                        data-state={row.getIsSelected() && "selected"}
                        className="h-12 hover:bg-muted/50 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell 
                            key={cell.id}
                            className={cn(
                              "py-2",
                              cell.column.id === "category" ? "truncate" : ""
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      {row.getIsExpanded() &&
                        hasSubcategories &&
                        originalData.subcategories.map((subcategory) => (
                          <TableRow
                            key={subcategory.id}
                            className="bg-muted/20 hover:bg-muted/30"
                          >
                            {row.getVisibleCells().map((cell) => {
                              if (cell.column.id === "dropdown") {
                                return (
                                  <TableCell
                                    key={`empty-${cell.id}`}
                                    className="relative"
                                  >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/50"></div>
                                  </TableCell>
                                );
                              }
                              return (
                                <TableCell key={`sub-${cell.id}`}>
                                  <div className="flex items-center gap-2 relative">
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
                                  </div>
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
