import { NextRequest, NextResponse } from "next/server";
import { gemini } from "@/lib/ai";
import { SchemaType } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { unstable_cache as cache } from "next/cache";
const getCachedCategories = cache(
  async () => {
    return prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  },
  ["categories"],
  {
    revalidate: 3600, // 1 hour
    tags: ["categories", "products"],
  }
);

const getCachedProducts = cache(
  async (recommendedCategories: string[]) => {
    return prisma.product.findMany({
      where: {
        categoryId: {
          in: recommendedCategories,
        },
      },
      include: {
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
  },
  ["products"]
);
export async function POST(req: NextRequest) {
  /**
   * This API route is for recommending products based on user prompts.
   * This will be a multi-stage approach:
   * 1. Provide the model context on the general categories of products
   * 2. Ask the model to select the most relevant categories
   * 3. Query products from those categories
   * 4. Ask the model to recommend specific products
   * 5. Return the recommended products to the user
   */

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Fetch all the categories from the database
    const categories = await getCachedCategories();

    // Reshape the categories into a format that the model can understand
    const categoriesArray = categories.map(
      (category) => `${category.name}:${category.id}`
    );

    // Category recommendation model
    const [categoryModel, productModel, explanationModel] = await Promise.all([
      gemini.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            description: "List of category ids only",
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.STRING,
            },
          },
        },
      }),
      gemini.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            description: "List of product ids only",
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.STRING,
            },
          },
        },
      }),
      gemini.getGenerativeModel({ model: "gemini-1.5-flash" }),
    ]);

    // First pass: Get relevant categories
    const categoryPrompt = `Your name is Silvie a helpful AI assistant that recommends products based on user prompts. 
      The user prompt is: "${prompt}". 
      The categories are: ${categoriesArray.join(
        ", "
      )} formatted as [Category name:Category id]. 
      Based on the user prompt, which categories should we recommend products from?
      The response should be a list of category ids only.`;

    const recommendedCategories = await categoryModel
      .generateContent(categoryPrompt)
      .then((res) => JSON.parse(res.response.text()));

    if (!recommendedCategories || recommendedCategories.length === 0) {
      return NextResponse.json(
        { error: "No relevant categories found" },
        { status: 404 }
      );
    }

    const products = await getCachedProducts(recommendedCategories);

    if (products.length === 0) {
      return NextResponse.json(
        { error: "No products found in the recommended categories" },
        { status: 404 }
      );
    }

    // Format products for the model
    const productsArray = products.map(
      (product) => `${product.name}:${product.id}`
    );

    const productPrompt = `Your name is Silvie a helpful AI assistant that recommends products based on user prompts.
      The user prompt is: "${prompt}".
      The available products are: ${productsArray.join(
        ", "
      )} formatted as [Product name:Product id].
      Based on the user prompt, which specific products should we recommend?
      The response should be a list of product ids only.`;

    const recommendedProductIds = await productModel
      .generateContent(productPrompt)
      .then((res) => JSON.parse(res.response.text()));

    if (!recommendedProductIds || recommendedProductIds.length === 0) {
      return NextResponse.json(
        { error: "No specific products could be recommended" },
        { status: 404 }
      );
    }

    // Get the full details of recommended products
    const recommendedProducts = products.filter((product) =>
      recommendedProductIds.includes(product.id)
    );

    // Explain the recommendation
    const explanationPrompt = `Your name is Silvie a helpful AI assistant for a hardware store.
      A user asked: "${prompt}"
      Based on this, you recommended the following products: ${recommendedProducts
        .map((p) => p.name)
        .join(", ")}.
      Please provide a brief explanation of why these products are recommended for this use case. Keep your explanation short and concise.`;

    const explanation = await explanationModel
      .generateContent(explanationPrompt)
      .then((res) => res.response.text());

    return NextResponse.json({
      recommendedProducts,
      explanation,
    });
  } catch (error) {
    console.error("Error in product recommendation:", error);
    return NextResponse.json(
      { error: "Failed to process recommendation" },
      { status: 500 }
    );
  }
}
