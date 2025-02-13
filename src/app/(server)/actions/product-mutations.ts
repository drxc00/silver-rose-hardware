"use server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { productFormSchema } from "@/lib/form-schema";
import { revalidatePath } from "next/cache";

export async function addAttribute(
  attributeName: string
): Promise<{ id: string; name: string }> {
  const attribute = await prisma.attribute.create({
    data: { name: attributeName },
  });
  revalidatePath("/admin/products/add");
  return attribute;
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
}

export async function addProduct(
  payload: z.infer<typeof productFormSchema>
): Promise<void> {
  // Perform inference on the payload
  const parsedPayload = productFormSchema.safeParse(payload);
  // Throw an error if the payload is not valid
  if (!parsedPayload.success) throw new Error("Invalid payload");

  //----------------------------------
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
              attributeId: attribute.id as string, // ✅ Correct: Directly assign attributeId
              value: attribute.value,
            })),
          },
        })),
      },
    },
  });
}
