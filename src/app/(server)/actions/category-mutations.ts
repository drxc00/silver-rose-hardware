"use server";

import { addCategoryFormSchema } from "@/lib/form-schema";
import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const updateCategory = actionClient
  .schema(
    addCategoryFormSchema.extend({
      id: z.string(),
    })
  )
  .action(
    async ({
      parsedInput: { id, categoryName, slug, image, parentCategory },
    }) => {
      try {
        await prisma.category.update({
          where: { id },
          data: {
            name: categoryName,
            slug,
            image,
            // Only include parentCategory if it exists
            ...(parentCategory && { parentCategory }),
          },
        });
        revalidatePath("/"); // Revalidate the carousel in the home page
        revalidatePath("/admin/categories/edit/" + id);
        return {
          success: true,
          message: "Category updated successfully",
        };
      } catch (error) {
        return {
          success: false,
          message: "Failed to update category: " + (error as Error).message,
        };
      }
    }
  );

export const addCategory = actionClient
  .schema(addCategoryFormSchema)
  .action(
    async ({ parsedInput: { categoryName, slug, image, parentCategory } }) => {
      try {
        await prisma.category.create({
          data: {
            name: categoryName,
            slug,
            image,
            // Only include parentCategory if it exists
            ...(parentCategory && { parentCategory }),
          },
        });
        revalidatePath("/"); // Revalidate the carousel in the home page
        revalidatePath("/categories"); // Categories page
        revalidatePath("/admin/categories");
        return {
          success: true,
          message: "Category added successfully",
        };
      } catch (error) {
        return {
          success: false,
          message: "Failed to add category: " + (error as Error).message,
        };
      }
    }
  );

// export async function addCategory({
//   name,
//   slug,
//   image,
//   parentCategory,
// }: {
//   name: string;
//   slug: string;
//   image: string;
//   parentCategory?: string;
// }): Promise<void> {
//   await prisma.category.create({
//     data: {
//       name,
//       slug,
//       image,
//       // Only include parentCategory if it exists
//       ...(parentCategory && { parentCategory }),
//     },
//   });
//   revalidatePath("/"); // Revalidate the carousel in the home page
//   revalidatePath("/categories"); // Categories page
//   revalidatePath("/admin/categories");
// }
