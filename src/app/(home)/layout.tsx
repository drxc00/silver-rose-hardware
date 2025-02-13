import { Footer } from "@/components/front/footer";
import { NavBar } from "@/components/front/nav-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col h-screen justify-between">
      <NavBar />
      {children}
      <Footer />
    </main>
  );
}
