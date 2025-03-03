import { Footer } from "@/components/front/footer";
import { NavBar } from "@/components/front/nav-bar";
import authCache from "@/lib/auth-cache";
import { fetchUserQuotation } from "@/lib/data-fetch";
import { Session } from "next-auth";
import { QuotationWithRelations } from "../types";
import { QuotationProvider } from "@/components/providers/quotation-provider";
import { unstable_cache as cache } from "next/cache";

const cachedFetchUserQuotation = cache(fetchUserQuotation, ["userQuotation"], {
  tags: ["userQuotation"],
});

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await authCache();
  const userQuotation = await cachedFetchUserQuotation(
    session?.user?.id as string
  );
  return (
    <main className="flex flex-col min-h-screen h-full justify-between">
      <QuotationProvider
        initialQuotation={
          (JSON.parse(
            JSON.stringify(userQuotation)
          ) as QuotationWithRelations) || null
        }
      >
        <NavBar session={session as Session} />
        <main className="flex-1" suppressHydrationWarning>
          {children}
        </main>
        <Footer />
      </QuotationProvider>
    </main>
  );
}
