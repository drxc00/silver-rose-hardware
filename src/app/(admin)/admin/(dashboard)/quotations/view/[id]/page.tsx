import { AdminHeader } from "@/components/admin/admin-header";
import { MailQuotation } from "@/components/admin/quotations/mail-quotation";
import { QuotationInformation } from "@/components/admin/quotations/quotation-information";
import { RemarksForm } from "@/components/admin/quotations/remarks-form";
import PrintQuotation from "@/components/quotation-print";
import { Button } from "@/components/ui/button";
import { QuotationInformationSkeleton } from "@/components/admin/quotations/quotation-information-skeleton";
import { generateHTMLPDF } from "@/lib/pdf";
import { prisma } from "@/lib/prisma";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { unstable_cache as cache } from "next/cache";

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

  return (
    <div className="min-h-screen bg-muted w-vh">
      <AdminHeader
        currentPage="View Quotation"
        crumbItems={[{ name: "Quotations", href: "/admin/quotations" }]}
      />
      <Suspense fallback={<QuotationSkeleton />}>
        <QuotationViewContent id={id} />
      </Suspense>
    </div>
  );
}

async function QuotationViewContent({ id }: { id: string }) {
  const quotationData = JSON.parse(JSON.stringify(await getQuotation(id)));
  const status = quotationData?.status || "Pending";
  return (
    <section className="p-4 max-w-7xl mx-auto">
      <div className="flex items-center flex-col md:flex-row justify-between pb-4">
        <Link href="/admin/quotations">
          <Button variant="ghost">
            <ChevronLeft />
            <span>Back to Quotations</span>
          </Button>
        </Link>
        <div className="flex gap-4">
          <PrintQuotation
            htmlContent={generateHTMLPDF(
              {
                ...quotationData.quotation,
                QuotationRequest: [
                  {
                    ...quotationData,
                  },
                ],
              }!
            )}
          />
          {status === "Pending" && (
            <MailQuotation quotationRequestId={quotationData?.id as string} />
          )}
        </div>
      </div>
      <QuotationInformation
        quotationRequest={quotationData!}
        readOnly={status !== "Pending"}
      />
      <RemarksForm
        quotationRequest={quotationData!}
        readOnly={status !== "Pending"}
      />
    </section>
  );
}

function QuotationSkeleton() {
  return (
    <section className="p-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between pb-4">
        <Link href="/admin/quotations">
          <Button variant="ghost">
            <ChevronLeft />
            <span>Back to Quotations</span>
          </Button>
        </Link>
        <div className="flex gap-4">
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      <QuotationInformationSkeleton />
    </section>
  );
}
