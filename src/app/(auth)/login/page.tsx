import { LoginForm } from "@/components/forms/login-form";
import { Card, CardContent } from "@/components/ui/card";
import { UserRole } from "@/lib/constants";
import Image from "next/image";
import { isAlreadyAuthenticated } from "@/lib/auth-functions";
import Link from "next/link";

export default async function LoginPage() {
  await isAlreadyAuthenticated("/");
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted p-6 md:p-10">
      <div className="flex w-full justify-center max-w-md flex-col">
        <div className="px-6">
          <div className="p-6 space-y-6">
            <div className="text-center flex flex-col mb-2">
              <Link href="/">
                <h1 className="text-3xl font-bold">
                  <span className="text-primary">Silver Rose</span> Hardware
                </h1>
              </Link>
              <p className="text-sm text-muted-foreground">
                Login to your Silver Rose Hardware account
              </p>
            </div>
            <LoginForm type={UserRole.CUSTOMER} />
          </div>
          <div className="mt-4">
            <p className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
