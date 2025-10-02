import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/config";
import { users, accounts, sessions, verification } from "../db/schema";
import { eq } from "drizzle-orm";
import { sendOTPEmail } from "./email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,        // Map to users table (Drizzle will handle the mapping)
      account: accounts,  // Map to account table
      session: sessions,  // Map to session table
      verification: verification, // Map to verification table
    },
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || process.env.NEXTAUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXTAUTH_URL!,
  trustedOrigins: [process.env.BETTER_AUTH_URL || process.env.NEXTAUTH_URL!],
  logger: {
    level: "debug",
  },
  // Disable automatic ID generation to prevent conflicts
  advanced: {
    generateId: false,
  },
});

export type Session = typeof auth.$Infer.Session;
