import { AdminHeader } from "@/components/admin/admin-header";
import authCache from "@/lib/auth-cache";
import { UserRole } from "@/lib/constants";
import Link from "next/link";
import { redirect } from "next/navigation";
export default async function AdminPage() {
  // Check if there is a user logged in
  const session = await authCache();
  if (!session) redirect("/admin/login");

  // Check if the user is an admin
  if (session?.user?.role !== UserRole.ADMIN) redirect("/");

  return (
    <div className="min-h-screen bg-muted w-vh">
      <AdminHeader currentPage="Home" />
      <main className="p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <div></div>
      </main>
    </div>
  );
}
