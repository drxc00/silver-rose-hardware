"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useOptimistic } from "react";
import { QuotationWithRelations } from "@/app/types";
import { Prisma } from "@prisma/client";

// Define more specific types
type QuotationItem =
  QuotationWithRelations["quotation"]["QuotationItem"][number];
type OptimisticQuotationState = {
  quotation: {
    QuotationItem: QuotationItem[];
  };
};

// Define action types
type AddAction = {
  type: "add";
  item: QuotationItem;
};

type RemoveAction = {
  type: "remove";
  variantId: string;
};

type QuotationAction = AddAction | RemoveAction;

export function useQuotationOptimistic(
  initialQuotation?: QuotationWithRelations | null
) {
  const router = useRouter();

  const [optimisticQuotation, updateOptimisticQuotation] = useOptimistic<
    OptimisticQuotationState,
    QuotationAction
  >(
    initialQuotation
      ? {
          quotation: {
            QuotationItem: initialQuotation.quotation.QuotationItem || [],
          },
        }
      : {
          quotation: {
            QuotationItem: [],
          },
        },
    (state, action) => {
      switch (action.type) {
        case "remove":
          return {
            quotation: {
              ...state.quotation,
              QuotationItem: state.quotation.QuotationItem.filter(
                (item) => item.id !== action.variantId
              ),
            },
          };
        case "add":
          // Check if the item already exists
          const existingItem = state.quotation.QuotationItem.find(
            (item) => item.variantId === action.item.variantId
          );
          const updated = (
            existingItem
              ? {
                  ...existingItem,
                  quantity:
                    Number(existingItem.quantity) +
                    Number(action.item.quantity),
                }
              : action.item
          ) as QuotationItem; // Type assertation
          return {
            quotation: {
              ...state.quotation,
              // Replace the existing item with the updated one
              QuotationItem: [
                ...state.quotation.QuotationItem.filter(
                  (item) => item.variantId !== updated.variantId
                ),
                updated,
              ],
            },
          };
        default:
          return state;
      }
    }
  );

  const removeToQuotation = useCallback(
    (variantId: string) => {
      updateOptimisticQuotation({ type: "remove", variantId });
    },
    [updateOptimisticQuotation]
  );

  const addToQuotation = useCallback(
    (variantId: string, quantity: number) => {
      const optimisticItem: QuotationItem = {
        id: crypto.randomUUID(), // temporary quotation item id
        variantId,
        quantity: new Prisma.Decimal(quantity),
        quotationId: initialQuotation?.quotation.id as string,
        createdAt: new Date(),
        updatedAt: new Date(),
        variant: {
          id: variantId,
          price: new Prisma.Decimal(0),
          productId: "",
          createdAt: new Date(),
          product: {
            id: "",
            name: "Loading...",
            categoryId: "",
            hasVariant: true,
            createdAt: new Date(),
            status: "visible",
            isFeatured: false,
            description: "",
            slug: "",
            category: {
              id: "",
              name: "",
              slug: "",
              image: "",
              parentCategory: "",
              createdAt: new Date(),
              updatedAt: new Date(),
              parent: null,
            },
          } as any,
          attributes: [],
        },
      };

      updateOptimisticQuotation({ type: "add", item: optimisticItem });
    },
    [updateOptimisticQuotation, router, initialQuotation?.quotation.id]
  );

  return {
    quotation: optimisticQuotation,
    addToQuotation,
    removeToQuotation,
  } as const;
}

// Export the hook's return type
export type QuotationHookReturn = ReturnType<typeof useQuotationOptimistic>;
