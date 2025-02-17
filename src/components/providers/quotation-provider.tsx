"use client";

import { createContext, useContext } from "react";
import { useQuotationOptimistic } from "@/hooks/use-quotation";
import { QuotationWithRelations } from "@/app/types";

const QuotationContext = createContext<ReturnType<
  typeof useQuotationOptimistic
> | null>(null);

export function QuotationProvider({
  children,
  initialQuotation,
}: {
  children: React.ReactNode;
  initialQuotation: QuotationWithRelations;
}) {
  const quotationUtils = useQuotationOptimistic(initialQuotation);

  return (
    <QuotationContext.Provider value={quotationUtils}>
      {children}
    </QuotationContext.Provider>
  );
}

export const useQuotation = () => {
  const context = useContext(QuotationContext);
  if (!context)
    throw new Error("useQuotation must be used within QuotationProvider");
  return context;
};
