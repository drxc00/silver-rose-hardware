"use client";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useQuotation } from "../providers/quotation-provider";
import { QuotationItemCard } from "./quotation-item-card-sheet";
import Link from "next/link";
import { SheetClose } from "../ui/sheet";
import { ShoppingBag } from "lucide-react";

export function UserQuotation() {
  const { quotation: optimisticQuotation } = useQuotation();
  const hasItems = optimisticQuotation.quotation.QuotationItem.length > 0;

  const calculateSubtotal = () => {
    return optimisticQuotation.quotation.QuotationItem.reduce(
      (acc, item) => acc + Number(item?.variant?.price) * Number(item?.quantity),
      0
    );
  };

  return (
    <div className="mt-6 flex h-[calc(100vh-200px)] flex-col">
      <div className="flex-1 overflow-y-auto pr-1">
        {hasItems ? (
          optimisticQuotation.quotation.QuotationItem.map((item) => (
            <QuotationItemCard key={item?.id} item={item as any} />
          ))
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-6">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="mb-1 text-lg font-semibold">
              Your quotation is empty
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              Add items to your quotation to receive a price estimate
            </p>
            <SheetClose asChild>
              <Link href="/products">
                <Button variant="outline" className="mb-2">
                  Browse Products
                </Button>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/quotation/history">
                <Button variant="outline" className="mb-2">
                  Quotation History
                </Button>
              </Link>
            </SheetClose>
          </div>
        )}
      </div>

      {hasItems && (
        <div className="mt-auto space-y-4">
          <Separator />
          <div className="pb-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-medium">
                ₱{calculateSubtotal().toLocaleString()}
              </span>
            </div>
          </div>
          <SheetClose asChild>
            <Link href="/quotation">
              <Button className="w-full">View Quotation</Button>
            </Link>
          </SheetClose>
        </div>
      )}
    </div>
  );
}
