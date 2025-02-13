import {
  Attribute,
  AttributeValue,
  Category,
  Product,
  Variant,
  Prisma,
} from "@prisma/client";

export type CategoryTree = Category & { subcategories: Category[] };

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
    category: true;
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
