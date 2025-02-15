"use server";

import { signIn, signOut } from "@/lib/auth";
import { createNewUser, getUserRole } from "@/lib/auth-functions";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/constants";
import authCache from "@/lib/auth-cache";

export async function clientLogout(redirectTo: string) {
  // Validate first if a session exists
  // This protects the server action from being called when the user is not logged in
  const session = await authCache();
  if (!session) throw new Error("You are not logged in.");
  await signOut({ redirectTo: redirectTo });
}

export async function clientLogin(
  {
    username,
    password,
  }: {
    username: string;
    password: string;
  },
  type: UserRole
): Promise<void> {
  // First we check if the clientLogin method is called from the admin login page or the customer login page
  // Here we get the role of the user
  // If the resource being accessed is admin and the user is not an admin, throw an error
  const userRole = await getUserRole(username);
  if (type === UserRole.ADMIN && userRole !== UserRole.ADMIN)
    throw new Error("You are not an admin user.");
  // Initialize the Auth SignIn function
  await signIn("credentials", {
    username: username,
    password: password,
    redirectTo: type === UserRole.ADMIN ? "/admin" : "/",
  });
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
    throw new Error("Failed to create admin user");
  }
}
