"use client";

import { Badge } from "@/components/ui/badge";
import { Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<
  Prisma.QuotationRequestGetPayload<{
    include: {
      quotation: {
        include: {
          QuotationItem: {
            include: { variant: true };
          };
        };
      };
    };
  }>
>[] = [
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
          acc + Number(item?.variant.price) * Number(item?.quantity),
        0
      );
      return <span>₱ {totalPrice.toLocaleString()}</span>;
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
    cell: ({ row }) => {
      const payment = row.original;

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
            <DropdownMenuItem>View</DropdownMenuItem>
            <DropdownMenuItem>Print</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
