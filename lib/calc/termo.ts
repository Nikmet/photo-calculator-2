import { applyMinPrice, normalizeNumber } from "@/lib/math";

export type TermoDifficulty = "easy" | "hard";

export const TERMO_MULTIPLIER: Record<TermoDifficulty, number> = {
  easy: 3,
  hard: 5,
};

type TermoInput = {
  square: number;
  tfMinPrice: number;
  tpMinPrice: number;
  difficulty: TermoDifficulty;
  tf: number;
  tp: number;
};

export function calculateTermoTotals(input: TermoInput) {
  const square = normalizeNumber(input.square);
  const mult = TERMO_MULTIPLIER[input.difficulty];

  return {
    tfTotal: applyMinPrice(normalizeNumber(input.tf) * square * mult, input.tfMinPrice),
    tpTotal: applyMinPrice(normalizeNumber(input.tp) * square * mult, input.tpMinPrice),
  };
}
