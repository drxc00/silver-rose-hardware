import { LoginForm } from "@/components/forms/login-form";
import { Card, CardContent } from "@/components/ui/card";
import { UserRole } from "@/lib/constants";
import Image from "next/image";
import { isAlreadyAuthenticated } from "@/lib/auth-functions";

export default async function LoginPage() {
  await isAlreadyAuthenticated("/");
  return (
    <main className="w-full h-vh max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8">
              <div className="text-center flex flex-col mb-2">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-sm text-muted-foreground">
                  Login to your{" "}
                  <span className="font-bold text-primary">
                    Silver Rose Hardware
                  </span>{" "}
                  account
                </p>
              </div>
              <LoginForm type={UserRole.CUSTOMER} />
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <a href="/register" className="text-primary underline">
                    Register
                  </a>
                </p>
              </div>
            </div>
            <div className="relative hidden bg-muted md:block">
              <Image
                src="/auth_image.jpg"
                fill
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </main>
  );
}
