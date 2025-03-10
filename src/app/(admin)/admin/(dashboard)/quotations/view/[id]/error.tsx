"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function QuotationViewError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-muted w-vh">
      <AdminHeader
        currentPage="View Quotation"
        crumbItems={[{ name: "Quotations", href: "/admin/quotations" }]}
      />
      <section className="p-4 mx-auto flex flex-col gap-4 h-full">
        <Card className="w-full mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Quotation View Error</CardTitle>
            <CardDescription>
              An Error Occured while loading the quotation. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-row items-center gap-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => reset()} variant="default">
              Reset
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
