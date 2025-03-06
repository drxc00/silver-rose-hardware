import { AdminHeader } from "@/components/admin/admin-header";
import { QuotationDataTable } from "@/components/admin/quotations/quotation-dt";
import { columns } from "@/components/admin/quotations/quotation-dt-columns";
import { routeProtection } from "@/lib/auth-functions";
import { prisma } from "@/lib/prisma";
import { unstable_cache as cache } from "next/cache";

const cachedFetchQuotationRequests = cache(
  async () => {
    return prisma.quotationRequest.findMany({
      include: {
        quotation: {
          include: {
            QuotationItem: {
              include: { variant: true },
            },
          },
        },
        user: {
          include: {
            accounts: true,
          },
        },
      },
    });
  },
  ["quotationRequests"],
  { tags: ["quotationRequests"] }
);

export default async function QuotationsPage() {
  await routeProtection("/admin/login");
  const quotationRequests = await cachedFetchQuotationRequests();
  return (
    <div className="min-h-screen bg-muted">
      <AdminHeader currentPage="Quotations" />
      <main className="p-6 flex flex-col gap-6">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">Quotations</h1>
        </div>
        <div className="w-full">
          <QuotationDataTable
            columns={columns}
            data={JSON.parse(JSON.stringify(quotationRequests))}
          />
        </div>
      </main>
    </div>
  );
}
