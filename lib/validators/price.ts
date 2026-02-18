import { z } from "zod";

export const updatePriceSchema = z
  .object({
    value: z.coerce.number().int().min(0).optional(),
    minValue: z.coerce.number().int().min(0).optional(),
  })
  .refine((data) => data.value !== undefined || data.minValue !== undefined, {
    message: "Нужно передать минимум одно поле для обновления.",
  });
