"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { useQuotation } from "../providers/quotation-provider";
import { addQuotationItem } from "@/app/(server)/actions/quotation-mutations";
import { SerializedProductVariant } from "@/app/types";
import { useAction } from "next-safe-action/hooks";

export function AddToQuotationButton({
  quantity,
  selectedVariant,
}: {
  quantity: number;
  selectedVariant: SerializedProductVariant;
}) {
  const { toast } = useToast();
  const { addToQuotation } = useQuotation();
  const { executeAsync } = useAction(addQuotationItem);

  const handleAddToQuotation = async () => {
    if (!selectedVariant) return;

    try {
      // First, trigger optimistic update immediately
      addToQuotation(selectedVariant.id, quantity);
      toast({
        title: "Added to quotation",
      });
      // Then, perform the server action in the background
      const result = await executeAsync({
        variantId: selectedVariant.id,
        quantity,
      });

      if (!result?.data?.success) throw new Error(result?.data?.message);

    } catch (error) {
      toast({
        title: "Error adding to quotation",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <form
      action={async () => {
        handleAddToQuotation();
      }}
    >
      <Button className="w-full rounded-sm" size="lg">
        Add to Quotation
      </Button>
    </form>
  );
}
