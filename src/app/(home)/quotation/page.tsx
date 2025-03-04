import { QuotationTable } from "@/components/front/quotation/quotation-table";
import { Button } from "@/components/ui/button";
import { routeProtection } from "@/lib/auth-functions";
import { Metadata } from "next";
import { History, Printer, Send } from "lucide-react";
import Link from "next/link";
import PrintQuotation from "@/components/quotation-print";
import authCache from "@/lib/auth-cache";
import { generateHTMLPDF } from "@/lib/pdf";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";

export function generateMetadata(): Metadata {
  return {
    title: "My Quotation | Silver Rose Hardware",
  };
}

export default async function QuotationPage() {
  await routeProtection("/login");
  const session = await authCache();
  const userId = session?.user?.id;
  return (
    <div className="w-full pb-10 h-full justify-start">
      <main className="px-4 sm:px-8 md:px-16 lg:px-32 pt-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <h1 className="text-3xl font-bold">My Quotation</h1>
          <div className="flex items-center gap-4">
            <Link href="/quotation/history">
              <Button variant="outline">
                <History />
                <span>History</span>
              </Button>
            </Link>
            <Suspense fallback={<PrintQuotationButtonSkeleton />}>
              <PrintQuotationButton userId={userId as string} />
            </Suspense>
          </div>
        </div>
        <div>
          <QuotationTable />
        </div>
        <div className="flex justify-end">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold">Need a Custom Quote?</h2>
            <Link href="/quotation/request">
              <Button size="lg">
                <Send />
                <span>Send a Quotation Request</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

async function PrintQuotationButton({ userId }: { userId: string }) {
  const userQuotation = await prisma.userQuotation.findFirst({
    where: {
      userId: userId as string,
    },
    include: {
      quotation: {
        include: {
          QuotationItem: {
            include: {
              variant: {
                include: {
                  attributes: {
                    include: {
                      attribute: true,
                    },
                  },
                  product: true,
                },
              },
            },
          },
          AdditionalCharge: true,
          user: true,
          QuotationRequest: true,
        },
      },
    },
  });
  const htmlContent = generateHTMLPDF(
    JSON.parse(JSON.stringify(userQuotation?.quotation))
  );
  return <PrintQuotation htmlContent={htmlContent} />;
}

function PrintQuotationButtonSkeleton() {
  return (
    <Button variant="outline" disabled>
      <Printer className="h-4 w-4" />
      <span>Print Quotation</span>
    </Button>
  );
}
