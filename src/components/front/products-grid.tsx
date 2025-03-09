"use client";

import {
  CategoryTree,
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
import { useEffect, useState } from "react";
import { ProductCardStack } from "./product-card-stack";
import { cn } from "@/lib/utils";
import { getMinMaxPrice } from "@/lib/products-functions";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { Input } from "../ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { ProductsSkeleton } from "./products-skeleton";

interface ProductsGridProps {
  categories?: CategoryTree[];
  products: SerializedProductWithRelatedData[] | ProductWithRelatedData[];
  isLoading?: boolean;
}

export function ProductsGrid({
  categories,
  products,
  isLoading,
}: ProductsGridProps) {
  // Set products view as grid format as default
  const {
    sort,
    view,
    name,
    category,
    minPrice,
    maxPrice,
    setParams,
    removeParams,
  } = useUrlFilters();

  const [localMinPrice, setLocalMinPrice] = useState<string>(minPrice ?? "");
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(maxPrice ?? "");
  const debouncedMinPrice = useDebounce(localMinPrice);
  const debouncedMaxPrice = useDebounce(localMaxPrice);

  useEffect(() => {
    if (debouncedMinPrice !== "") {
      setParams("minPrice", debouncedMinPrice.toString());
    } else {
      removeParams("minPrice");
    }
  }, [debouncedMinPrice, removeParams, setParams]);

  useEffect(() => {
    if (debouncedMaxPrice !== "") {
      setParams("maxPrice", debouncedMaxPrice.toString());
    } else {
      removeParams("maxPrice");
    }
  }, [debouncedMaxPrice, removeParams, setParams]);

  const matchProductName = (
    product: ProductWithRelatedData | SerializedProductWithRelatedData
  ) => {
    return product.name.toLowerCase().includes(name?.toLowerCase() || "");
  };

  const matchProductPrice = (product: ProductWithRelatedData) => {
    const [minProductPrice, maxProductPrice] = getMinMaxPrice(product);
    // Convert inputs to numbers only when they're not empty
    const minPriceNum = debouncedMinPrice ? Number(debouncedMinPrice) : null;
    const maxPriceNum = debouncedMaxPrice ? Number(debouncedMaxPrice) : null;

    // Handle price filtering based on available inputs
    if (minPriceNum !== null && maxPriceNum !== null) {
      return minProductPrice >= minPriceNum && maxProductPrice <= maxPriceNum;
    } else if (minPriceNum !== null) {
      return minProductPrice >= minPriceNum;
    } else if (maxPriceNum !== null) {
      return maxProductPrice <= maxPriceNum;
    }
    return true;
  };

  const sortProductsOrder = (
    productsToSort:
      | SerializedProductWithRelatedData[]
      | ProductWithRelatedData[]
  ) => {
    const sortedProducts = [...productsToSort];
    switch (sort) {
      case "alphabetical-a-z":
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case "alphabetical-z-a":
        return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      case "price-low-to-high":
        return sortedProducts.sort((a, b) => {
          const [minPriceA] = getMinMaxPrice(a);
          const [minPriceB] = getMinMaxPrice(b);
          return minPriceA - minPriceB;
        });
      case "price-high-to-low":
        return sortedProducts.sort((a, b) => {
          const [minPriceA] = getMinMaxPrice(a);
          const [minPriceB] = getMinMaxPrice(b);
          return minPriceB - minPriceA;
        });
      default:
        return sortedProducts;
    }
  };

  const filterProducts = (
    productsToFilter:
      | SerializedProductWithRelatedData[]
      | ProductWithRelatedData[]
  ) => {
    let filteredProducts = [...productsToFilter];

    /*
     * We apply filtering only when the params are set
     * Else we return all the products
     * NOTE: When debugging this it took me along time to realize
     * that the fetch function does not fetch the parent categories of sub categories
     * If You experience difficulty when filtering products, it might be because of this.
     * ALWAYS MAKE SURE THAT THE FETCH FUNCTION IS FETCHING THE PARENT CATEGORIES OF SUB CATEGORIES
     * THEN COMPARE THE SLUGS OF BOTH PARENT AND CHILD.
     */
    if (categories && category) {
      filteredProducts = filteredProducts.filter((product) => {
        /* Extract the product category */
        const productCategory = product.category;
        /* We then check if the category of the product is the same as the category selected */
        /* Here we consider both its base slug, and its parent slug */
        /* We also check here if the category param is "all" which means we want to show all products */
        return (
          category === "all" ||
          productCategory.slug === category ||
          productCategory.parent?.slug === category
        );
      });
    }

    if (name) {
      filteredProducts = filteredProducts.filter(matchProductName);
    }

    if (minPrice || maxPrice) {
      filteredProducts = filteredProducts.filter((product) => {
        return matchProductPrice(product as ProductWithRelatedData);
      });
    }

    // Apply sorting after filtering
    return sortProductsOrder(
      filteredProducts as SerializedProductWithRelatedData[]
    );
  };

  const filteredProducts = filterProducts(products);

  return (
    <div className="space-y-6 w-full">
      {/* Filters & Sorting */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 p-4 bg-background/50 backdrop-blur-sm rounded-sm border">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Sort by */}
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <span className="text-sm font-medium text-foreground">Sort by</span>
            <Select
              value={sort || "all"}
              onValueChange={(e) => setParams("sort", e)}
            >
              <SelectTrigger className="w-[160px] sm:w-[180px] bg-background">
                <SelectValue placeholder="Sort option" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="alphabetical-a-z">A-Z</SelectItem>
                <SelectItem value="alphabetical-z-a">Z-A</SelectItem>
                <SelectItem value="price-low-to-high">
                  Price: Low to High
                </SelectItem>
                <SelectItem value="price-high-to-low">
                  Price: High to Low
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          {categories && (
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <span className="text-sm font-medium text-foreground">Category</span>
              <Select
                value={category || "all"}
                onValueChange={(e) => setParams("category", e)}
              >
                <SelectTrigger className="w-[140px] sm:w-[180px] bg-background">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug as string}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Price Filter */}
          <div className="flex flex-col w-full sm:flex-row gap-2 sm:items-center">
            <span className="text-sm font-medium text-foreground">Price</span>
            <div className="flex w-full items-center gap-2">
              <Input
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                type="number"
                placeholder="Min"
                className="w-full md:w-24 sm:w-32 bg-background"
                min="0"
              />
              <span className="text-muted-foreground text-sm">to</span>
              <Input
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                type="number"
                placeholder="Max"
                className="w-full md:w-24 sm:w-32 bg-background"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <span className="text-sm font-medium text-foreground">View</span>
          <div className="flex gap-2">
            <Button 
              variant={view === "grid" ? "default" : "outline"} 
              size="sm"
              onClick={() => setParams("view", "grid")}
            >
              <LayoutGridIcon className="w-4 h-4" />
            </Button>
            <Button 
              variant={view === "list" ? "default" : "outline"} 
              size="sm"
              onClick={() => setParams("view", "list")}
            >
              <StretchHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Grid / List View */}
      {isLoading ? (
        <ProductsSkeleton />
      ) : filteredProducts.length > 0 ? (
        <div
          className={cn(
            "grid gap-6",
            view !== "list"
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1"
          )}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product as unknown as ProductWithRelatedData}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <p className="text-lg font-medium text-foreground">No products found</p>
          <p className="text-sm text-muted-foreground text-center">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  );
}
