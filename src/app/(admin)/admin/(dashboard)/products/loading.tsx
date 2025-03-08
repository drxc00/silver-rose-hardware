import { AdminHeader } from "@/components/admin/admin-header";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-muted w-vh">
      <AdminHeader currentPage="..." />
      <main className="h-[calc(100vh-4.5rem)] flex items-center justify-center mx-auto">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </main>
    </div>
  );
}
