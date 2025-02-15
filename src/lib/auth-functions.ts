import authCache from "@/lib/auth-cache";
import { UserRole } from "./constants";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function routeProtection(route: string) {
  const session = await authCache();
  if (!session) redirect(route);
}

export async function isAlreadyAuthenticated(redirectRoute: string) {
  const session = await authCache();
  if (session) redirect(redirectRoute);
}

export async function createNewUser(
  {
    name,
    username,
    email,
    password,
  }: {
    name: string;
    username: string;
    email: string;
    password: string;
  },
  role: UserRole
): Promise<void> {
  // This function is an abstract function that can be used to create any type of user
  // The role parameter is used to determine the role of the user
  const saltsRounds = 12; // Number of rounds to hash the password
  const hashedPassword = await bcrypt.hash(password, saltsRounds); // Hash the password
  // Check if the username or email is already taken
  const existingUsernamePromise = prisma.user.findUnique({
    where: { username: username },
  });
  const existingEmailPromise = prisma.user.findUnique({
    where: { email: email },
  });
  const [existingUsername, existingEmail] = await Promise.all([
    existingUsernamePromise,
    existingEmailPromise,
  ]);
  if (existingUsername) throw new Error("Username already exists.");
  if (existingEmail) throw new Error("Email already exists.");
  // Else Create the new user
  // Note that this create user function is specific to the credentials provider
  // It will create a new user in line with the schema provided by auth.js
  await prisma.user.create({
    data: {
      email: email,
      name: name,
      username: username,
      role: role,
      accounts: {
        create: {
          provider: "credentials",
          type: "credentials",
          password: hashedPassword,
          providerAccountId: "1",
        },
      },
    },
  });
}

export async function getUserRole(username: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { username: username },
    include: { accounts: true },
  });
  return user?.role as string;
}
