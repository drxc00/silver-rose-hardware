"use client";

import { CategoryTree } from "@/app/types";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDownCircle, PencilLine, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const categoryColumns: ColumnDef<CategoryTree>[] = [
  {
    id: "dropdown",

    cell: ({ row }) => {
      const hasSubcategories =
        row.original.subcategories && row.original.subcategories.length > 0;
      return (
        <ChevronDownCircle
          className={cn(
            "h-5 w-5 transition-transform cursor-pointer",
            (row.getIsExpanded()
              ? "rotate-180 bg-primary/20 rounded-full text-primary"
              : "") + (hasSubcategories ? "" : "text-muted-foreground")
          )}
          onClick={() => row.toggleExpanded()}
        />
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
          <span className="font-medium">{row.original.name}</span>
          {row.original.subcategories &&
            row.original.subcategories.length > 0 && (
              <span className="text-muted-foreground">
                ({row.original.subcategories.length})
              </span>
            )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: () => {
      return (
        <div className="flex gap-2 justify-end">
          <Button size="sm">
            <PencilLine className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button size="sm" variant="outline">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    meta: {
      align: "right",
      sticky: "right", // Add this to make the column stick to the right
    },
  },
];
