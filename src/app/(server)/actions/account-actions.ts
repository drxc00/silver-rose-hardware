"use server";

import { accountFormSchema } from "@/lib/form-schema";
import authCache from "@/lib/auth-cache";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";

export const updateAccountDetails = actionClient
  .schema(accountFormSchema)
  .action(
    async ({ parsedInput: { name, username, email, password, userId } }) => {
      try {
        // Check first if there the user is logged in
        // and check if the role is admin
        const session = await authCache();
        if (!session) {
          return {
            success: false,
            message: "You are not logged in.",
          };
        }

        // Perform mutation
        //Check if the password is not empty
        if (password !== "") {
          const saltsRounds = 12; // Number of rounds to hash the password
          const hashedPassword = await bcrypt.hash(password, saltsRounds); // Hash the password

          // Perfrom an atomic transaction
          await prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
              where: { id: userId },
              data: {
                name: name,
                username: username,
                email: email,
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
            where: { id: userId },
            data: {
              name: name,
              username: username,
              email: email,
            },
          });
        }
        // Success
        return {
          success: true,
          message: "Account details updated successfully",
        };
      } catch (error) {
        return {
          success: false,
          message:
            "Failed to update account details: " + (error as Error).message,
        };
      }
    }
  );