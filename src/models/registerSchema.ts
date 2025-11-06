import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, { message: "Full name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    roomNo: z.string().length(3, { message: "Room number must be 3 digits" }),
    phoneNo: z
      .string()
      .length(10, { message: "Phone number must be 10 digits" }),
    terms: z.boolean({ message: "You must accept the terms and conditions" }),
  })
  .refine((data) => data.terms, {
    path: ["terms"],
    message: "You must accept the terms and conditions",
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
