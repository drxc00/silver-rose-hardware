"use client";

import {
  ProductWithRelatedData,
  SerializedProductVariant,
  SerializedProductWithRelatedData,
} from "@/app/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../ui/card";
import { Loader2, MinusIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  SelectValue,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Input } from "../ui/input";
import { useProductAttributes } from "@/hooks/use-product-attributes";
import { useToast } from "@/hooks/use-toast";
import { useQuotation } from "../providers/quotation-provider";
import { addQuotationItem } from "@/app/(server)/actions/quotation-mutations";
import { useRouter } from "next/navigation";

interface ProductPageCardProps {
  product: ProductWithRelatedData | SerializedProductWithRelatedData;
}

export function ProductPageCard({ product }: ProductPageCardProps) {
  // State management
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] =
    useState<SerializedProductVariant | null>(null);
  const [addingToQuotation, setAddingToQuotation] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  // Hooks
  const { toast } = useToast();
  const { params, setParams } = useProductAttributes();
  const { addToQuotation } = useQuotation();
  const router = useRouter();

  // Process variant attributes
  const variantAttributes = product.variants.reduce((acc, variant) => {
    variant.attributes.forEach((attribute) => {
      const attrName = attribute.attribute.name;
      if (!acc[attrName]) {
        acc[attrName] = new Set();
      }
      acc[attrName].add(attribute.value);
    });
    return acc;
  }, {} as Record<string, Set<string>>);

  // Convert Sets to Arrays for rendering
  const processedAttributes = Object.entries(variantAttributes).reduce(
    (acc, [key, values]) => {
      acc[key] = Array.from(values);
      return acc;
    },
    {} as Record<string, string[]>
  );

  // Update selected variant when attributes change
  useEffect(() => {
    const variant = product.variants.find((variant) =>
      variant.attributes.every(
        (attr) => selectedAttributes[attr.attribute.name] === attr.value
      )
    );

    if (variant) {
      setSelectedVariant(variant as SerializedProductVariant);
      setPrice(Number(variant.price));
    }
  }, [selectedAttributes, product.variants]);

  // Initialize selected attributes from params
  useEffect(() => {
    if (params) {
      setSelectedAttributes(params);
    }
  }, [params]);

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
      router.refresh();
      toast({
        title: "Added to quotation",
        description: "Product added to quotation successfully",
      });
    } catch (error) {
      // Handle error (maybe implement a rollback of the optimistic update)
      toast({
        title: "Error adding to quotation",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    const validQuantity = Math.max(1, newQuantity);
    setQuantity(validQuantity);
  };

  return (
    <Card className="w-full border-none shadow-none">
      <CardContent className="space-y-6 p-8">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-3xl font-semibold text-red-600">
            ₱{" "}
            {price > 0
              ? price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "--"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.entries(processedAttributes).map(
            ([attributeName, values]) => (
              <div key={attributeName} className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {attributeName}
                </label>
                <Select
                  value={selectedAttributes[attributeName] || ""}
                  onValueChange={(value) => {
                    setSelectedAttributes((prev) => ({
                      ...prev,
                      [attributeName]: value,
                    }));
                    setParams(attributeName, value);
                  }}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder={`Select ${attributeName}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {values.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Quantity</label>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              className="w-16 text-center"
            />
            <Button
              variant="outline"
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <form action={async() => {
          handleAddToQuotation();
        }}>
          <Button
            className="w-full"
            size="lg"
            
            disabled={addingToQuotation || !selectedVariant}
          >
            {addingToQuotation ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding to quotation...
              </>
            ) : (
              "Add to Quotation"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
