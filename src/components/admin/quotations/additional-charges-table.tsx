"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { QuotationItemWithRelations } from "@/app/types";
import { useRouter } from "next/navigation";
import {
  addAdditionalQuotationCharge,
  removeAdditionalQuotationCharge,
} from "@/app/(server)/actions/quotation-mutations";

export function AdditionalChargesTable({
  quotationRequest,
  readOnly = false,
}: {
  quotationRequest: QuotationItemWithRelations;
  readOnly?: boolean;
}) {
  const [chargeName, setChargeName] = useState("");
  const [chargePrice, setChargePrice] = useState(0);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <h1 className="font-semibold">Additional Charges</h1>
        {!readOnly && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                <span>Add charge</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Additional Charges</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Add Custom Charge</h4>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Label htmlFor="custom-name" className="sr-only">
                        Name
                      </Label>
                      <Input
                        id="custom-name"
                        value={chargeName}
                        onChange={(e) => setChargeName(e.target.value)}
                        placeholder="Charge name"
                      />
                    </div>
                    <div className="w-24">
                      <Label htmlFor="custom-price" className="sr-only">
                        Price
                      </Label>
                      <Input
                        id="custom-price"
                        placeholder="Price"
                        value={chargePrice}
                        onChange={(e) => setChargePrice(Number(e.target.value))}
                        type="number"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <form
                  action={async () => {
                    startTransition(async () => {
                      await addAdditionalQuotationCharge({
                        payload: {
                          name: chargeName,
                          amount: chargePrice,
                          quotationId: quotationRequest.quotation.id,
                        },
                      });
                    });
                    router.refresh();
                  }}
                >
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Add charge"
                    )}
                  </Button>
                </form>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <Table className="border-b">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotationRequest.quotation.AdditionalCharge &&
            quotationRequest.quotation.AdditionalCharge.map((charge, index) => (
              <TableRow key={index}>
                <TableCell>{charge.name}</TableCell>
                <TableCell>{Number(charge.amount)}</TableCell>
                <TableCell>
                  {!readOnly && (
                    <form
                      action={async () => {
                        startTransition(async () => {
                          await removeAdditionalQuotationCharge(
                            charge.id,
                            quotationRequest.id
                          );
                        });
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        type="submit"
                        disabled={isPending}
                      >
                        <Trash2 />
                      </Button>
                    </form>
                  )}
                </TableCell>
              </TableRow>
            ))}
          {quotationRequest.quotation.AdditionalCharge.length === 0 && (
            <TableRow>
              <TableCell colSpan={3}>No additional charges</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
