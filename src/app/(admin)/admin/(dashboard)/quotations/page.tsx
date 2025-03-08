import { AdminHeader } from "@/components/admin/admin-header";
import { QuotationDataTable } from "@/components/admin/quotations/quotation-dt";
import { columns } from "@/components/admin/quotations/quotation-dt-columns";
import { routeProtection } from "@/lib/auth-functions";
import { prisma } from "@/lib/prisma";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  ["quotationRequests"],
  { tags: ["quotationRequests"] }
);

const filterQuotationRequests = cache(
  async (
    quotationRequests: Awaited<ReturnType<typeof cachedFetchQuotationRequests>>
  ) => {
    // return two arrays based on the status of the quotation requests
    const pending = quotationRequests.filter((request) =>
      request.status.includes("Pending")
    );
    const responded = quotationRequests.filter((request) =>
      request.status.includes("Responded")
    );
    return { pending, responded };
  },
  ["quotationRequests"]
);
export default async function QuotationsPage() {
  await routeProtection("/admin/login");
  const quotationRequests = await cachedFetchQuotationRequests();
  const { pending, responded } = await filterQuotationRequests(
    quotationRequests
  );

  return (
    <div className="min-h-screen bg-muted">
      <AdminHeader currentPage="Quotations" />
      <main className="p-6 flex flex-col gap-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Quotations</h1>
          <p className="text-sm text-muted-foreground">
            Manage all quotations requests
          </p>
        </div>
        <div className="w-full">
          <Tabs defaultValue="all" className="w-full">
            <div className="p-2 bg-background rounded-sm shadow-none border">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="w-full ">
                  All ({quotationRequests.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="w-full">
                  Pending ({pending.length})
                </TabsTrigger>
                <TabsTrigger value="responded" className="w-full ">
                  Responded ({responded.length})
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="all">
              <QuotationDataTable
                columns={columns}
                data={JSON.parse(JSON.stringify(quotationRequests))}
              />
            </TabsContent>
            <TabsContent value="pending">
              <QuotationDataTable
                columns={columns}
                data={JSON.parse(JSON.stringify(pending))}
              />
            </TabsContent>
            <TabsContent value="responded">
              <QuotationDataTable
                columns={columns}
                data={JSON.parse(JSON.stringify(responded))}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
