
import Logo from "../../../../../public/logo.png";
import Image from "next/image";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center justify-center">
                                <Image src={Logo} alt="Logo" height={250} width={250} />
                            </div>
                        </div>
                        <LoginForm type="ADMIN" />
                    </div>
                </div>
            </div>
        </div>
    )
}