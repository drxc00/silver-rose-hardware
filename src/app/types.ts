import { Category, Product, Variant, Prisma } from "@prisma/client";

export type CategoryTree = Category & {
  subcategories: Category[];
  productCount: number;
};

// We derive a type from the prisma client
// Since the structure of the database is a bit different on what we can show the user
// we derive form types.
export type FormProductAttribute = { name: string; value: string };
export type FormProductVariant = Variant & {
  attributes: FormProductAttribute[];
  price: number;
};
export type ProductWithRelations = Product & {
  variants?: FormProductVariant[];
};

// Add Product Type for new products
// Sole purpose for the form
export type AddProductPayload = {
  category: string;
  description: string;
  image: string;
  name: string;
};

export type ProductWithRelatedData = Prisma.ProductGetPayload<{
  include: {
    category: {
      include: {
        parent: true;
      };
    };
    variants: {
      include: {
        attributes: {
          include: {
            attribute: true;
          };
        };
      };
    };
  };
}>;

// Declare the Product Variant type from the prisma client
export type ProductVariant = Prisma.VariantGetPayload<{
  include: {
    attributes: {
      include: {
        attribute: true;
      };
    };
  };
}>;
// Create a serialized type for type safety of the data
// This simply removes the Decimal property of the price
export interface SerializedProductVariant
  extends Omit<ProductVariant, "price"> {
  price: string;
}
// Then create a serialized Product with related data type cause prisma sucks.
export interface SerializedProductWithRelatedData
  extends Omit<ProductWithRelatedData, "variants"> {
  variants: SerializedProductVariant[];
}

export interface DashboardData {
  quotations: {
    total: number;
  };
  quotationRequests: {
    total: number;
    details: {
      requestsFromPastWeek: number;
    };
  };
  pendingQuotations: {
    total: number;
    details: {
      requestsFromLastHour: number;
    };
  };
  products: {
    total: number;
  };
  categories: {
    total: number;
    details: {
      parentCategories: number;
      subCategories: number;
    };
  };
  users: {
    total: number;
    details: {
      admin: number;
      customer: number;
    };
  };
}

export type QuotationWithRelations = Prisma.UserQuotationGetPayload<{
  include: {
    quotation: {
      include: {
        QuotationItem: {
          include: {
            variant: {
              include: {
                attributes: {
                  include: {
                    attribute: true;
                  };
                };
                product: {
                  include: {
                    category: {
                      include: {
                        parent: {
                          include: {
                            parent: true;
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}>;

export type VariantWithRelations = Prisma.VariantGetPayload<{
  include: {
    attributes: {
      include: {
        attribute: true;
      };
    };
    product: {
      include: {
        category: {
          include: {
            parent: {
              include: {
                parent: true;
              };
            };
          };
        };
      };
    };
  };
}>;
