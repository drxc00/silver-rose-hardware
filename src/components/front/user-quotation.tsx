"use client";

import { QuotationWithRelations } from "@/app/types";
import { Card, CardContent } from "../ui/card";
import { ImageWithSkeleton } from "../image-with-skeleton";
import { Button } from "../ui/button";
import {
  ChevronDown,
  Loader2,
  MinusCircle,
  PlusCircle,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { startTransition, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuotation } from "../providers/quotation-provider";
import { removeQuotationItem } from "@/app/(server)/actions/quotation-mutations";
import { useRouter } from "next/navigation";

interface UserQuotationProps {
  userQuotation: QuotationWithRelations;
}

export function UserQuotation({ userQuotation }: UserQuotationProps) {
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const { toast } = useToast();
  const { quotation: optimisticQuotation, removeToQuotation } = useQuotation();
  const router = useRouter();

  const handleRemoveItem = async (itemId: string) => {
    try {
      startTransition(() => {
        removeToQuotation(itemId);
      });

      // Perform the actual server action
      await removeQuotationItem(itemId);
      router.refresh();

      toast({
        title: "Item removed",
        description: "The item has been removed from your quotation",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from quotation",
        variant: "destructive",
      });
    }
  };

  const calculateSubtotal = () => {
    return optimisticQuotation.quotation.QuotationItem.reduce(
      (acc, item) => acc + Number(item.variant.price) * Number(item.quantity),
      0
    );
  };

  return (
    <div className="mt-6 flex h-[calc(100vh-200px)] flex-col">
      <div className="flex-1 overflow-y-auto pr-1">
        {optimisticQuotation.quotation.QuotationItem.map((item) => (
          <Card key={item.id} className="mb-3">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <ImageWithSkeleton
                      src={item.variant.product.image || ""}
                      alt={item.variant.product.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={removingItemId === item.id}
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      {removingItemId === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold leading-tight">
                      {item.variant.product.name}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-6">
                            <span>Attributes</span>
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="flex flex-col gap-2 p-2">
                          {item.variant.attributes.map((attr) => (
                            <Badge
                              key={attr.id}
                              variant="secondary"
                              className="rounded-sm"
                            >
                              {attr.attribute.name}: {attr.value}
                            </Badge>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <div className="text-md">
                    ₱
                    {(
                      Number(item.variant.price) * Number(item.quantity)
                    ).toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">
                      {Number(item.quantity)}
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-auto space-y-4">
        <Separator />
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-medium">
              ₱{calculateSubtotal().toLocaleString()}
            </span>
          </div>
        </div>
        <Button className="w-full">View Quotation</Button>
      </div>
    </div>
  );
}
