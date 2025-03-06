"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { useQuotation } from "../providers/quotation-provider";
import { addQuotationItem } from "@/app/(server)/actions/quotation-mutations";
import { SerializedProductVariant } from "@/app/types";

export function AddToQuotationButton({
  quantity,
  selectedVariant,
}: {
  quantity: number;
  selectedVariant: SerializedProductVariant;
}) {
  const { toast } = useToast();
  const { addToQuotation } = useQuotation();

  const handleAddToQuotation = async () => {
    if (!selectedVariant) return;

    try {
      // First, trigger optimistic update immediately
      addToQuotation(selectedVariant.id, quantity);
      // Then, perform the server action in the background
      await addQuotationItem({
        variantId: selectedVariant.id,
        quantity,
      });
    } catch (error) {
      toast({
        title: "Error adding to quotation",
        description: "An error occured. Please make sure you are logged in.",
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
