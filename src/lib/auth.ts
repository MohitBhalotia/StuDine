import { db } from "@/config/db";
import { betterAuth } from "better-auth";
import { sendEmail } from "@/utils/sendEmail";
import bcrypt from "bcrypt";
export const auth = betterAuth({
  database: db,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    password: {
      hash: async (password) => {
        return await bcrypt.hash(password, 10);
      },
      verify: async ({ hash, password }) => {
        return await bcrypt.compare(password, hash);
      },
    },
    async sendResetPassword({ user, url }) {
      await sendEmail(user.email, "Reset your password", url, "resetPassword");
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      await sendEmail(user.email, "Verify your email", url, "verifyEmail");
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
        defaultValue: "student",
      },
      roomNo: {
        type: "string",
        input: true,
        required: true,
        validation: {
          required: true,
          pattern: {
            value: /^[0-9]{3}$/,
            message: "Room number must be 3 digits",
          },
        },
      },
      phoneNo: {
        type: "string",
        input: true,
        required: true,
        validation: {
          required: true,
          pattern: {
            value: /^[0-9]{10}$/,
            message: "Phone number must be 10 digits",
          },
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
