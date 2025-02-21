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
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted p-6 md:p-10">
      <div className="flex w-full justify-center max-w-lg flex-col">
        <div className="px-6">
          <div className="p-6 md:p-8">
            <div className="text-center py-4">
              <h1 className="text-2xl font-bold">Register an account</h1>
              <p className="text-sm text-muted-foreground">
                Create your Silver Rose Hardware account
              </p>
            </div>
            <RegistrationForm
              submissionHandler={createCustomerUser}
              registrationType={UserRole.CUSTOMER}
            />
            <div className="mt-4">
              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <a href="/login" className="text-primary underline">
                  Login
                </a>
              </p>
            </div>
          </div>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
