import Link from "next/link";
import { ProductsGrid } from "@/components/front/products-grid";
import { ChevronRight } from "lucide-react";

export default function SubcategoryPageLoading() {
  return (
    <div className="px-0 md:px-8 w-full h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-gray-900">
          Categories
        </Link>
        <ChevronRight className="h-4 w-4" />
        <div className="w-24 h-5 bg-muted animate-pulse rounded"></div>
        <ChevronRight className="h-4 w-4" />
        <div className="w-32 h-5 bg-muted animate-pulse rounded"></div>
      </div>

      {/* Category Title */}
      <div className="w-64 h-9 bg-muted animate-pulse rounded mb-6"></div>

      {/* Products Grid */}
      <ProductsGrid products={[]} isLoading />
    </div>
  );
}
