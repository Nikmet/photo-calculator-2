import { applyMinPrice, normalizeNumber } from "@/lib/math";

type BannerInput = {
  square: number;
  perimeter: number;
  b300MinPrice: number;
  b400MinPrice: number;
  b300: number;
  b400: number;
  luv: number;
  luversStep: number;
};

export function calculateBannerTotals(input: BannerInput) {
  const square = normalizeNumber(input.square);
  const perimeter = normalizeNumber(input.perimeter);
  const luversStep = input.luversStep > 0 ? input.luversStep : 1;
  const luversCount = perimeter / luversStep;

  const b300Base = normalizeNumber(input.b300) * square;
  const b400Base = normalizeNumber(input.b400) * square;
  const luversCost = luversCount * normalizeNumber(input.luv);

  return {
    luversCount,
    b300Total: applyMinPrice(b300Base, input.b300MinPrice),
    b400Total: applyMinPrice(b400Base, input.b400MinPrice),
    b300TotalLuvers: applyMinPrice(b300Base + luversCost, input.b300MinPrice),
    b400TotalLuvers: applyMinPrice(b400Base + luversCost, input.b400MinPrice),
  };
}
