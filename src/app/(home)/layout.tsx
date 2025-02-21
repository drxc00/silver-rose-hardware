import { Footer } from "@/components/front/footer";
import { NavBar } from "@/components/front/nav-bar";
import authCache from "@/lib/auth-cache";
import { fetchUserQuotation } from "@/lib/data-fetch";
import { Session } from "next-auth";
import { QuotationWithRelations } from "../types";
import { QuotationProvider } from "@/components/providers/quotation-provider";



export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await authCache();
  const user = session?.user;
  const userQuotation = await fetchUserQuotation(user?.id as string);
  return (
    <main className="flex flex-col min-h-screen h-full justify-between">
      <QuotationProvider
        initialQuotation={
          (userQuotation as unknown as QuotationWithRelations) || null
        }
      >
        <NavBar session={session as Session} />
        <main className="flex-1">
        {children}
        </main>
        <Footer />
      </QuotationProvider>
    </main>
  );
}
