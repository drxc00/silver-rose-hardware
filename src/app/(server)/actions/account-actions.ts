"use server";

import { z } from "zod";
import { accountFormSchema } from "@/lib/form-schema";
import authCache from "@/lib/auth-cache";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function updateAccountDetails(
  payload: z.infer<typeof accountFormSchema>
) {
  // Check first if there the user is logged in
  // and check if the role is admin
  const session = await authCache();
  if (!session) throw new Error("You are not logged in.");

  // Parse the payload to match the schema
  const parsedPayload = accountFormSchema.safeParse(payload);
  if (!parsedPayload) throw new Error("Invalid Request Payload");

  // Perform mutation
  //Check if the password is not empty
  if (payload.password !== "") {
    const saltsRounds = 12; // Number of rounds to hash the password
    const hashedPassword = await bcrypt.hash(payload.password, saltsRounds); // Hash the password

    // Perfrom an atomic transaction
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: payload.userId },
        data: {
          name: payload.name,
          username: payload.username,
          email: payload.email,
        },
        include: {
          accounts: true,
        },
      });

      // Update the account credentials
      await tx.account.update({
        where: {
          id: user.accounts[0].id,
        },
        data: {
          password: hashedPassword,
        },
      });
    });
  } else {
    await prisma.user.update({
      where: { id: payload.userId },
      data: {
        name: payload.name,
        username: payload.username,
        email: payload.email,
      },
    });
  }
}
