import authCache from "@/lib/auth-cache"
import { UserRole } from "@/lib/constants";
import { redirect } from "next/navigation";
export default async function AdminPage() {
    // Check if there is a user logged in
    const session = await authCache();
    if (!session) redirect('/admin/login');

    // Check if the user is an admin
    if (session?.user?.role !== UserRole.ADMIN) redirect('/');

    return (
        <div className="flex flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-xl font-bold">Admin Panel</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}   