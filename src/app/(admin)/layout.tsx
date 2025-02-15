import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Silver Rose Hardware",
};


export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
