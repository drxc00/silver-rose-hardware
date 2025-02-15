import { CategorySidebar } from "@/components/front/category-sidebar";
import { fetchCategories } from "@/lib/data-fetch";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await fetchCategories();
  return (
    <main className="p-10 flex min-h-screen">
      <CategorySidebar categories={categories} />
      {children}
    </main>
  );
}
