"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function QuotationInformationSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="border-b-none">
        {/* Header Skeleton */}
        <CardHeader className="flex flex-row items-center justify-between bg-sidebar border-b">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-[200px] mb-2" />
            <Skeleton className="h-6 w-[150px]" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-5 w-[100px] mb-1" />
            <Skeleton className="h-5 w-[180px] mb-1" />
            <Skeleton className="h-5 w-[160px]" />
          </div>
        </CardHeader>

        <CardContent>
          {/* Customer Note Skeleton */}
          <div className="py-4 border-b">
            <Skeleton className="h-6 w-[120px] mb-2" />
            <Skeleton className="h-5 w-full" />
          </div>

          {/* Products Table Skeleton */}
          <div className="py-4">
            <Skeleton className="h-6 w-[100px] mb-2" />
            <Table className="border-b">
              <TableHeader className="bg-muted">
                <TableRow>
                  {[
                    "Product",
                    "Specifications",
                    "Unit Price",
                    "Quantity",
                    "Subtotal",
                  ].map((header) => (
                    <TableHead key={header}>
                      <Skeleton className="h-5 w-full" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3].map((row) => (
                  <TableRow key={row}>
                    {[1, 2, 3, 4, 5].map((cell) => (
                      <TableCell key={cell}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Additional Charges Skeleton */}
          <div className="py-6">
            <Skeleton className="h-6 w-[150px] mb-2" />
            <Table>
              <TableHeader>
                <TableRow>
                  {["Description", "Amount"].map((header) => (
                    <TableHead key={header}>
                      <Skeleton className="h-5 w-full" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2].map((row) => (
                  <TableRow key={row}>
                    {[1, 2].map((cell) => (
                      <TableCell key={cell}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {/* Footer Skeleton */}
        <CardFooter className="bg-sidebar border-t flex justify-end">
          <div className="w-full max-w-xs space-y-2 pt-4">
            {["Subtotal", "Add'l Charges", "Total"].map((label) => (
              <div key={label} className="flex justify-between">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-5 w-[80px]" />
              </div>
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
