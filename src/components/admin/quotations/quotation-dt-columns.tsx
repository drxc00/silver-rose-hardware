"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QuotationItemWithRelations } from "@/app/types";
import Link from "next/link";

export const columns: ColumnDef<QuotationItemWithRelations>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => (
      <span>
        #{row.original.quotation.quotationNumber.toString().padStart(4, "0")}
      </span>
    ),
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => <span>{row.original.user.name}</span>,
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
    accessorKey: "requestDate",
    header: "Requested At",
    cell: ({ row }) => (
      <span>{row.original.createdAt.toLocaleString().split("T")[0]}</span>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
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
            <Link href={`/admin/quotations/view/${row.original.id}`}>
              <DropdownMenuItem>View</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>Print</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
