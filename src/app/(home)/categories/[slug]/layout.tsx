import { CategorySidebar } from "@/components/front/category-sidebar";
import { fetchCategories } from "@/lib/data-fetch";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await fetchCategories();
  return (
    <main className="p-10 md:flex h-full">
      <div className="pb-4 md:p-0">
        <CategorySidebar categories={categories} />
      </div>
      {children}
    </main>
  );
}
