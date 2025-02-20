import { Metadata } from "next";
import authCache from "@/lib/auth-cache";
import { UserRole } from "@/lib/constants";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin | Silver Rose Hardware",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
