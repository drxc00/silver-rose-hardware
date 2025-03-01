import {
  CategoryTree,
  DashboardData,
  ProductWithRelatedData,
} from "@/app/types";
import { prisma } from "./prisma";
import { Attribute, Product } from "@prisma/client";
import { UserRole } from "./constants";
import { Prisma } from "@prisma/client";

export const getQuotationRequest = async (quotationRequestId: string) => {
  return prisma.quotationRequest.findFirst({
    where: { id: quotationRequestId },
    include: {
      quotation: {
        include: {
          QuotationItem: {
            include: {
              variant: {
                include: {
                  attributes: {
                    include: { attribute: true },
                  },
                  product: true,
                },
              },
            },
          },
          AdditionalCharge: true,
        },
      },
      user: {
        include: {
          accounts: true,
        },
      },
    },
  });
};

export async function fetchUserQuotation(userId: string) {
  if (!userId) return null;
  return prisma.userQuotation
    .findFirst({
      where: {
        userId: userId, // Ensuring `userId` exists in `UserQuotation`
      },
      include: {
        quotation: {
          include: {
            QuotationItem: {
              include: {
                variant: {
                  include: {
                    attributes: {
                      include: {
                        attribute: true,
                      },
                    },
                    product: {
                      include: {
                        category: {
                          include: {
                            parent: {
                              include: {
                                parent: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
    .then((userQuotation) => ({
      ...userQuotation,
      quotation: {
        ...userQuotation?.quotation,
        QuotationItem:
          userQuotation?.quotation?.QuotationItem?.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ) // Oldest first
            .map((item) => ({
              ...item,
              quantity: Number(item.quantity),
              variant: {
                ...item.variant,
                attributes: item.variant.attributes.map((attribute) => ({
                  ...attribute,
                  value: attribute.value as string,
                })),
                price: Number(item.variant.price),
              },
            })) ?? [],
      },
    }));
}

export async function fetchRelatedProducts(
  categoryId: string
): Promise<Product[]> {
  // Validate input
  if (!categoryId) throw new Error("Category ID is required");

  // Get category with parent
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { parent: true },
  });

  // Handle category not found
  if (!category) return [];

  // Collect relevant category IDs
  const categoryIds = [category.id];
  if (category.parent) {
    categoryIds.push(category.parent.id);
  }

  // Fetch products with proper typing
  return prisma.product.findMany({
    where: {
      categoryId: {
        in: categoryIds,
      },
    },
    include: {
      category: {
        include: {
          parent: true,
        },
      },
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
  });
}

export async function fetchProductUsingSlug(
  slug: string
): Promise<ProductWithRelatedData> {
  return (await prisma.product.findUnique({
    where: { slug: slug },
    include: {
      category: {
        include: {
          parent: true,
        },
      },
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
  /*
   * Re-organize the categories to create a tree structure
   * Since the categories are fetched in a flat structure,
   * we need to create a tree structure for the categories and subcategories
   *
   * First, we filter the categories into parent categories and subcategories
   * We have to sort them with parent categories first since we have a reducer function
   * that organizes the categories into a tree which updates parent categories when a subcategory is detected
   */
  const parentCateogires = categories.filter(
    (category) => !category.parentCategory
  );
  const subcategories = categories.filter(
    (category) => category.parentCategory
  );

  const sortedCategories = [...parentCateogires, ...subcategories];

  return sortedCategories.reduce((acc, category) => {
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

export async function fetchAllProducts(options?: Prisma.ProductFindManyArgs): Promise<Product[]> {
  return prisma.product
    .findMany({
      ...options,
      // Set a default select incase options not provided
      select: options?.select || {
        id: true,
        name: true,
        slug: true,
        image: true,
        description: true,
        status: true,
        isFeatured: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            parent: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        },
        variants: {
          select: {
            id: true,
            price: true,
            attributes: {
              select: {
                attribute: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    })
    .then((products) =>
      products.map((product) => ({
        ...product,
        variants: product.variants.map((variant) => ({
          ...variant,
          price: variant.price.toNumber(),
        })),
      }))
    );
}

export async function fetchUsers() {
  const users = await prisma.user.findMany({});
  return {
    admin: users.filter((user) => user.role === UserRole.ADMIN),
    customer: users.filter((user) => user.role === UserRole.CUSTOMER),
  };
}

export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    // Fetch database-related data in a single transaction to reduce connections
    const [
      totalQuotations,
      totalQuotationRequests,
      pendingQuotationsCount,
      recentRequestsCount,
      recentPendingCount,
      categories,
    ] = await prisma.$transaction([
      prisma.quotation.count(), // Only fetch count
      prisma.quotationRequest.count(), // Only fetch count
      prisma.quotationRequest.count({ where: { status: "Pending" } }),
      prisma.quotationRequest.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.quotationRequest.count({
        where: {
          status: "Pending",
          createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
        },
      }),
      prisma.category.findMany({ select: { id: true, parentCategory: true } }), // Minimal fields
    ]);

    // Fetch external API data (kept separate to avoid blocking DB transactions)
    const [products, users] = await Promise.all([
      fetchAllProducts(), // Fetch products from external API
      fetchUsers(), // Fetch users from external API
    ]);

    return {
      quotations: { total: totalQuotations },
      quotationRequests: {
        total: totalQuotationRequests,
        details: {
          requestsFromPastWeek: recentRequestsCount,
        },
      },
      pendingQuotations: {
        total: pendingQuotationsCount,
        details: {
          requestsFromLastHour: recentPendingCount,
        },
      },
      products: { total: products.length },
      categories: {
        total: categories.length,
        details: {
          parentCategories: categories.filter((c) => !c.parentCategory).length,
          subCategories: categories.filter((c) => c.parentCategory).length,
        },
      },
      users: {
        total: users.admin.length + users.customer.length,
        details: {
          admin: users.admin.length,
          customer: users.customer.length,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}
