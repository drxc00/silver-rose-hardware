"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const SORT_OPTIONS = {
  ALL: "all",
  ALPHA_ASC: "alphabetical-a-z",
  ALPHA_DESC: "alphabetical-z-a",
  PRICE_ASC: "price-low-to-high",
  PRICE_DESC: "price-high-to-low",
} as const;

export const VIEW_OPTIONS = {
  GRID: "grid",
  LIST: "list",
} as const;

type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];
type ViewOption = (typeof VIEW_OPTIONS)[keyof typeof VIEW_OPTIONS];

export interface UrlFilters {
  category?: string;
  sort?: SortOption;
  name?: string;
  view?: ViewOption;
  page?: number;
  limit?: number;
}

export function useUrlFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the search params form the URL
  // and cast them to the correct types
  const sort = searchParams.get("sort") as UrlFilters["sort"];
  const view = searchParams.get("view") as UrlFilters["view"];
  const name = searchParams.get("name");
  const category = searchParams.get("category");

  // The set Params function updates the URL search params
  // It takes a key and value as arguments
  const setParams = useCallback(
    (key: keyof UrlFilters, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  return { sort, view, name, category, setParams };
}
