import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useProductAttributes() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the dynamic search params form the URL
  const params = useMemo(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);

  // The set Params function updates the URL search params
  // It takes a key and value as arguments
  const setParams = useCallback(
    (key: string, value: string) => {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set(key, value);
      router.push(`?${newParams.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // The remove Params function updates the URL search params
  // It takes a key as an argument
  const removeParams = useCallback(
    (key: string) => {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete(key);
      router.push(`?${newParams.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return {
    params,
    setParams,
    removeParams,
  };
}
