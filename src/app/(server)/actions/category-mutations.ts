"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateCategory({
  id,
  name,
  slug,
  image,
  parentCategory,
}: {
  id: string;
  name: string;
  slug: string;
  image: string;
  parentCategory?: string;
}): Promise<void> {
  try {
    await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        image,
        // Only include parentCategory if it exists
        ...(parentCategory && { parentCategory }),
      },
    });
  } catch (error) {
    throw new Error("Failed to update category: " + (error as Error).name);
  }
  revalidatePath("/"); // Revalidate the carousel in the home page
  revalidatePath("/admin/categories/edit/" + id);
}

export async function addCategory({
  name,
  slug,
  image,
  parentCategory,
}: {
  name: string;
  slug: string;
  image: string;
  parentCategory?: string;
}): Promise<void> {
  await prisma.category.create({
    data: {
      name,
      slug,
      image,
      // Only include parentCategory if it exists
      ...(parentCategory && { parentCategory }),
    },
  });
  revalidatePath("/"); // Revalidate the carousel in the home page
  revalidatePath("/categories"); // Categories page
  revalidatePath("/admin/categories");
}
