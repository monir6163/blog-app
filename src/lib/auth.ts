import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { UserStatus } from "../../generated/prisma/enums";
import { transporter } from "./mailService";
import { prisma } from "./prisma";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  // Add all possible origins for web, mobile, and testing environments
  trustedOrigins: [process.env.CLIENT_URL || "http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  // email verification
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const info = await transporter.sendMail({
        from: "prisma blog <info@nexalogictech.com>",
        to: user.email,
        subject: "Email Verify",
        html: `<b>Hello World</b>`,
      });
      console.log(`${info.messageId}`);
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
