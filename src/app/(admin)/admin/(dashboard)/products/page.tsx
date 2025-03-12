import { AdminHeader } from "@/components/admin/admin-header";
import { ProductDataTable } from "@/components/admin/products/product-dt";
import { productsColumns } from "@/components/admin/products/product-dt-columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { fetchAllProducts, fetchCategories } from "@/lib/data-fetch";
import { unstable_cache as cache } from "next/cache";

const cachedFetchAllProducts = cache(fetchAllProducts);
const cachedFetchCategories = cache(fetchCategories);

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    cachedFetchAllProducts(),
    cachedFetchCategories(),
  ]);
  return (
    <div className="min-h-screen bg-muted w-vh">
      <AdminHeader currentPage="Products" />
      <main className="p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-sm text-muted-foreground">
              Manage your products
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/products/add">
              <Button>
                <Plus />
                <span>Add Product</span>
              </Button>
            </Link>
            <Link href="/admin/products/add-unstable">
              <Button>
                <Plus />
                <span>Add Product (Unstable test)</span>
              </Button>
            </Link>
          </div>
        </div>
        <div>
          <ProductDataTable
            columns={productsColumns as any}
            data={products}
            categories={categories}
          />
        </div>
      </main>
    </div>
  );
}
