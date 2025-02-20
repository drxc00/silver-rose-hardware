"use client";

import { Button } from "@/components/ui/button";
import { useQuotation } from "@/components/providers/quotation-provider";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Minus, Plus, Printer, Trash2, History } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImageWithSkeleton } from "@/components/image-with-skeleton";
import { Input } from "@/components/ui/input";
import { QuotationItem } from "@prisma/client";
import {
  removeQuotationItem,
  updateQuotationQuantity,
} from "@/app/(server)/actions/quotation-mutations";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function QuotationTable() {
  const { quotation, removeToQuotation, updateQuantity } = useQuotation();
  const router = useRouter();
  const { toast } = useToast();

  const calculateSubtotal = () => {
    return quotation.quotation.QuotationItem.reduce(
      (acc, item) => acc + Number(item?.variant.price) * Number(item?.quantity),
      0
    );
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      removeToQuotation(itemId);
      await removeQuotationItem(itemId);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: `[${
          (error as Error).name
        }] Failed to remove item from quotation`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full border-t-0 border-b-0">
      <CardHeader className="bg-sidebar p-6 rounded border-t">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Products ({quotation.quotation.QuotationItem.length})
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <History />
              <span>History</span>
            </Button>
            <Button>
              <Printer />
              <span>Print Quotation</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Specifications</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotation.quotation.QuotationItem.map((item) => (
              <TableRow key={item?.id}>
                <TableCell>
                  <form action={() => handleRemoveItem(item?.id as string)}>
                    <Button>
                      <Trash2 />
                    </Button>
                  </form>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <ImageWithSkeleton
                      src={item?.variant.product.image || ""}
                      height={40}
                      width={40}
                      alt={item?.variant.product.name || ""}
                    />
                    <span className="text-md">
                      {item?.variant.product.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {item?.variant.attributes
                    .map(
                      (attribute) =>
                        attribute.attribute.name + ": " + attribute.value
                    )
                    .join("; ")}
                </TableCell>
                <TableCell>
                  ₱{Number(item?.variant.price).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <EditQuantityButton
                      type="decrement"
                      item={item as any}
                      updateQuantity={updateQuantity}
                    />
                    <Input
                      className="w-16"
                      value={Number(item?.quantity).toLocaleString()}
                      readOnly
                    />
                    <EditQuantityButton
                      type="increment"
                      item={item as any}
                      updateQuantity={updateQuantity}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-bold">
                  ₱
                  {(
                    Number(item?.variant.price) * Number(item?.quantity)
                  ).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-end bg-sidebar p-6 border-t rounded-b border-b">
        <div>
          <h1 className="font-bold text-3xl text-primary">
            <span className="text-muted-foreground">Total Cost:</span> ₱
            {calculateSubtotal().toLocaleString()}{" "}
          </h1>
        </div>
      </CardFooter>
    </Card>
  );
}

function EditQuantityButton({
  type,
  item,
  updateQuantity,
  className,
}: {
  type: "increment" | "decrement";
  item: QuotationItem;
  updateQuantity: any;
  className?: string;
}) {
  const router = useRouter();

  return (
    <form
      action={async () => {
        updateQuantity(item.id, type);
        await updateQuotationQuantity(
          item.id,
          type === "increment"
            ? Number(item.quantity) + 1
            : Number(item.quantity) - 1
        );
        router.refresh();
      }}
    >
      <Button type="submit" className={className}>
        {type === "increment" ? (
          <Plus className="h-4 w-4" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
