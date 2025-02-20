import { QuotationHistoryTable } from "@/components/front/quotation/quotation-history-table";
import { columns } from "@/components/front/quotation/quotation-history-columns";
import authCache from "@/lib/auth-cache";
import { User } from "next-auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function QuotationHistoryPage() {
  const session = await authCache();
  
  if (!session) redirect("/login");

  const user = session?.user as User;
  const quotationRequests = await prisma.quotationRequest.findMany({
    where: {
      userId: user.id,
    },
    include: {
      quotation: {
        include: {
          QuotationItem: {
            include: { variant: true },
          },
        },
      },
    },
  });
  return (
    <div className="bg-muted w-full justify-start h-full">
      <main className="px-32 pt-8 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Quotation History</h1>
        </div>
        <div>
          <Card className="w-full">
            <CardContent className="p-4">
              <QuotationHistoryTable
                columns={columns}
                data={JSON.parse(JSON.stringify(quotationRequests))}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
