
import { RegistrationForm } from "@/components/forms/registration-form";
import Logo from "../../../../../public/logo.png";
import Image from "next/image";
import { createFirstAdminUser } from "@/app/(server)/actions/auth-actions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { registrationFormSchema } from "@/lib/form-schema";
import { z } from "zod";
import { UserRole } from "@/lib/constants";
import { isAlreadyAuthenticated } from "@/lib/auth-functions";

export default async function CreateFirstUserPage() {
    await isAlreadyAuthenticated("/");
    // We first check if there are no existing admin users
    const adminUser = await prisma.user.findFirst({
        where: { role: UserRole.ADMIN },
    });

    if (adminUser) redirect('/admin/login');

    const handleCreateUser = async (data: z.infer<typeof registrationFormSchema>) => {
        "use server";
        await createFirstAdminUser(data);
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center justify-center rounded-md">
                                <Image src={Logo} alt="Logo" height={150} width={150} />
                            </div>
                            <div className="flex items-center justify-center rounded-md">
                                <h1 className="text-xl font-bold"> Create First User  </h1>
                            </div>
                        </div>
                        <RegistrationForm submissionHandler={handleCreateUser} registrationType={UserRole.ADMIN} />
                    </div>
                </div>
            </div>
        </div>
    )
}