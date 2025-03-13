"use client";

import { ProductWithRelatedData } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import {
  Check,
  CheckCircle,
  CircleX,
  MoreHorizontal,
  PencilLine,
  Archive,
} from "lucide-react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  updateIsFeatured,
  updateProductStatus,
} from "@/app/(server)/actions/product-mutations";
import Link from "next/link";
import { ImageWithSkeleton } from "@/components/image-with-skeleton";

export const productsColumns: ColumnDef<ProductWithRelatedData>[] = [
  {
    accessorKey: "product",
    size: 300,
    filterFn: "productFilter" as any,
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
        <div className="w-10 h-10 rounded-lg overflow-hidden">
          <ImageWithSkeleton
            className="w-full h-full object-cover"
            src={row.original.image as string}
            alt={row.original.name}
            width={40}
            height={40}
          />
        </div>
        <span className="font-semibold">{row.original.name}</span>
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
    size: 150,
    filterFn: "categoryFilter" as any,
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
    cell: ({ row }) => (
      <span className="text-sm">{row.original.category.name}</span>
    ),
  },
  {
    accessorKey: "variants",
    size: 100,
    header: "Variants",
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="secondary">{row.original.variants.length}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "price",
    size: 120,
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
    size: 100,
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
    accessorKey: "featured",
    size: 100,
    header: "Featured",
    cell: ({ row }) => {
      const status = row.original.isFeatured;
      const variant = status ? "text-green-500" : "text-muted-foreground";
      return (
        <>
          <Button variant="ghost">
            <span className={cn(variant, "place-content-center")}>
              {status ? (
                <Check className="h-4 w-4" />
              ) : (
                <CircleX className="h-4 w-4" />
              )}
            </span>
          </Button>
        </>
      );
    },
  },
  {
    accessorKey: "actions",
    size: 100,
    header: "Actions",
    cell: ({ row }) => {
      const id = row.original.id;
      const isFeatured = row.original.isFeatured;
      const isArchived = row.original.status === "archived";
      return (
        <div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 focus-visible:ring-offset-1"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {id && (
                <Link href={`/admin/products/edit/${id}`} className="w-full">
                  <DropdownMenuItem className="cursor-pointer">
                    <PencilLine className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                </Link>
              )}
              {typeof updateIsFeatured === "function" && (
                <DropdownMenuItem
                  onClick={async () => {
                    await updateIsFeatured(id, !isFeatured);
                  }}
                  className="cursor-pointer"
                >
                  {isFeatured ? (
                    <>
                      <CircleX className="text-muted-foreground mr-2 h-4 w-4" />
                      <span>Remove Featured</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="text-green-500 mr-2 h-4 w-4" />
                      <span>Add Featured</span>
                    </>
                  )}
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className={cn(
                  "text-destructive focus:text-destructive cursor-pointer",
                  isArchived && "text-muted-foreground"
                )}
                onClick={async () => {
                  await updateProductStatus(id, isArchived ? "visible" : "archived");
                }}
              >
                {isArchived ? (
                  <>
                    <Archive className="mr-2 h-4 w-4" />
                    <span>Unarchive</span>
                  </>
                ) : (
                  <>
                    <Archive className="mr-2 h-4 w-4" />
                    <span>Archive</span>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
