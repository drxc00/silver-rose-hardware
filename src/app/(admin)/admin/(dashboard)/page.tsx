import { DashboardData } from "@/app/types";
import { AdminHeader } from "@/components/admin/admin-header";
import { DataCard } from "@/components/admin/dashboard/data-card";
import { QuickNavigationCard } from "@/components/admin/dashboard/quick-navigation-card";
import authCache from "@/lib/auth-cache";
import { UserRole } from "@/lib/constants";
import {
  DashboardDataGrid,
  DashboardDataGridSkeleton,
} from "@/components/admin/dashboard/data-grid";
import {
  ChartBarStacked,
  ChartBarStackedIcon,
  MessageCircleQuestion,
  MessageSquareQuoteIcon,
  Package,
  PackagePlus,
  Quote,
  UserPlus2,
  Users2Icon,
} from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
export default async function AdminPage() {
  // Check if there is a user logged in
  const session = await authCache();
  if (!session) redirect("/admin/login");
  // Check if the user is an admin
  if (session?.user?.role !== UserRole.ADMIN) redirect("/");
  return (
    <div className="min-h-screen bg-muted w-vh">
      <AdminHeader currentPage="Home" />
      <main className="p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <Suspense fallback={<DashboardDataGridSkeleton />}>
          <DashboardDataGrid />
        </Suspense>
        <div>
          <h1 className="text-3xl font-bold py-6">Quick Navigations</h1>
          <div className="grid grid-cols-4 gap-6">
            <QuickNavigationCard
              icon={<PackagePlus className="w-8 h-8" />}
              title="Add New Product"
              href="/admin/products/add"
            />
            <QuickNavigationCard
              icon={<ChartBarStackedIcon className="w-8 h-8" />}
              title="Add New Category"
              href="/admin/categories/add"
            />
            <QuickNavigationCard
              icon={<Quote className="w-8 h-8" />}
              title="Quotation Requests"
              href="/admin/quotations"
            />
            <QuickNavigationCard
              icon={<UserPlus2 className="w-8 h-8" />}
              title="Create New User"
              href="/admin/users/add"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
