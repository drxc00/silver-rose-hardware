import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ProductWithRelatedData,
  SerializedProductWithRelatedData,
} from "@/app/types";
import Link from "next/link";
import { getMinMaxPrice } from "@/lib/products-functions";

interface ProductCardStackProps {
  product: ProductWithRelatedData | SerializedProductWithRelatedData;
  onViewOptions?: () => void;
  onAddToQuotation?: () => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(price);

export function ProductCardStack({
  product,
  onViewOptions,
  onAddToQuotation,
}: ProductCardStackProps) {
  const [minPrice, maxPrice] = getMinMaxPrice(product);
  const productAttributes = Array.from(
    new Set(
      product.variants.flatMap((variant) =>
        variant.attributes.map((attr) => attr.attribute.name)
      )
    )
  );

  const priceRange = `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="">
        <CardContent className="p-4 sm:p-6 w-full">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
            {/* Image Container */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={product.image || "/placeholder-product.png"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 96px, 96px"
                className="object-contain rounded-md"
                priority
              />
            </div>

            {/* Product Details */}
            <div className="flex-grow space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 line-clamp-2">
                {product.name}
              </h2>
              <p className="text-md font-medium text-gray-700">{priceRange}</p>

              {productAttributes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {productAttributes.map((attr) => (
                    <Badge
                      key={attr}
                      variant="secondary"
                      className="px-2 py-1 text-sm rounded-sm"
                    >
                      {attr}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="w-full sm:w-auto flex-shrink-0">
              {product.hasVariant ? (
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto min-w-[140px]"
                  onClick={onViewOptions}
                >
                  View Options
                </Button>
              ) : (
                <Button
                  className="w-full sm:w-auto min-w-[140px]"
                  onClick={onAddToQuotation}
                >
                  Add to Quotation
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
