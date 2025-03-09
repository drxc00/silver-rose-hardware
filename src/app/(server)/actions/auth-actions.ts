"use server";

import { signOut } from "@/lib/auth";
import { createNewUser } from "@/lib/auth-functions";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/constants";
import authCache from "@/lib/auth-cache";
import { revalidateTag } from "next/cache";

export async function clientLogout(redirectTo: string) {
  // Validate first if a session exists
  // This protects the server action from being called when the user is not logged in
  const session = await authCache();
  if (!session) throw new Error("You are not logged in.");
  await signOut({ redirectTo: redirectTo });

  // For any revalidation iguess
  revalidateTag("userQuotation");
}

export async function createFirstAdminUser({
  name,
  username,
  email,
  password,
}: {
  name: string;
  username: string;
  email: string;
  password: string;
}): Promise<void> {
  // Check first if there are no existing admin users
  // This make sure that this server-action is only available if there are no existing admin user
  const adminUser = await prisma.user.findFirst({
    where: { role: UserRole.ADMIN },
  });
  // If there are existing admin users, throw an error
  if (adminUser)
    throw new Error(
      "An Admin user already exists. Please login and create a new user."
    );
  try {
    await createNewUser({ name, username, email, password }, UserRole.ADMIN);
  } catch (error) {
    throw new Error("Failed to create admin user: " + (error as Error).name);
  }
}
