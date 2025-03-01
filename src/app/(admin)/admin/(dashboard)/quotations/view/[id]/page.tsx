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

export async function generateStaticParams() {
  /*
   * This will pre-render all quotation request pages at build time.
   */
  const quotationRequests = await prisma.quotationRequest.findMany({});
  return quotationRequests.map((quotationRequest) => ({
    id: quotationRequest.id || "",
  }));
}

const getQuotation = async (id: string) => {
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
        },
      },
      user: {
        include: {
          accounts: true,
        },
      },
    },
  });
};

export default async function QuotationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Quotation Id
  const id = (await params).id || "";
  const quotationData = await getQuotation(id);
  const rawQuotationData = await prisma.quotation.findUnique({
    where: { id: quotationData?.quotationId || "" },
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
  });
  const status = quotationData?.status || "Pending";
  return (
    <div className="min-h-screen bg-muted w-vh">
      <AdminHeader
        currentPage="View Quotation"
        crumbItems={[{ name: "Quotations", href: "/admin/quotations" }]}
      />
      <section className="p-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between pb-4">
          <Link href="/admin/quotations">
            <Button variant="ghost">
              <ChevronLeft />
              <span>Back to Quotations</span>
            </Button>
          </Link>
          <div className="flex gap-4">
            <PrintQuotation
              htmlContent={generateHTMLPDF(
                JSON.parse(JSON.stringify(rawQuotationData))
              )}
            />
            {status === "Pending" && (
              <MailQuotation quotationRequestId={quotationData?.id as string} />
            )}
          </div>
        </div>
        {/* <Invoice
          htmlContent={generateHTMLPDF(
            JSON.parse(JSON.stringify(rawQuotationData))
          )}
        />

        <MailQuotation quotationRequestId={quotationData?.id as string} /> */}
        <QuotationInformation
          quotationRequest={JSON.parse(JSON.stringify(quotationData))}
          readOnly={status !== "Pending"}
        />
        <RemarksForm
          quotationRequest={JSON.parse(JSON.stringify(quotationData))}
          readOnly={status !== "Pending"}
        />
      </section>
    </div>
  );
}
