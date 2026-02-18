import { z } from "zod";

export const resetPricesSchema = z.object({
  confirmation: z.literal("reset data"),
});
