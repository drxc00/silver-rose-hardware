"use client";

import { ProductWithRelatedData } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Ellipsis } from "lucide-react";
import Image from "next/image";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const productsColumns: ColumnDef<ProductWithRelatedData>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.original.id;
      const truncatedId = id.length > 6 ? `${id.slice(0, 6)}...` : id;
      return <span className="truncate w-20">{truncatedId}</span>;
    },
  },
  {
    accessorKey: "product",
    filterFn: "productFilter" as any, // Type assertion
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-4">
        <Image
          className="rounded-lg"
          src={row.original.image as string}
          alt={row.original.name}
          width={40}
          height={40}
        />
        <span>{row.original.name}</span>
      </div>
    ),
    sortingFn: (rowA, rowB) => {
      const nameA = rowA.original.name.toLowerCase();
      const nameB = rowB.original.name.toLowerCase();
      return nameA.localeCompare(nameB);
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.category.name,
  },
  {
    accessorKey: "variants",
    header: "Variants",
    cell: ({ row }) => row.original.variants.length.toString(),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const variants = row.original.variants;
      // Add more robust checks
      if (!row.original.hasVariant) {
        return <div>₱ {Number(variants[0].price).toFixed(2)}</div>;
      }
      const minPrice = variants.reduce(
        (min, variant) => Math.min(min, Number(variant.price)),
        Infinity
      );
      const maxPrice = variants.reduce(
        (max, variant) => Math.max(max, Number(variant.price)),
        -Infinity
      );

      if (minPrice === maxPrice) {
        return <div>₱ {minPrice.toFixed(2)}</div>;
      }

      return (
        <div>
          ₱ {minPrice.toFixed(2)}-{maxPrice.toFixed(2)}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant = status === "visible" ? "default" : "secondary";
      return (
        <Badge className="capitalize rounded-sm" variant={variant}>
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <Ellipsis className="h-4 w-4" />,
  },
];
