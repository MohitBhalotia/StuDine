import * as z from "zod";

export const orderformSchema = z.object({
  userId: z.string({ error: "This field is required" }),
  menuId: z.string({ error: "This field is required" }),
  quantity: z.number({ error: "This field is required" }),
  specialRequest: z.string().optional(),
  status: z.enum(["Pending", "Confirmed", "Delivered", "Cancelled"]),
  paymentStatus: z.enum(["Paid", "Unpaid", "Refunded"]),
  paymentMethod: z.enum(["Cash", "Card", "Online"]),
  totalAmount: z.number({ error: "This field is required" }),
});
