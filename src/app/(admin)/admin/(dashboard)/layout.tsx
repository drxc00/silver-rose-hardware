import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import authCache from "@/lib/auth-cache";
import { UserRole } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await authCache();
  if (!session) redirect("/admin/login");

  // Checking the role
  if (session?.user?.role !== UserRole.ADMIN) redirect("/");
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
}
