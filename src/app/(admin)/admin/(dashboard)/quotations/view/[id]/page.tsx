import { AdminHeader } from "@/components/admin/admin-header";
import { QuotationInformation } from "@/components/admin/quotations/quotation-information";
import { RemarksForm } from "@/components/admin/quotations/remarks-form";
import { prisma } from "@/lib/prisma";

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
  const status = quotationData?.status || "Pending";
  return (
    <div className="min-h-screen bg-muted w-vh">
      <AdminHeader
        currentPage="View Quotation"
        crumbItems={[{ name: "Quotations", href: "/admin/quotations" }]}
      />
      <section className="p-4 max-w-7xl mx-auto">
        <QuotationInformation
          quotationRequest={JSON.parse(JSON.stringify(quotationData))} readOnly={status !== "Pending"}
        />
        <RemarksForm
          quotationRequest={JSON.parse(JSON.stringify(quotationData))} readOnly={status !== "Pending"}
        />
      </section>
    </div>
  );
}
