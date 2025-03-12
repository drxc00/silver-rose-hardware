"use client";

import { QuotationItemWithRelations } from "@/app/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Mail, Phone, User } from "lucide-react";
import { AdditionalChargesTable } from "./additional-charges-table";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface QuotationInformationProps {
  quotationRequest: QuotationItemWithRelations;
  readOnly?: boolean;
}

export function QuotationInformation({
  quotationRequest,
  readOnly = false,
}: QuotationInformationProps) {
  const calculateSubtotal = () => {
    return quotationRequest.quotation.QuotationItem.reduce(
      (acc, item) =>
        acc + Number(item?.priceAtQuotation) * Number(item?.quantity),
      0
    );
  };

  const calculateAdditionalCharges = () => {
    return quotationRequest.quotation.AdditionalCharge.reduce(
      (acc, charge) => acc + Number(charge.amount),
      0
    );
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateAdditionalCharges();
  };
  return (
    <div className="flex flex-col gap-4">
      <Card className="border shadow-none rounded-sm">
        <CardHeader className="flex flex-row items-center justify-between bg-card p-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">
              Quotation{" "}
              <span className="text-muted-foreground font-medium">
                #{quotationRequest.quotation.quotationNumber.toString().padStart(4, "0")}
              </span>
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{quotationRequest.user.name}</span>
              <Separator orientation="vertical" className="h-4" />
              <Mail className="w-4 h-4" />
              <span>{quotationRequest.user.email}</span>
              {quotationRequest.phone && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <Phone className="w-4 h-4" />
                  <span>{quotationRequest.phone}</span>
                </>
              )}
            </div>
          </div>
          <Badge variant="outline" className="text-sm font-medium rounded-sm">
            <Calendar className="w-4 h-4 mr-2" />
            {quotationRequest.createdAt.toLocaleString().split("T")[0]}
          </Badge>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {quotationRequest.customerNote && (
            <div className="p-4 bg-muted rounded-sm mb-6">
              <h2 className="text-sm font-medium mb-2">Customer Note</h2>
              <p className="text-sm text-muted-foreground">
                {quotationRequest.customerNote}
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Products</h2>
              <div className="overflow-x-auto rounded-sm border">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[30%]">Product</TableHead>
                      <TableHead className="w-[30%]">Specifications</TableHead>
                      <TableHead className="w-[15%] text-right">Unit Price</TableHead>
                      <TableHead className="w-[10%] text-right">Qty</TableHead>
                      <TableHead className="w-[15%] text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotationRequest.quotation.QuotationItem.map((item) => (
                      <TableRow key={item?.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {item?.variant?.product.name}
                        </TableCell>
                        <TableCell>
                          {item?.variant?.attributes
                            .map(
                              (attribute) =>
                                `${attribute.attribute.name}: ${attribute.value}`
                            )
                            .join(", ")}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(Number(item?.priceAtQuotation))}
                        </TableCell>
                        <TableCell className="text-right">
                          {Number(item?.quantity)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(
                            Number(item?.priceAtQuotation) *
                            Number(item?.quantity)
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <AdditionalChargesTable
              quotationRequest={quotationRequest}
              readOnly={readOnly}
            />
          </div>
        </CardContent>

        <CardFooter className="bg-muted/50 p-6">
          <div className="w-full max-w-sm space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Additional Charges</span>
              <span>{formatCurrency(calculateAdditionalCharges())}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary">
                {formatCurrency(calculateTotal())}
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
