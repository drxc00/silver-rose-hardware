"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useState } from "react";

export function AdditionalChargesTable({ form }: { form: any }) {
  const [charges, setCharges] = useState<
    { description: string; amount: number }[]
  >([]);
  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <h1 className="font-semibold">Additional Charges</h1>
        <Button variant="outline">
          <Plus />
          <span>Add Charge</span>
        </Button>
      </div>
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {charges.map((charge, index) => (
            <TableRow key={index}>
              <TableCell>{charge.description}</TableCell>
              <TableCell>{charge.amount}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
          {charges.length === 0 && (
            <TableRow>
              <TableCell colSpan={3}>No additional charges</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
