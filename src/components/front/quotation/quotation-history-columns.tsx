"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QuotationItemWithRelations } from "@/app/types";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export const columns: ColumnDef<QuotationItemWithRelations>[] = [
  {
    accessorKey: "requestDate",
    header: "Requested At",
    cell: ({ row }) => (
      <span>{row.original.createdAt.toLocaleString().split("T")[0]}</span>
    ),
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => (
      <span>{row.original.quotation.QuotationItem.length}</span>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: ({ row }) => {
      const quotationItems = row.original.quotation.QuotationItem;
      const totalPrice = quotationItems.reduce(
        (acc, item) =>
          acc + Number(item?.variant?.price) * Number(item?.quantity),
        0
      );
      return <span>{formatCurrency(totalPrice)}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        className="rounded-sm"
        variant={row.original.status == "Responded" ? "default" : "secondary"}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    // Accepts row as a parameter.
    // Removed here for linting reasons
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={`/quotation/history/${row.original.quotation.id}`}>
              <DropdownMenuItem>
                <SquareArrowOutUpRight />
                View
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
