import { QuotationItemWithRelations } from "@/app/types";
import { AdminHeader } from "@/components/admin/admin-header";
import { QuotationInformation } from "@/components/admin/quotations/quotation-information";
import { prisma } from "@/lib/prisma";

export default async function QuotationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Quotation Id
  const id = (await params).id || "";
  const quotationData = await prisma.quotationRequest.findFirst({
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
      <AdminHeader
        currentPage="View Quotation"
        crumbItems={[{ name: "Quotations", href: "/admin/quotations" }]}
      />
      <section className="p-4 max-w-7xl mx-auto">
        <QuotationInformation
          quotationRequest={JSON.parse(JSON.stringify(quotationData))}
        />
      </section>
    </div>
  );
}
