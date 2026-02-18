import { applyMinPrice, normalizeNumber } from "@/lib/math";

export type CutDifficulty = "easy" | "medium" | "hard";

export const CUT_MULTIPLIER: Record<CutDifficulty, number> = {
  easy: 3,
  medium: 5,
  hard: 7,
};

type CutInput = {
  square: number;
  plywoodMinPrice: number;
  acrylicMinPrice: number;
  difficulty: CutDifficulty;
  plywood: number;
  acrylic: number;
  env: number;
  withEngraving: boolean;
};

export function calculateCutTotals(input: CutInput) {
  const square = normalizeNumber(input.square);
  const mult = CUT_MULTIPLIER[input.difficulty];
  const plywoodBase = square * normalizeNumber(input.plywood) * mult;
  const acrylicBase = square * normalizeNumber(input.acrylic) * mult;
  const engraving = input.withEngraving ? normalizeNumber(input.env) : 0;

  return {
    plywoodTotal: applyMinPrice(plywoodBase, input.plywoodMinPrice),
    acrylicTotal: applyMinPrice(acrylicBase + engraving, input.acrylicMinPrice),
  };
}
