import { unstable_cache as cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import PrintQuotation from "@/components/quotation-print";
import { generateHTMLPDF } from "@/lib/pdf";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const getQuotation = cache(
  async (id: string) => {
    return prisma.quotation.findFirst({
      where: {
        id: id,
      },
      include: {
        AdditionalCharge: true,
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
        user: true,
        QuotationRequest: true,
      },
    });
  },
  ["quotationRequest"],
  { tags: ["quotationRequest"] }
);

export default async function QuotationRecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quotationData = await getQuotation(id);

  if (!quotationData) {
    return <div className="text-center py-10">Quotation not found</div>;
  }

  const subtotal = quotationData.QuotationItem.reduce(
    (total, item) => total + Number(item.variant.price) * Number(item.quantity),
    0
  );
  const additionalChargesTotal = quotationData.AdditionalCharge.reduce(
    (total, charge) => total + Number(charge.amount),
    0
  );
  const total = subtotal + additionalChargesTotal;
  return (
    <main className="mx-auto py-10 px-8 md:px-12 lg:px-32">
      <div className="flex justify-between w-full items-center pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">
              Quotation #{quotationData.quotationNumber}
            </h1>
            <Badge variant={quotationData.QuotationRequest[0].status == "Pending" ? "secondary" : "default"}>{quotationData.QuotationRequest[0].status}</Badge>
          </div>
          <h2 className="text-muted-foreground">
            Created: {new Date(quotationData.createdAt).toLocaleString()}
          </h2>
        </div>
        <Suspense fallback={<PrintQuotationButtonSkeleton />}>
          <PrintQuotationButton
            quotationRequestId={quotationData.QuotationRequest[0].id}
          />
        </Suspense>
      </div>
      <div className="flex flex-col gap-4">
        <Card className="rounded-sm shadow-none">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Specifications</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotationData.QuotationItem.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.variant.product.name}</TableCell>
                      <TableCell>
                        {item.variant.attributes
                          .map(
                            (attribute) =>
                              `${attribute.attribute.name}: ${attribute.value}`
                          )
                          .join("; ")}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(Number(item.variant.price))}
                      </TableCell>
                      <TableCell className="text-right">
                        {Number(item.quantity)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          Number(item.variant.price) * Number(item.quantity)
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {quotationData.AdditionalCharge.map((charge) => (
                <div key={charge.id} className="flex justify-between">
                  <span>{charge.name}</span>
                  <span>{formatCurrency(Number(charge.amount))}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold mt-2">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        {quotationData.QuotationRequest[0].remarks && (
          <Card className="rounded-sm shadow-none">
            <CardContent className="p-6">
              <div>
                <h2 className="font-bold">Remarks</h2>
                <p className="text-muted-foreground">{quotationData.QuotationRequest[0].remarks}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

async function PrintQuotationButton({
  quotationRequestId,
}: {
  quotationRequestId: string;
}) {
  const userQuotation = await prisma.quotationRequest.findFirst({
    where: {
      id: quotationRequestId as string,
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
    <Button variant="outline" disabled className="rounded-sm">
      <Printer className="h-4 w-4" />
      <span>Print Quotation</span>
    </Button>
  );
}
