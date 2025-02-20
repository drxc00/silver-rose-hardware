import { AdminHeader } from "@/components/admin/admin-header";
import { QuotationDataTable } from "@/components/admin/quotations/quotation-dt";
import { columns } from "@/components/admin/quotations/quotation-dt-columns";
import { routeProtection } from "@/lib/auth-functions";
import { prisma } from "@/lib/prisma";

export default async function QuotationsPage() {
  await routeProtection("/admin/login");
  const quotationRequests = await prisma.quotationRequest.findMany({
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
  return (
    <div className="min-h-screen bg-muted w-vh">
      <AdminHeader currentPage="Quotations" />
      <main className="p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Quotations</h1>
        </div>
        <div>
          <QuotationDataTable
            columns={columns}
            data={JSON.parse(JSON.stringify(quotationRequests))}
          />
        </div>
      </main>
    </div>
  );
}
