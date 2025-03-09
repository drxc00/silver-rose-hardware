import { useCallback } from "react";
import { useOptimistic } from "react";
import { QuotationWithRelations } from "@/app/types";
import { Prisma } from "@prisma/client";

type QuotationItem =
  | NonNullable<QuotationWithRelations["quotation"]>["QuotationItem"][number]
  | undefined
  | null;
export type OptimisticQuotationState = {
  id: string;
  quotationId: string;
  quotation: {
    QuotationItem: QuotationItem[];
  };
};

type AddAction = {
  type: "add";
  item: QuotationItem;
};

type RemoveAction = {
  type: "remove";
  variantId: string;
};

type QuantityAction = {
  type: "increment" | "decrement";
  quotationItemId: string;
};

type QuotationAction = AddAction | RemoveAction | QuantityAction;

export function useQuotationOptimistic(
  initialQuotation?: QuotationWithRelations | null
) {
  const [optimisticQuotation, updateOptimisticQuotation] = useOptimistic<
    OptimisticQuotationState,
    QuotationAction
  >(
    initialQuotation
      ? {
          id: initialQuotation.id as string,
          quotationId: initialQuotation.quotationId as string,
          quotation: {
            QuotationItem: initialQuotation.quotation?.QuotationItem || [],
          },
        }
      : {
          id: "",
          quotationId: "",
          quotation: {
            QuotationItem: [],
          },
        },
    (state, action) => {
      switch (action.type) {
        case "remove":
          return {
            ...state,
            quotation: {
              ...state.quotation,
              QuotationItem: state.quotation.QuotationItem.filter(
                (item) => item?.id !== action.variantId
              ),
            },
          };

        case "add":
          const existingItem = state.quotation.QuotationItem.find(
            (item) => item?.variantId === action.item?.variantId
          );

          if (existingItem) {
            return {
              ...state,
              quotation: {
                ...state.quotation,
                QuotationItem: state.quotation.QuotationItem.map((item) =>
                  item?.variantId === action.item?.variantId
                    ? {
                        ...item,
                        quantity: new Prisma.Decimal(
                          Number(item?.quantity) + Number(action.item?.quantity)
                        ),
                      }
                    : item
                ),
              },
            };
          }

          return {
            ...state,
            quotation: {
              ...state.quotation as any,
              QuotationItem: [...state.quotation.QuotationItem, action.item],
            },
          };
        //
        case "increment":
        case "decrement": {
          const currentItems = state.quotation.QuotationItem;
          const updatedItems = currentItems.map((item) => {
            if (item?.id === action.quotationItemId) {
              const currentQuantity = Number(item.quantity);
              const newQuantity =
                action.type === "increment"
                  ? currentQuantity + 1
                  : Math.max(1, currentQuantity - 1);

              // If quantity is 0, remove the item
              if (newQuantity === 0) {
                return null;
              }

              return {
                ...item,
                quantity: new Prisma.Decimal(newQuantity),
              };
            }
            return item;
          });

          return {
            ...state,
            quotation: {
              ...state.quotation,
              QuotationItem: updatedItems,
            },
          };
        }

        default:
          return state;
      }
    }
  );

  const updateQuantity = useCallback(
    (quotationItemId: string, type: "increment" | "decrement") => {
      updateOptimisticQuotation({ type, quotationItemId: quotationItemId });
    },
    [updateOptimisticQuotation]
  );

  const removeToQuotation = useCallback(
    (variantId: string) => {
      updateOptimisticQuotation({ type: "remove", variantId });
    },
    [updateOptimisticQuotation]
  );

  const addToQuotation = useCallback(
    (variantId: string, quantity: number) => {
      // NOTE: This is simply a placeholder item
      // This will be replaced with the actual item from the database after the server mutation
      const optimisticItem: QuotationItem = {
        id: crypto.randomUUID(),
        variantId,
        quantity: new Prisma.Decimal(quantity),
        priceAtQuotation: new Prisma.Decimal(0),
        quotationId: initialQuotation?.quotation?.id as string,
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
            image: "/placeholder.jpg",
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
              image: "/placeholder.jpg",
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
    [updateOptimisticQuotation, initialQuotation?.quotation?.id]
  );

  return {
    quotation: optimisticQuotation,
    addToQuotation,
    removeToQuotation,
    updateQuantity,
  } as const;
}
