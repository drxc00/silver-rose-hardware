"use client";

import { CategoryTree } from "@/app/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  ChevronDown,
  Loader2,
  MoreHorizontal,
  PencilLine,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ImageWithSkeleton } from "@/components/image-with-skeleton";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { deleteCategory } from "@/app/(server)/actions/category-mutations";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";

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
      const isSubcategory = row.depth > 0;
      return (
        <div className="flex items-center h-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm overflow-hidden">
              <ImageWithSkeleton
                src={row.original.image || ""}
                alt={row.original.name}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className={cn(
                "text-sm",
                isSubcategory ? "text-muted-foreground" : "font-medium"
              )}
            >
              {row.original.name}
            </span>
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
        <div>
          <CategoryActions id={row.original.id} />
        </div>
      );
    },
  },
];

function CategoryActions({ id }: { id: string }) {
  const { executeAsync, isPending } = useAction(deleteCategory);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      {/** Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this category? Deleting a category
            will also delete all its subcategories and products. 
            <span className="text-destructive">
              This action cannot be undone.
            </span>
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <form
              action={async () => {
                try {
                  const result = await executeAsync({ id });
                  if (result?.data?.success) {
                    toast({
                      title: "Category deleted",
                      description: result.data.message,
                    });
                  } else {
                    throw new Error(result?.data?.message);
                  }
                } catch (error) {
                  toast({
                    title: "Failed to delete category",
                    description: (error as Error).message,
                    variant: "destructive",
                  });
                }
              }}
            >
              <Button
                type="submit"
                className="flex items-center gap-2"
                disabled={isPending}
                variant="destructive"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Deleting</span>
                  </>
                ) : (
                  <>
                    <Trash className="h-4 w-4" />
                    <span>Delete</span>
                  </>
                )}
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={`/admin/categories/edit/${id}`}>
            <DropdownMenuItem>
              <PencilLine className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setIsDialogOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>

  );
}
