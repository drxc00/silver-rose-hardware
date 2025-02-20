"use client";

import { QuotationItemWithRelations } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, ChevronLeft, Mail, Phone, User } from "lucide-react";
import { AdditionalChargesTable } from "./additional-charges-table";

interface QuotationInformationProps {
  quotationRequest: QuotationItemWithRelations;
}

export function QuotationInformation({
  quotationRequest,
}: QuotationInformationProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost">
          <ChevronLeft />
          <span>Back to Quotations</span>
        </Button>
        <div className="flex gap-4">
          <Button variant="outline">Discard Changes</Button>
          <Button>Send to Customer</Button>
        </div>
      </div>
      <Card>
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
          <div className="py-6 border-b">
            <h1 className="font-semibold pb-2">Products</h1>
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
                      ₱ {Number(item?.variant.price).toLocaleString()}
                    </TableCell>
                    <TableCell>{Number(item?.quantity)}</TableCell>
                    <TableCell>
                      {" "}
                      ₱
                      {(
                        Number(item?.variant.price) * Number(item?.quantity)
                      ).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="py-6 border-b">
            <AdditionalChargesTable form={null} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
