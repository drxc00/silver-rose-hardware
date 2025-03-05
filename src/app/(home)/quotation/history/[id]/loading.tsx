import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function QuotationRecordSkeleton() {
  return (
    <main className="mx-auto py-10 px-8 md:px-12 lg:px-32">
      <div className="flex justify-between w-full items-center pb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gray-200 animate-pulse h-10 w-64 mb-2"></h1>
          <h2 className="bg-gray-200 animate-pulse h-6 w-48"></h2>
        </div>
        <Button variant="outline" disabled className="rounded-sm">
          <Printer className="h-4 w-4 mr-2" />
          <span>Print Quotation</span>
        </Button>
      </div>

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
                {[1, 2, 3].map((row) => (
                  <TableRow key={row}>
                    <TableCell>
                      <div className="bg-muted animate-pulse h-6 w-36"></div>
                    </TableCell>
                    <TableCell>
                      <div className="bg-muted animate-pulse h-6 w-48"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="bg-muted animate-pulse h-6 w-24 ml-auto"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="bg-muted animate-pulse h-6 w-12 ml-auto"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="bg-muted animate-pulse h-6 w-24 ml-auto"></div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <div className="bg-muted animate-pulse h-6 w-24"></div>
              <div className="bg-muted animate-pulse h-6 w-24"></div>
            </div>
            {[1, 2].map((charge) => (
              <div key={charge} className="flex justify-between">
                <div className="bg-muted animate-pulse h-6 w-32"></div>
                <div className="bg-muted animate-pulse h-6 w-24"></div>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-2">
              <div className="bg-muted animate-pulse h-6 w-24"></div>
              <div className="bg-muted animate-pulse h-6 w-32"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
