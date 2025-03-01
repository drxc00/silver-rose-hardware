import { QuotationTable } from "@/components/front/quotation/quotation-table";
import { Button } from "@/components/ui/button";
import { routeProtection } from "@/lib/auth-functions";
import { Metadata } from "next";
import { History } from "lucide-react";
import Link from "next/link";
import PrintQuotation from "@/components/quotation-print";
import authCache from "@/lib/auth-cache";
import { generateHTMLPDF } from "@/lib/pdf";
import { prisma } from "@/lib/prisma";

export function generateMetadata(): Metadata {
  return {
    title: "My Quotation | Silver Rose Hardware",
  };
}

export default async function QuotationPage() {
  await routeProtection("/login");
  const session = await authCache();
  const userId = session?.user?.id;
  // Fetch the quotation data
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
  return (
    <div className="w-full h-full justify-start">
      <main className="px-32 pt-8 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Quotation</h1>
          <div className="flex items-center gap-4">
            <Link href="/quotation/history">
              <Button variant="outline">
                <History />
                <span>History</span>
              </Button>
            </Link>
            <PrintQuotation htmlContent={htmlContent} />
          </div>
        </div>
        <div>
          <QuotationTable />
        </div>
        <div className="flex justify-end">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold">Need a Custom Quote?</h2>
            <Link href="/quotation/request">
              <Button size="lg">Send a Quotation Request</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
