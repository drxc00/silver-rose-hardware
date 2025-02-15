import { Footer } from "@/components/front/footer";
import { NavBar } from "@/components/front/nav-bar";
import authCache from "@/lib/auth-cache";
import { Session } from "next-auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await authCache();

  return (
    <main className="flex flex-col min-h-screen justify-between">
      <NavBar session={session as Session} />
      {children}
      <Footer />
    </main>
  );
}
