import { DashboardData } from "@/app/types";
import { AdminHeader } from "@/components/admin/admin-header";
import { DataCard } from "@/components/admin/dashboard/data-card";
import { QuickNavigationCard } from "@/components/admin/dashboard/quick-navigation-card";
import authCache from "@/lib/auth-cache";
import { UserRole } from "@/lib/constants";
import { fetchDashboardData } from "@/lib/data-fetch";
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
export default async function AdminPage() {
  // Check if there is a user logged in
  const session = await authCache();
  if (!session) redirect("/admin/login");
  // Check if the user is an admin
  if (session?.user?.role !== UserRole.ADMIN) redirect("/");
  const dashboardData: DashboardData = await fetchDashboardData();
  return (
    <div className="min-h-screen bg-muted w-vh">
      <AdminHeader currentPage="Home" />
      <main className="p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <DataCard
            title="Total Quotations"
            value={dashboardData.quotations.total.toString()}
            icon={<Quote className="w-4 h-4" />}
          />
          <DataCard
            title="Total Quotation Requests"
            value={dashboardData.quotationRequests.total.toString()}
            icon={<MessageSquareQuoteIcon className="w-4 h-4" />}
            description={`+${dashboardData.quotationRequests.details.requestsFromPastWeek} from last week`}
          />
          <DataCard
            title="Pending Quotations"
            value={dashboardData.pendingQuotations.total.toString()}
            icon={<MessageCircleQuestion className="w-4 h-4" />}
            description={`+${dashboardData.pendingQuotations.details.requestsFromLastHour} from last hour`}
          />
          <DataCard
            title="Total Products"
            value={dashboardData.products.total.toString()}
            icon={<Package className="w-4 h-4" />}
          />
          <DataCard
            title="Total Categories"
            value={dashboardData.categories.total.toString()}
            icon={<ChartBarStacked className="w-4 h-4" />}
            description={`${dashboardData.categories.details.parentCategories.toString()} parent categories & ${dashboardData.categories.details.subCategories.toString()} subcategories`}
          />
          <DataCard
            title="Total Users"
            value={dashboardData.users.total.toString()}
            icon={<Users2Icon className="w-4 h-4" />}
            description={`${dashboardData.users.details.admin.toString()} admins & ${dashboardData.users.details.customer.toString()} customers`}
          />
        </div>
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
