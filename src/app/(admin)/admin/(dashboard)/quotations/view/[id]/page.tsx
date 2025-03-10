import { AdminHeader } from "@/components/admin/admin-header";
import { MailQuotation } from "@/components/admin/quotations/mail-quotation";
import { QuotationInformation } from "@/components/admin/quotations/quotation-information";
import { RemarksForm } from "@/components/admin/quotations/remarks-form";
import PrintQuotation from "@/components/quotation-print";
import { Button } from "@/components/ui/button";
import { generateHTMLPDF } from "@/lib/pdf";
import { prisma } from "@/lib/prisma";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { unstable_cache as cache } from "next/cache";
import { Card, CardContent } from "@/components/ui/card";

export const revalidate = 0;

export async function generateStaticParams() {
  /*
   * This will pre-render all quotation request pages at build time.
   */
  const quotationRequests = await prisma.quotationRequest.findMany({});
  return quotationRequests.map((quotationRequest) => ({
    id: quotationRequest.id || "",
  }));
}
const getQuotation = cache(
  async (id: string) => {
    return prisma.quotationRequest.findFirst({
      where: {
        id: id,
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
            user: {
              include: {
                accounts: true,
              },
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
  ["quotationRequest"],
  { tags: ["quotationRequest"] }
);

export default async function QuotationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Quotation Id
  const id = (await params).id || "";
  const quotationData = await getQuotation(id);
  const status = quotationData?.status || "Pending";
  return (
    <div className="min-h-screen bg-muted w-vh">
      <AdminHeader
        currentPage="View Quotation"
        crumbItems={[{ name: "Quotations", href: "/admin/quotations" }]}
      />
      <section className="p-4 mx-auto flex flex-col gap-4">
        <Card className="rounded-sm shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center flex-col md:flex-row justify-between">
              <Link href="/admin/quotations">
                <Button variant="outline">
                  <ChevronLeft />
                  <span>Back to Quotations</span>
                </Button>
              </Link>
              <div className="flex gap-4">
                <PrintQuotation
                  htmlContent={generateHTMLPDF(
                    {
                      ...quotationData?.quotation,
                      QuotationRequest: [
                        {
                          ...quotationData,
                        },
                      ],
                    }! as any
                  )}
                />
                {status === "Pending" && (
                  <MailQuotation
                    quotationRequestId={quotationData?.id as string}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-4">
          <QuotationInformation
            quotationRequest={quotationData!}
            readOnly={status !== "Pending"}
          />
          <RemarksForm
            quotationRequest={quotationData!}
            readOnly={status !== "Pending"}
          />
        </div>
      </section>
    </div>
  );
}
