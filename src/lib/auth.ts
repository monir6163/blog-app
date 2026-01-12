import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { UserStatus } from "../../generated/prisma/enums";
import { prisma } from "./prisma";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  // Add all possible origins for web, mobile, and testing environments
  trustedOrigins: [process.env.CLIENT_URL || "http://localhost:3000"],

  // email verification
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log({ user, url, token });
    },
  },

  // extendable additionalfield user schema
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: UserStatus.ACTIVE,
      },
    },
  },
});
