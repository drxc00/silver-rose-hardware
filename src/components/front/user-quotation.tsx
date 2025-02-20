"use client";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useQuotation } from "../providers/quotation-provider";
import { QuotationItemCard } from "./quotation-item-card-sheet";
import Link from "next/link";

export function UserQuotation() {
  const { quotation: optimisticQuotation } = useQuotation();

  const calculateSubtotal = () => {
    return optimisticQuotation.quotation.QuotationItem.reduce(
      (acc, item) => acc + Number(item?.variant.price) * Number(item?.quantity),
      0
    );
  };

  return (
    <div className="mt-6 flex h-[calc(100vh-200px)] flex-col">
      <div className="flex-1 overflow-y-auto pr-1">
        {optimisticQuotation.quotation.QuotationItem.map((item) => (
          <QuotationItemCard key={item?.id} item={item as any} />
        ))}
      </div>

      <div className="mt-auto space-y-4">
        <Separator />
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-medium">
              ₱{calculateSubtotal().toLocaleString()}
            </span>
          </div>
        </div>
        <Link href="/quotation">
          <Button className="w-full">View Quotation</Button>
        </Link>
      </div>
    </div>
  );
}
