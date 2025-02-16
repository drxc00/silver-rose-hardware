import { ProductWithRelatedData } from "@/app/types";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";
import { getMinMaxPrice } from "@/lib/products-functions";

export function ProductCard({ product }: { product: ProductWithRelatedData }) {
  const [minPrice, maxPrice] = getMinMaxPrice(product);

  const productAttributes = [
    ...new Set(
      product.variants.flatMap((variant) =>
        variant.attributes.flatMap((attr) => attr.attribute.name)
      )
    ),
  ];
  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="h-full">
        <CardContent className="p-6 flex flex-col justify-between gap-2 h-full">
          <div>
            <div className="relative w-full h-48 mb-4">
              {" "}
              {/* Fixed height container */}
              <Image
                src={product.image || ""}
                alt="Product Card Image"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain" // or object-cover, depending on your preference
              />
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="font-bold text-xl mb-2">{product.name}</h1>
                {product.hasVariant || minPrice != maxPrice ? (
                  <h2>
                    ₱ {minPrice.toFixed(2)}-{maxPrice.toFixed(2)}
                  </h2>
                ) : (
                  <h2>₱ {minPrice.toFixed(2)}</h2>
                )}
              </div>
              <div className="flex gap-2">
                {productAttributes.length > 0 &&
                  productAttributes.map((attr) => (
                    <Badge key={attr} variant="secondary" className="rounded-sm px-2 py-1">
                      {attr}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
          <div className="w-full">
            {product.hasVariant ? (
              <Button className="w-full" variant="secondary">
                View Options
              </Button>
            ) : (
              <Button className="w-full">Add to Quotation</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
