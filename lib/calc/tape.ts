import { applyMinPrice, normalizeNumber } from "@/lib/math";

export type LfpMaterial = "none" | "plastic" | "composite";

type TapeInput = {
  square: number;
  lfpMinPrice: number;
  pcMinPrice: number;
  lfp: number;
  pc: number;
  plastic: number;
  composite: number;
  mf: number;
  lfpMaterial: LfpMaterial;
  withPlastic2: boolean;
  withMF: boolean;
};

export function calculateTapeTotals(input: TapeInput) {
  const square = normalizeNumber(input.square);
  const lfpBase = square * normalizeNumber(input.lfp);
  const pcBase = square * normalizeNumber(input.pc);

  const lfpMaterialPrices: Record<LfpMaterial, number> = {
    none: 0,
    plastic: input.plastic,
    composite: input.composite,
  };
  const lfpExtra = square * normalizeNumber(lfpMaterialPrices[input.lfpMaterial]);
  const pcPlasticExtra = input.withPlastic2 ? square * normalizeNumber(input.plastic) : 0;
  const pcMfExtra = input.withMF ? square * normalizeNumber(input.mf) : 0;

  return {
    lfpTotal: applyMinPrice(lfpBase + lfpExtra, input.lfpMinPrice),
    pcTotal: applyMinPrice(pcBase + pcPlasticExtra + pcMfExtra, input.pcMinPrice),
  };
}
