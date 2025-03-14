"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OptimisticQuotationState } from "@/hooks/use-quotation";
import { formatCurrency } from "@/lib/utils";

export function QuotationSummaryTable({
  quotation,
}: {
  quotation: OptimisticQuotationState;
}) {
  return (
    <Table>
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
        {quotation.quotation.QuotationItem.map((item) => (
          <TableRow key={item?.id}>
            <TableCell>{item?.variant?.product.name}</TableCell>
            <TableCell>
              {item?.variant?.attributes
                .map(
                  (attribute) =>
                    attribute.attribute.name + ": " + attribute.value
                )
                .join("; ")}
            </TableCell>
            <TableCell>{formatCurrency(Number(item?.variant?.price))}</TableCell>
            <TableCell>{Number(item?.quantity)}</TableCell>
            <TableCell>
              {formatCurrency(
                Number(item?.variant?.price) * Number(item?.quantity)
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
