"use server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { productFormSchema } from "@/lib/form-schema";
import { revalidatePath, revalidateTag } from "next/cache";
import { actionClient } from "@/lib/safe-action";

export async function addAttribute(
  attributeName: string
): Promise<{ id: string; name: string }> {
  const attribute = await prisma.attribute.create({
    data: { name: attributeName },
  });
  revalidatePath("/admin/products/add");
  return attribute;
}

export async function updateProductStatus(
  id: string,
  status: "archived" | "visible"
): Promise<void> {
  await prisma.product.update({
    where: { id },
    data: { status: status, isFeatured: false },
  });
  revalidatePath("/admin/products");
  revalidatePath("/"); // Revalidate the home page
  revalidateTag("products");
  revalidateTag("productsPage");
}

export async function updateIsFeatured(
  id: string,
  isFeatured: boolean
): Promise<void> {
  await prisma.product.update({
    where: { id },
    data: { isFeatured: isFeatured },
  });
  revalidatePath("/admin/products");
  revalidatePath("/"); // Revalidate the home page
  revalidateTag("products");
}

export const updateProduct = actionClient
  .schema(
    productFormSchema.extend({
      id: z.string(),
    })
  )
  .action(
    async ({
      parsedInput: {
        id,
        category,
        hasVariant,
        name,
        status,
        variants,
        description,
        image,
        slug,
      },
    }) => {
      try {
        await prisma.$transaction(async (prisma) => {
          // Fetch original variants
          const originalVariants = await prisma.variant.findMany({
            where: { productId: id },
          });

          // Identify deleted variants
          const deletedVariantIds = originalVariants
            .filter((variant) =>
              variants.every(
                (payloadVariant) => variant.id !== payloadVariant.id
              )
            )
            .map((variant) => variant.id);

          // Delete removed variants
          if (deletedVariantIds.length > 0) {
            await prisma.variant.deleteMany({
              where: { id: { in: deletedVariantIds } },
            });
          }

          await prisma.product.update({
            where: { id },
            data: {
              name: name,
              description: description,
              image: image,
              status: status,
              slug: slug as string,
              category: {
                connect: {
                  id: category,
                },
              },
              hasVariant: hasVariant,
              variants: {
                // Update existing variants
                update: variants
                  .filter((variant) => variant.id)
                  .map((variant) => ({
                    where: { id: variant.id },
                    data: {
                      price: variant.price,
                      attributes: {
                        deleteMany: {},
                        create: variant.attributes.map((attribute) => ({
                          attributeId: attribute.id as string,
                          value: attribute.value,
                        })),
                      },
                    },
                  })),
                // Create new variants
                create: variants
                  .filter((variant) => !variant.id)
                  .map((variant) => ({
                    price: variant.price,
                    attributes: {
                      create: variant.attributes.map((attribute) => ({
                        attributeId: attribute.id as string,
                        value: attribute.value,
                      })),
                    },
                  })),
              },
            },
          });
        });
        revalidatePath("/");
        revalidatePath("/admin/products");
        revalidatePath(`/admin/products/edit/${id}`);
        revalidatePath("/products/" + slug);
        return {
          success: true,
          message: "Product updated successfully",
        };
      } catch (error) {
        return {
          success: false,
          message: "Failed to update product: " + (error as Error).message,
        };
      }
    }
  );

export const addProduct = actionClient
  .schema(productFormSchema)
  .action(async ({ parsedInput: payload }) => {
    try {
      const slug = payload.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // remove all non-word, non-whitespace, non-hyphen characters
        .replace(/[\s_-]+/g, "-") // replace all spaces, underscores, and hyphens with a single hyphen
        .replace(/^-+/, "") // remove leading hyphens
        .replace(/-+$/, ""); // remove trailing hyphens

      // Perform an atomic transaction
      await prisma.$transaction(async (prisma) => {
        // We perform an hierarchical mutation
        // First we check if the parent category exits
        const parentCategory = await prisma.category.findUnique({
          where: { id: payload.category }, // the category here is the categoryId
        });
        // Throw an error if the category passed is incorrect
        if (!parentCategory) throw new Error("Invalid category");

        // If the category exists, we create the product
        await prisma.product.create({
          data: {
            name: payload.name,
            description: payload.description,
            image: payload.image,
            status: payload.status,
            slug: slug,
            category: {
              connect: {
                id: payload.category,
              },
            },
            hasVariant: payload.hasVariant,
            variants: {
              create: payload.variants.map((variant) => ({
                price: variant.price,
                attributes: {
                  create: variant.attributes.map((attribute) => ({
                    attributeId: attribute.id as string,
                    value: attribute.value,
                  })),
                },
              })),
            },
          },
        });
      });
      revalidatePath("/products/" + slug);
      revalidatePath("/admin/products");
      return {
        success: true,
        message: "Product added successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to add product: " + (error as Error).message,
      };
    }
  });
