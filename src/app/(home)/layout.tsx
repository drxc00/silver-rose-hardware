import { Footer } from "@/components/front/footer";
import { NavBar } from "@/components/front/nav-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}
