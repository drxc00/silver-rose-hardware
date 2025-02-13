"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getVariantDTColumns } from "./variant-dt-columns";
import { Attribute } from "@prisma/client";
import { z } from "zod";
import { attributeSchema } from "@/lib/form-schema";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  removeVariant: (index: number) => void;
  addVariant: (attributes: any, price: number) => void;
  updateVariant: (index: number, attributes: any, price: number) => void;
  attributes: Attribute[];
  attributeValues?: z.infer<typeof attributeSchema>[];
}

export function VariantDataTable<TData, TValue>({
  columns,
  data,
  removeVariant,
  addVariant,
  updateVariant,
  attributes,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns: getVariantDTColumns({
      removeVariant,
      addVariant,
      updateVariant,
      attributes,
    }) as any,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      // NOTE: for some reason the global types is not being read, causing type errors.
      // This is a fix for dev. Make sure to investigate this further as it may have side effects.
      includeSubcategories: () => {
        return true;
      },
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
  );
}
