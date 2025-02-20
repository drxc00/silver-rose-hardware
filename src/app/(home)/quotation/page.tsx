import { QuotationTable } from "@/components/front/quotation/quotation-table";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export function generateMetadata(): Metadata {
  return {
    title: "My Quotation | Silver Rose Hardware",
  };
}

export default async function QuotationPage() {
  return (
    <div className="min-h-screen bg-muted w-full">
      <main className="px-32 pt-8 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Quotation</h1>
        </div>
        <div>
          <QuotationTable />
        </div>
        <div className="flex justify-end">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold">Need a Custom Quote?</h2>
            <Link href="/quotation/request">
              <Button size="lg">Send a Quotation Request</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
