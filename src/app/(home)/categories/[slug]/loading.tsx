import { ProductsGrid } from "@/components/front/products-grid";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CategoryPageLoading() {
  return (
    <div className="px-0 md:px-8 w-full h-full">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-gray-900">
          Categories
        </Link>
        <ChevronRight className="h-4 w-4" />
        <div className="w-32 h-5 bg-muted animate-pulse rounded"></div>
      </div>

      <div className="w-64 h-9 bg-muted animate-pulse rounded mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="relative h-48 overflow-hidden border-none">
            <div className="absolute inset-0 bg-muted animate-pulse"></div>
          </Card>
        ))}
      </div>

      <ProductsGrid products={[]} isLoading />
    </div>
  );
}
