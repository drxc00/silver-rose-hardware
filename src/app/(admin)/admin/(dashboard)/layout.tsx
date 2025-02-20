import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import authCache from "@/lib/auth-cache";
import { UserRole } from "@/lib/constants";
import { User } from "next-auth";
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
      <header className="sticky top-0 z-40 border-b bg-background w-screen block md:hidden">
        <div className="container flex h-16 items-center">
          <SidebarTrigger className="ml-2" />
        </div>
      </header>
      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
}
