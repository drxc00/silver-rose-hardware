import { RegistrationForm } from "@/components/forms/registration-form";
import { Card, CardContent } from "@/components/ui/card";
import { createNewUser, isAlreadyAuthenticated } from "@/lib/auth-functions";
import { UserRole } from "@/lib/constants";
import { registrationFormSchema } from "@/lib/form-schema";
import Image from "next/image";
import { z } from "zod";

export default async function RegisterPage() {
  await isAlreadyAuthenticated("/");
  const createCustomerUser = async (
    data: z.infer<typeof registrationFormSchema>
  ) => {
    "use server";
    try {
      await createNewUser(data, UserRole.CUSTOMER);
    } catch (error) {
      throw error;
    }
  };

  return (
    <main className="w-full h-vh max-w-4xl mx-auto py-20">
      <div className="flex flex-col gap-6">
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-sm text-muted-foreground">
                  Create your{" "}
                  <span className="font-bold text-primary">
                    Silver Rose Hardware
                  </span>{" "}
                  account
                </p>
              </div>
              <RegistrationForm
                submissionHandler={createCustomerUser}
                registrationType={UserRole.CUSTOMER}
              />
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <a href="/login" className="text-primary underline">
                    Login
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
