import { QuotationRequestForm } from "@/components/front/quotation/quotation-request-form";
import { QuotationSummaryTable } from "@/components/front/quotation/quotation-summary-table";
import { Card, CardContent } from "@/components/ui/card";
import authCache from "@/lib/auth-cache";
import { User } from "next-auth";

export default async function QuotationRequestPage() {
  const session = await authCache();

  return (
    <div className="min-h-screen bg-muted w-full">
      <main className="px-32 py-8 flex flex-col gap-6">
        <div className="flex text-center justify-center items-center">
          <h1 className="text-3xl font-bold text-center">Quotation Request</h1>
        </div>
        <div>
          <QuotationRequestForm user={session?.user as User} />
        </div>
      </main>
    </div>
  );
}
