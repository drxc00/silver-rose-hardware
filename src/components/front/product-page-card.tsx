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
import { addQuotationItem } from "@/app/(server)/actions/quotation-mutations";
import { useToast } from "@/hooks/use-toast";

export function ProductPageCard({
  product,
}: {
  product: ProductWithRelatedData | SerializedProductWithRelatedData;
}) {
  const variants = product.variants;
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] =
    useState<SerializedProductVariant | null>(null);
  const [addingToQuotation, setAddingToQuotation] = useState(false);

  const { toast } = useToast();

  // Keeping all the existing logic unchanged
  const variantAttributes = variants.reduce((acc, variant) => {
    for (let i = 0; i < variant.attributes.length; i++) {
      const attribute = variant.attributes[i];
      if (
        acc[attribute.attribute.name] &&
        acc[attribute.attribute.name].includes(attribute.value)
      ) {
        continue;
      }
      if (acc[attribute.attribute.name]) {
        acc[attribute.attribute.name].push(attribute.value);
      } else {
        acc[attribute.attribute.name] = [attribute.value];
      }
    }
    return acc;
  }, [] as unknown as Record<string, string[]>);

  const { params, setParams, removeParams } = useProductAttributes();

  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<keyof typeof variantAttributes, string> | {}
  >(params || {});

  useEffect(() => {
    const selectedVariant = variants.find((variant) => {
      return variant.attributes.every((attribute) => {
        return (
          attribute.attribute.name in selectedAttributes &&
          attribute.value ===
            selectedAttributes[
              attribute.attribute.name as keyof typeof selectedAttributes
            ]
        );
      });
    });
    if (selectedVariant) {
      setSelectedVariant(selectedVariant as SerializedProductVariant);
      setPrice(Number(selectedVariant.price) ?? 0);
    }
  }, [selectedAttributes]);

  const handleAddToQuotation = async () => {
    setAddingToQuotation(true);
    const payload = {
      variantId: selectedVariant?.id as string,
      quantity: quantity,
    };
    try {
      await addQuotationItem(payload);
      toast({
        title: "Added to quotation",
        description: "Product added to quotation successfully",
      });
    } catch (error) {
      toast({
        title: "An error occurred while adding to quotation",
        description: (error as Error).message, // This typecasting is so dumb bruh
        variant: "destructive",
      });
    } finally {
      setAddingToQuotation(false);
    }
  };

  return (
    <Card className="w-full border-noneshadow-none">
      <CardContent className="space-y-6 p-8">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          {price > 0 ? (
            <p className="text-3xl font-semibold text-red-600">
              ₱ {price.toFixed(2)}
            </p>
          ) : (
            <p className="text-3xl font-semibold text-red-600">₱ --</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.keys(variantAttributes).map((key) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{key}</label>
              <Select
                onValueChange={(value) => {
                  setSelectedAttributes((prev) => ({ ...prev, [key]: value }));
                  setParams(key as any, value);
                }}
                value={
                  // Typescript is so dumb lmao
                  selectedAttributes[key as keyof typeof selectedAttributes] ||
                  ""
                }
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder={`Select ${key}`} />
                </SelectTrigger>
                <SelectContent>
                  {variantAttributes[key].map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Quantity</label>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              <MinusIcon className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 rounded-md border border-gray-200 text-center"
            />
            <Button onClick={() => setQuantity(quantity + 1)}>
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleAddToQuotation}
          disabled={addingToQuotation}
        >
          {addingToQuotation ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <span>Add to Quotation</span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
