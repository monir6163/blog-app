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
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: "prisma blog <info@nexalogictech.com>",
          to: user.email,
          subject: "Email Verify",
          html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Oxygen, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif;
      }
      .container {
        width: 100%;
        padding: 30px 0;
      }
      .card {
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        overflow: hidden;
      }
      .header {
        background: #0f172a;
        color: #ffffff;
        padding: 20px 30px;
        font-size: 20px;
        font-weight: 600;
      }
      .content {
        padding: 30px;
        color: #334155;
        font-size: 15px;
        line-height: 1.6;
      }
      .btn-wrapper {
        text-align: center;
        margin: 30px 0;
      }
      .btn {
        background-color: #2563eb;
        color: #ffffff !important;
        text-decoration: none;
        padding: 12px 28px;
        border-radius: 6px;
        font-size: 15px;
        font-weight: 600;
        display: inline-block;
      }
      .btn:hover {
        background-color: #1d4ed8;
      }
      .footer {
        padding: 20px 30px;
        background: #f8fafc;
        font-size: 12px;
        color: #64748b;
        text-align: center;
      }
      .link {
        word-break: break-all;
        color: #2563eb;
        font-size: 13px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="header">Verify your email</div>

        <div class="content">
          <p>Hi <strong>${user.name}</strong>,</p>

          <p>
            Thanks for signing up! Please confirm your email address by clicking
            the button below. This helps us make sure your account is secure.
          </p>

          <div class="btn-wrapper">
            <a href="${verificationUrl}" class="btn">
              Verify Email Address
            </a>
          </div>

          <p>
            If the button doesn’t work, copy and paste the following link into
            your browser:
          </p>

          <p class="link">${verificationUrl}</p>

          <p>
            This verification link will expire soon. If you didn’t create an
            account, you can safely ignore this email.
          </p>

          <p>
            Regards,<br />
            <strong>NexaLogic Tech Team</strong>
          </p>
        </div>

        <div class="footer">
          © ${new Date()
            .getFullYear()
            .toString()} NexaLogic Tech. All rights reserved.<br />
          You’re receiving this email because you created an account.
        </div>
      </div>
    </div>
  </body>
</html>
`,
        });
        console.log(`${info.messageId}`);
      } catch (error) {
        console.log("email send faield", error);
        throw error;
      }
    },
  },

  // social providers
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
