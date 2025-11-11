import { z } from "zod";

export const issueformSchema = z.object({
  userId: z.string({ error: "This field is required" }),
  title: z.string({ error: "This field is required" }),
  description: z.string({ error: "This field is required" }),
  image: z.string().optional(),
  validUntil: z.date().optional(),
});
