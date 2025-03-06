import {
  CategoriesGrid,
  CategoriesGridSkeleton,
} from "@/components/front/categories/categories-grid";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Categories | Silver Rose Hardware",
};

export default async function CategoriesPage() {
  return (
    <main className="mx-auto h-full py-10">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center pb-10">Categories</h1>
        <Suspense fallback={<CategoriesGridSkeleton />}>
          <CategoriesGrid />
        </Suspense>
      </div>
    </main>
  );
}
