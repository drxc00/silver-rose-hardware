import { fetchRelatedProducts } from "@/lib/data-fetch";
import { ProductCard } from "../product-card";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export async function RelatedProducts({ productId }: { productId: string }) {
  const relatedProducts = await fetchRelatedProducts(productId);
  return (
    <div className="grid grid-cols-4 gap-4">
      {relatedProducts.slice(0, 4).map(
        (relatedProduct) =>
          // This ensures that the current product is not displayed
          relatedProduct.id !== productId && (
            <ProductCard
              key={relatedProduct.id}
              product={JSON.parse(JSON.stringify(relatedProduct))}
            />
          )
      )}
    </div>
  );
}

export function RelatedProductsSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="h-full space-y-6">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full p-6" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
