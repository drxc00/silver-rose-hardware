import { RegistrationForm } from "@/components/forms/registration-form";
import { createNewUser, isAlreadyAuthenticated } from "@/lib/auth-functions";
import { UserRole } from "@/lib/constants";
import { registrationFormSchema } from "@/lib/form-schema";
import { z } from "zod";

export default async function RegisterPage() {
  await isAlreadyAuthenticated("/");

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted p-6 md:p-10">
      <div className="flex w-full justify-center max-w-lg flex-col">
        <div className="px-6">
          <div className="p-6 md:p-8">
            <div className="text-center py-4">
              <h1 className="text-3xl font-bold pb-2">
                <span className="text-primary">Silver Rose</span> Hardware
              </h1>
              <h2 className="text-xl font-bold">Register an account</h2>
              <p className="text-sm text-muted-foreground">
                Create your Silver Rose Hardware account
              </p>
            </div>
            <RegistrationForm
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
