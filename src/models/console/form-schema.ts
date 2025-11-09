import * as z from "zod";

export const menuformSchema = z.object({
  image: z.instanceof(File).optional(),
  description: z.string({ error: "This field is required" }),
  day: z.enum([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]),
  mealTime: z.enum(["Breakfast", "Lunch", "Snacks", "Dinner"]),
  type: z.enum(["Veg", "Non-veg", "Jain"]),
  price: z.number({ error: "This field is required" }),
});
