"use client";

import {
  ProductWithRelatedData,
  SerializedProductWithRelatedData,
} from "@/app/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { LayoutGridIcon, StretchHorizontal } from "lucide-react";
import { ProductCard } from "./product-card";
import { useState } from "react";
import { ProductCardStack } from "./product-card-stack";
import { cn } from "@/lib/utils";
import { getMinMaxPrice } from "@/lib/products-functions";
import { useUrlFilters } from "@/hooks/use-url-filters";

interface ProductsGridProps {
  products: SerializedProductWithRelatedData[] | ProductWithRelatedData[];
}

export function ProductsGrid({ products }: ProductsGridProps) {
  // Set products view as grid format as default
  const { sort, view, name, category, setParams } = useUrlFilters();
  // const [productsGridView, setProductsGridView] = useState<"grid" | "list">(
  //   "grid"
  // );
  // // Set filter as all as default
  // const [filter, setFilter] = useState<string>("all");

  // We create this function called filterProductsList which basicall filters the products
  // Based on the filter state [all, alphabetical-a-z, alphabetical-z-a, price-low-to-high, price-high-to-low
  const filterProductsList = (products: ProductWithRelatedData[]) => {
    if (sort === "alphabetical-a-z")
      return products.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "alphabetical-z-a")
      return products.sort((a, b) => b.name.localeCompare(a.name));

    // For price filters we use the getMinMaxPrice helper function
    // Which returns the min and max price of a product
    if (sort === "price-low-to-high")
      return products.sort((a, b) => {
        const [minPriceA] = getMinMaxPrice(a);
        const [minPriceB] = getMinMaxPrice(b);
        return minPriceA - minPriceB;
      });
    if (sort === "price-high-to-low")
      return products.sort((a, b) => {
        const [minPriceA] = getMinMaxPrice(a);
        const [minPriceB] = getMinMaxPrice(b);
        return minPriceB - minPriceA;
      });
    return products;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <span className="text-sm text-muted-foreground">Sort by</span>
          <Select
            value={sort || "all"}
            onValueChange={(e) => {
              setParams("sort", e);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="alphabetical-a-z">
                Alphabetically, A-Z
              </SelectItem>
              <SelectItem value="alphabetical-z-a">
                Alphabetically, Z-A
              </SelectItem>
              <SelectItem value="price-low-to-high">
                Price, low to high
              </SelectItem>
              <SelectItem value="price-high-to-low">
                Price, high to low
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-muted-foreground">View</span>
          <Button variant="ghost" onClick={() => setParams("view", "grid")}>
            <LayoutGridIcon className="w-5 h-5" />
          </Button>
          <Button variant="ghost" onClick={() => setParams("view", "list")}>
            <StretchHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
          view === "list" && "hidden"
        )}
      >
        {filterProductsList(products as ProductWithRelatedData[]).map(
          (product) => (
            <ProductCard
              key={product.id}
              product={product as unknown as ProductWithRelatedData}
            />
          )
        )}
      </div>
      <div
        className={cn("grid-cols-1 gap-6 hidden", view === "list" && "grid")}
      >
        {filterProductsList(products as ProductWithRelatedData[]).map(
          (product) => (
            <ProductCardStack
              key={product.id}
              product={product as unknown as ProductWithRelatedData}
            />
          )
        )}
      </div>
    </div>
  );
}
