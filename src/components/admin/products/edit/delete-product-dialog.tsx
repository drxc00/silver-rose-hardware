"use client";

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { hardDeleteProduct } from "@/app/(server)/actions/product-mutations";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function DeleteProductDialog({ productId }: { productId: string }) {
  const { executeAsync, isPending } = useAction(hardDeleteProduct);
  const router = useRouter();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-destructive text-destructive hover:bg-destructive hover:text-white"
        >
          <Trash className="h-4 w-4" />
          Delete product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete product</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This action cannot be undone. This will delete the product and all
          associated data.
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DialogClose>
          <form
            action={async () => {
              try {
                const result = await executeAsync({ id: productId });
                if (!result?.data?.success) {
                  toast({
                    title: "Error deleting product",
                    description: result?.data?.message,
                    variant: "destructive",
                  });
                } else {
                  toast({
                    title: "Product deleted successfully",
                  });
                  window.location.href = "/admin/products";
                }
              } catch (error) {
                toast({
                  title: "Error deleting product",
                  description: (error as Error).message,
                  variant: "destructive",
                });
              }
            }}
          >
            <Button variant="destructive" size="sm" disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
