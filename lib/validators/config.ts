import { z } from "zod";

export const updateConfigSchema = z.object({
  minPrice: z.coerce.number().int().min(0),
  luversStepDefault: z.coerce.number().int().min(0),
});
