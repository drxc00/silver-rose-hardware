import { QuotationRequestForm } from "@/components/front/quotation/quotation-request-form";
import authCache from "@/lib/auth-cache";
import { User } from "next-auth";

export default async function QuotationRequestPage() {
  const session = await authCache();

  return (
    <div className="w-full">
      <main className="px-32 py-8 flex flex-col gap-6">
        <div>
          <QuotationRequestForm user={session?.user as User} />
        </div>
      </main>
    </div>
  );
}
