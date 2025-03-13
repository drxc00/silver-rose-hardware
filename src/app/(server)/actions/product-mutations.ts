"use server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { productFormSchema } from "@/lib/form-schema";
import { revalidatePath, revalidateTag } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import { AttributeValue, Variant } from "@prisma/client";

type VariantWithAttributes = Variant & {
  attributes: AttributeValue[];
};

export const hardDeleteProduct = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      await prisma.product.delete({
        where: { id },
      });
      revalidatePath("/admin/products");
      revalidatePath("/");
      revalidatePath("/categories");
      revalidatePath("/products");
      revalidateTag("products");
      revalidateTag("productsPage");
      revalidateTag("quotation");
      revalidateTag("quotationPage");
      revalidateTag("userQuotation");
      return {
        success: true,
        message: "Product deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to delete product: " + (error as Error).message,
      };
    }
  });

export const addAttribute = actionClient
  .schema(z.object({ name: z.string() }))
  .action(async ({ parsedInput: { name } }) => {
    try {
      const attribute = await prisma.attribute.create({
        data: { name },
      });
      revalidatePath("/admin/products/add-unstable");
      revalidatePath("/admin/products/add");
      revalidateTag("attributes");
      return {
        success: true,
        message: "Attribute added successfully",
        attribute,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to add attribute: " + (error as Error).message,
      };
    }
  });

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
        // FIRST TRANSACTION: Core product update and variant deletion
        // These operations are atomic - they either all succeed or all fail
        const product = await prisma.$transaction(async (tx) => {
          // Update product base information
          const updatedProduct = await tx.product.update({
            where: { id },
            data: {
              name,
              description,
              image,
              status,
              slug: slug as string,
              hasVariant,
              category: {
                connect: {
                  id: category,
                },
              },
            },
            include: {
              variants: {
                include: {
                  attributes: true,
                },
              },
            },
          });

          // Identify variants to delete
          const deletedVariantIds = updatedProduct.variants
            .filter((variant) =>
              variants.every((payloadVariant) => variant.id !== payloadVariant.id)
            )
            .map((variant) => variant.id);

          // Delete removed variants within the same transaction
          if (deletedVariantIds.length > 0) {
            await tx.variant.deleteMany({
              where: { id: { in: deletedVariantIds } },
            });
          }

          return updatedProduct;
        }, { 
          timeout: 5000, // Shorter timeout for core transaction
          maxWait: 5000 
        });

        // Get original variants from the transaction result
        const originalVariants = product.variants;

        // SECOND PART: Non-transactional variant updates and creation
        // These operations can be processed independently

        // Separate variants to update and create
        const [variantsToUpdate, variantsToCreate] = variants.reduce(
          (
            [toUpdate, toCreate]: [
              VariantWithAttributes[],
              VariantWithAttributes[]
            ],
            variant
          ) => {
            if (variant.id && !String(variant.id).includes("var_")) {
              toUpdate.push(variant as unknown as VariantWithAttributes);
            } else if (!variant.id || String(variant.id).includes("var_")) {
              toCreate.push(variant as unknown as VariantWithAttributes);
            }
            return [toUpdate, toCreate];
          },
          [[], []]
        );

        // Process variant updates one by one
        for (const variant of variantsToUpdate) {
          try {
            // Find the original variant to compare attributes
            const originalVariant = originalVariants.find(
              (v) => v.id === variant.id
            );

            // Use a small transaction for each variant update for better error handling
            await prisma.$transaction(async (tx) => {
              // Delete only attributes that have changed
              if (originalVariant) {
                const attributesToDelete = originalVariant.attributes.filter(
                  (attr) => {
                    const newAttr = variant.attributes.find(
                      (a) => a.id === attr.attributeId
                    );
                    return !newAttr || newAttr.value !== attr.value;
                  }
                );

                if (attributesToDelete.length > 0) {
                  await tx.attributeValue.deleteMany({
                    where: {
                      variantId: variant.id,
                      attributeId: {
                        in: attributesToDelete.map((attr) => attr.attributeId),
                      },
                    },
                  });
                }
              }

              // Update variant price
              await tx.variant.update({
                where: { id: variant.id },
                data: {
                  price: variant.price,
                },
              });

              // Create only new attributes or changed attributes
              const attributesToCreate = variant.attributes.filter((attr) => {
                if (!originalVariant) return true; // If the original variant is not found, create all attributes
                const existingAttr = originalVariant.attributes.find(
                  (a) => a.attributeId === attr.id
                );
                return !existingAttr || existingAttr.value !== attr.value;
              });

              if (attributesToCreate.length > 0) {
                await tx.attributeValue.createMany({
                  data: attributesToCreate.map((attribute) => ({
                    variantId: variant.id,
                    attributeId: attribute.id as string,
                    value: attribute.value,
                  })),
                  skipDuplicates: true,
                });
              }
            }, { timeout: 3000, maxWait: 3000 }); // Shorter timeout for variant updates
          } catch (variantError) {
            // Log variant update error but continue with other variants
            console.error(`Error updating variant ${variant.id}:`, variantError);
            // Could implement retry logic here if needed
          }
        }

        // Create new variants - each in its own transaction
        for (const variant of variantsToCreate) {
          try {
            await prisma.$transaction(async (tx) => {
              // Create variant first
              const newVariant = await tx.variant.create({
                data: {
                  productId: id,
                  price: variant.price,
                },
              });

              // Then create its attributes if any exist
              if (variant.attributes.length > 0) {
                await tx.attributeValue.createMany({
                  data: variant.attributes.map((attribute) => ({
                    variantId: newVariant.id,
                    attributeId: attribute.id as string,
                    value: attribute.value,
                  })),
                });
              }
            }, { timeout: 3000, maxWait: 3000 }); // Shorter timeout for variant creation
          } catch (createError) {
            // Log variant creation error but continue with other variants
            console.error(`Error creating new variant:`, createError);
            // Could implement retry logic here if needed
          }
        }

        // Revalidate data after all mutations are complete
        revalidatePath("/");
        revalidatePath("/admin/products");
        revalidatePath(`/admin/products/edit/${id}`);
        revalidatePath(`/admin/products/edit-unstable/${id}`);
        revalidatePath("/products/" + slug);
        revalidateTag("products");
        revalidateTag("productsPage");
        revalidateTag("categoryPage");
        revalidateTag("subcategoryPage");
        
        return {
          success: true,
          message: "Product updated successfully",
        };
      } catch (error) {
        console.error("Product update failed:", error);
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
      revalidatePath("/products");
      revalidatePath("/admin/products");
      revalidateTag("products");
      revalidateTag("productsPage");
      revalidateTag("categoryPage");
      revalidateTag("subcategoryPage");
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
