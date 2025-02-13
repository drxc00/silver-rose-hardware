"use server";

import { prisma } from "@/lib/prisma";

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
}): Promise<{ success: boolean, message?: string }> {
    try {
        // Simply creates a new Category to te database
        await prisma.category.create({
            data: {
                name,
                slug,
                image,
                // Only include parentCategory if it exists
                ...(parentCategory && { parentCategory }),
            },
        });
        return { success: true };
    } catch (error) {
        return { success: false, message: "Failed to add category" };
    }
}