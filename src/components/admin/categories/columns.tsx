"use client";

import { CategoryTree } from "@/app/types";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal, PencilLine, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { ImageWithSkeleton } from "@/components/image-with-skeleton";
import Link from "next/link";

export const categoryColumns: ColumnDef<CategoryTree>[] = [
  {
    id: "dropdown",
    cell: ({ row }) => {
      const hasSubcategories =
        row.original.subcategories && row.original.subcategories.length > 0;
      return (
        <>
          {hasSubcategories && (
            <Button
              onClick={() => row.toggleExpanded()}
              variant="ghost"
              size="icon"
            >
              <ChevronDown
                className={cn(
                  "h-5 w-5 transition-transform cursor-pointer",
                  (row.getIsExpanded() && hasSubcategories
                    ? "rotate-180 bg-primary/20 rounded-full text-primary"
                    : "") + (hasSubcategories ? "" : "text-muted-foreground")
                )}
              />
            </Button>
          )}
        </>
      );
    },
  },
  {
    id: "category",
    accessorKey: "category",
    filterFn: "includeSubcategories",
    header: () => {
      return <span>Category</span>;
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <ImageWithSkeleton
              src={row.original.image || ""}
              alt={row.original.name}
              width={40}
              height={40}
              className="rounded-md"
            />
            <span className="font-medium">{row.original.name}</span>
            {row.original.subcategories &&
              row.original.subcategories.length > 0 && (
                <span className="text-muted-foreground">
                  ({row.original.subcategories.length})
                </span>
              )}
          </div>
        </div>
      );
    },
  },
  {
    id: "products",
    accessorKey: "products",
    header: () => {
      return <span>Products</span>;
    },
    cell: ({ row }) => {
      return <span>{row.original.productCount}</span>;
    },
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: () => {
      return <span>Actions</span>;
    },
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link href={`/admin/categories/edit/${row.original.id}`}>
              <DropdownMenuItem>
                <PencilLine className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="text-destructive">
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
