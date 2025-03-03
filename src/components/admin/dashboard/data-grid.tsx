import { DataCard, DataCardSkeleton } from "./data-card";
import { fetchDashboardData } from "@/lib/data-fetch";
import { DashboardData } from "@/app/types";
import {
  MessageSquareQuoteIcon,
  MessageCircleQuestion,
  Package,
  ChartBarStacked,
  Users2Icon,
} from "lucide-react";
import { Quote } from "lucide-react";

export async function DashboardDataGrid() {
  const dashboardData: DashboardData = await fetchDashboardData();
  return (
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
  );
}

export function DashboardDataGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <DataCardSkeleton />
      <DataCardSkeleton />
      <DataCardSkeleton />
      <DataCardSkeleton />
      <DataCardSkeleton />
      <DataCardSkeleton />
    </div>
  );
}
