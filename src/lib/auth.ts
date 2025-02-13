import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";

class InvalidLoginError extends CredentialsSignin {
    // Custom Error Messages for auth
    code = "Invalid username or password";
    constructor() {
        super("Invalid credentials");
        // Clean up the stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidLoginError);

        }
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma) as any, // Type assertation due to authJs bug
    providers: [
        Credentials({
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                },
                password: {
                    label: "Password",
                    type: "password",
                }
            },
            async authorize(credentials) {
                try {
                    // Fetch the user based on the username
                    const user = await prisma.user.findUnique({
                        where: { username: credentials?.username as string },
                        include: { accounts: true }
                    });
                    // Throw and error if the user/account is not found
                    if (!user || !user.accounts[0]) throw new InvalidLoginError();
                    // Validate the password from the credentials to the account
                    const isValid = await bcrypt.compare(
                        credentials?.password as string,
                        // NOTE: This assumes that the user has only one account type
                        // If in the future, the system will implement multiple account providers [i.e different from credentials]
                        // Make Sure to change this approach. This is solely for credentials provider
                        user.accounts[0].password as string
                    );
                    // Throw and error if the password is not valid
                    if (!isValid) throw new InvalidLoginError();
                    // Finally return the user
                    return user;
                } catch (error) {
                    if (error instanceof InvalidLoginError) throw error;
                    throw new Error("Authentication failed. Something went wrong.");
                }
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user }) {
            // Add role to the token when user signs in
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }) {
            // Add role to the session from the token
            if (session.user) {
                session.user.role = token.role as string;
            }
            return session;
        }
    },
    logger: {
        // Clean the logs
        error(error) {
            console.error("Authentication failed: Invalid credentials:", error.name);
        },
        warn(code) {
            console.warn("Auth warning:", code);
        },
        debug(code, metadata) {
            // Only log debug in development
            if (process.env.NODE_ENV === "development") {
                console.debug("Auth debug:", code, metadata);
            }
        }
    },
})