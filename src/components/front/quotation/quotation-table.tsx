"use client";

import { Button } from "@/components/ui/button";
import { useQuotation } from "@/components/providers/quotation-provider";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
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
  const { toast } = useToast();

  const calculateSubtotal = () => {
    return quotation.quotation.QuotationItem.reduce(
      (acc, item) => acc + Number(item?.variant?.price) * Number(item?.quantity),
      0
    );
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      removeToQuotation(itemId);
      await removeQuotationItem(itemId);
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
    <Card className="w-full shadow-none rounded-sm">
      <CardHeader className="rounded">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Products ({quotation.quotation.QuotationItem.length})
          </h1>
        </div>
      </CardHeader>
      <CardContent className="py-2 overflow-x-auto">
        <div className="rounded-sm border shadow-none">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
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
                    <form
                      action={async () => {
                        await handleRemoveItem(item?.id as string);
                      }}
                    >
                      <Button className="rounded-sm" size="sm">
                        <Trash2 />
                      </Button>
                    </form>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <ImageWithSkeleton
                        src={item?.variant?.product.image || ""}
                        height={40}
                        width={40}
                        alt={item?.variant?.product.name || ""}
                      />
                      <span className="text-md">
                        {item?.variant?.product.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item?.variant?.attributes
                      .map(
                        (attribute) =>
                          attribute.attribute.name + ": " + attribute.value
                      )
                      .join("; ")}
                  </TableCell>
                  <TableCell>
                    ₱{Number(item?.variant?.price).toLocaleString()}
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
                      Number(item?.variant?.price) * Number(item?.quantity)
                    ).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end p-6 ">
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
      }}
    >
      <Button type="submit" size="sm" className={className + " rounded-sm"}>
        {type === "increment" ? (
          <Plus className="h-4 w-4" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
