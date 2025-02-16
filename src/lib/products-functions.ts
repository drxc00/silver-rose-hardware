import {
  ProductWithRelatedData,
  SerializedProductWithRelatedData,
} from "@/app/types";

// We create this function called getMinMaxPrice which basicall returns the min and max price of a product
// In this way, we abstract the logic from the component.
// A the same time, we can reuse this function in other components
export function getMinMaxPrice(
  product: ProductWithRelatedData | SerializedProductWithRelatedData
): [number, number] {
  const productVariants = product.variants;

  // Simply uses a reducer to get the min and max price
  const minPrice = productVariants.reduce(
    (min, variant) => Math.min(min, Number(variant.price)),
    Infinity
  );
  const maxPrice = productVariants.reduce(
    (max, variant) => Math.max(max, Number(variant.price)),
    -Infinity
  );

  return [minPrice, maxPrice];
}
