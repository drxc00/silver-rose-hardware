import { CategoryTree, ProductWithRelatedData } from "@/app/types";
import { prisma } from "./prisma";
import { Attribute, Prisma, Product } from "@prisma/client";

export async function fetchProduct(
  id: string
): Promise<ProductWithRelatedData> {
  return (await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      variants: {
        include: {
          attributes: {
            include: {
              attribute: true,
            },
          },
        },
      },
    },
  })) as ProductWithRelatedData;
}

export async function fetchCategory(id: string): Promise<CategoryTree> {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      Product: true,
    },
  });
  return {
    ...category,
    productCount: category?.Product.length || 0,
  } as CategoryTree;
}

export async function fetchCategories(): Promise<CategoryTree[]> {
  const categories = await prisma.category.findMany({
    include: {
      Product: true,
    },
  });
  // Re-organize the categories to create a tree structure
  // Since the categories are fetched in a flat structure,
  // we need to create a tree structure for the categories and subcategories
  return categories.reduce((acc, category) => {
    // Get the parentId, if it exists
    const parentId = category.parentCategory;
    if (parentId) {
      // Find the parent of the category from the accumulator array
      const parent = acc.find((c) => c.id === parentId);
      if (parent) {
        parent.subcategories.push({
          ...category,
          productCount: category.Product.length,
        } as any);
        parent.productCount += category.Product.length; // Increment the product count of the parent
      }
    } else {
      // Simply push the category itself with a subcategories array
      // This is used for finding the subcategories
      acc.push({
        ...category,
        subcategories: [],
        productCount: category.Product.length,
      });
    }
    return acc;
  }, [] as CategoryTree[]);
}

export async function fetchAttributes(): Promise<Attribute[]> {
  return prisma.attribute.findMany({});
}

export async function fetchAllProducts(): Promise<Product[]> {
  return prisma.product
    .findMany({
      include: {
        category: true,
        variants: {
          include: {
            attributes: {
              include: {
                attribute: true,
              },
            },
          },
        },
      },
    })
    .then((products) =>
      products.map((product) => ({
        ...product,
        variants: product.variants.map((variant) => ({
          ...variant,
          price: variant.price.toNumber(), // Convert Decimal to number
        })),
      }))
    );
}
