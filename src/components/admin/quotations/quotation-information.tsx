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
      <Card className="border-b-none">
        <CardHeader className="flex flex-row items-center justify-between bg-sidebar border-b">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-primary">
              Quotation{" "}
              <span className="text-muted-foreground">
                #
                {quotationRequest.quotation.quotationNumber
                  .toString()
                  .padStart(4, "0")}
              </span>
            </h1>
            <h2 className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{quotationRequest.user.name}</span>
            </h2>
          </div>
          <div>
            <div className="flex gap-2 items-center justify-end">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <h1 className="text-muted-foreground">
                {quotationRequest.createdAt.toLocaleString().split("T")[0]}
              </h1>
            </div>
            <div className="flex flex-row">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {quotationRequest.user.email}
                </span>
              </div>
              {quotationRequest.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {quotationRequest.phone}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="py-4 border-b">
            <h1 className="font-semibold">Customer Note</h1>
            <p className="text-muted-foreground">
              {quotationRequest.customerNote}
            </p>
          </div>
          <div className="py-4">
            <h1 className="font-semibold pb-2">Products</h1>
            <div className="overflow-x-auto">
              <Table className="border-b">
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Specifciations</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotationRequest.quotation.QuotationItem.map((item) => (
                    <TableRow key={item?.id}>
                      <TableCell>{item?.variant.product.name}</TableCell>
                      <TableCell>
                        {item?.variant.attributes
                          .map(
                            (attribute) =>
                              attribute.attribute.name + ": " + attribute.value
                          )
                          .join("; ")}
                      </TableCell>
                      <TableCell>
                        ₱ {Number(item?.priceAtQuotation).toLocaleString()}
                      </TableCell>
                      <TableCell>{Number(item?.quantity)}</TableCell>
                      <TableCell>
                        {" "}
                        ₱
                        {(
                          Number(item?.priceAtQuotation) *
                          Number(item?.quantity)
                        ).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="py-6">
            <AdditionalChargesTable
              quotationRequest={quotationRequest}
              readOnly={readOnly}
            />
          </div>
        </CardContent>
        <CardFooter className="bg-sidebar border-t flex justify-end">
          <div className="w-full max-w-xs space-y-2  pt-4 font-medium">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Add&apos;l Charges</span>
              <span>{formatCurrency(calculateAdditionalCharges())}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">Total</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(calculateTotal())}
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
