"use client";

import React, { startTransition } from "react";
import { MinusCircle, PlusCircle, X } from "lucide-react";
import { ImageWithSkeleton } from "../image-with-skeleton";
import { Button } from "../ui/button";
import { QuotationWithRelations } from "@/app/types";
import { useQuotation } from "../providers/quotation-provider";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { QuotationItem } from "@prisma/client";
import { cn } from "@/lib/utils";
import {
  removeQuotationItem,
  updateQuotationQuantity,
} from "@/app/(server)/actions/quotation-mutations";

const QuantityButton = ({
  type,
  item,
  updateQuantity,
  className,
}: {
  type: "increment" | "decrement";
  item: QuotationItem;
  updateQuantity: (variantId: string, type: "increment" | "decrement") => void;
  className?: string;
}) => {
  const router = useRouter();

  return (
    <form
      action={async () => {
        updateQuantity(item.id, type);
        await updateQuotationQuantity(
          item.id,
          type === "increment"
            ? Number(item.quantity) + 1
            : Number(item.quantity) - 1
        );
        // router.refresh();
      }}
    >
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className={cn("h-8 w-8 rounded-full", className)}
      >
        {type === "increment" ? (
          <PlusCircle className="h-4 w-4" />
        ) : (
          <MinusCircle className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};

export const QuotationItemCard = ({
  item,
}: {
  item: NonNullable<
    QuotationWithRelations["quotation"]
  >["QuotationItem"][number];
}) => {
  const { removeToQuotation, updateQuantity } = useQuotation();
  const router = useRouter();
  const { toast } = useToast();

  const handleRemoveItem = async (itemId: string) => {
    try {
      startTransition(() => {
        removeToQuotation(itemId);
      });
      await removeQuotationItem(itemId);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: `[${
          (error as Error).name
        }] Failed to remove item from quotation`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-4 border-b border-gray-100 py-4">
      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleRemoveItem(item.id)}
        className="h-6 w-6 shrink-0 rounded-full p-0 text-gray-400 hover:text-gray-900"
      >
        <X className="h-4 w-4" />
      </Button>

      {/* Product Image */}
      <div className="h-16 w-16 shrink-0">
        <ImageWithSkeleton
          src={item.variant?.product.image || ""}
          alt={item.variant?.product.name || ""}
          width={64}
          height={64}
          className="rounded-md object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        <h3 className="text-sm font-medium text-gray-900">
          {item.variant?.product.name}
        </h3>
        <p className="text-xs text-gray-500">
          {item.variant?.attributes.map((attr) => attr.value).join(" / ")}
        </p>

        {/* Price */}
        <p className="mt-1 text-sm font-medium">
          ₱
          {(
            Number(item.variant?.price) * Number(item.quantity)
          ).toLocaleString()}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center rounded-full border border-gray-200 bg-white">
        <QuantityButton
          type="decrement"
          item={item}
          updateQuantity={updateQuantity}
          className="text-gray-400 hover:text-gray-900"
        />
        <span className="w-8 text-center text-sm font-medium">
          {Number(item.quantity)}
        </span>
        <QuantityButton
          type="increment"
          item={item}
          updateQuantity={updateQuantity}
          className="text-gray-400 hover:text-gray-900"
        />
      </div>
    </div>
  );
};
