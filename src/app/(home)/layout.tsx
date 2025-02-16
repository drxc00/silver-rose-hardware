import { Footer } from "@/components/front/footer";
import { NavBar } from "@/components/front/nav-bar";
import authCache from "@/lib/auth-cache";
import { fetchUserQuotation } from "@/lib/data-fetch";
import { Session } from "next-auth";
import { QuotationWithRelations } from "../types";
import { unstable_cache as cache } from "next/cache";

const fetchUserQuotationCache = cache(fetchUserQuotation, ["userQuotation"], {
  tags: ["userQuotation"],
});

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await authCache();
  const user = session?.user;
  const userQuotation = await fetchUserQuotationCache(user?.id as string);
  return (
    <main className="flex flex-col min-h-screen justify-between">
      <NavBar
        session={session as Session}
        userQuotation={userQuotation as any}
      />
      {children}
      <Footer />
    </main>
  );
}
