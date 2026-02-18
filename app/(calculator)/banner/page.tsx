"use client";

import { useMemo, useState } from "react";
import { useCalculatorDimensions } from "@/components/calculator/calculator-context";
import { Card } from "@/components/ui/card";
import { NumberInput } from "@/components/ui/number-input";
import { ResultItem } from "@/components/ui/result-item";
import { usePricingData } from "@/hooks/use-pricing-data";
import { calculateBannerTotals } from "@/lib/calc/banner";
import { normalizeNumber } from "@/lib/math";

export default function BannerPage() {
  const { square, perimeter } = useCalculatorDimensions();
  const { prices, minPrices, config, isLoading } = usePricingData();

  const [b300Override, setB300Override] = useState<number | null>(null);
  const [b400Override, setB400Override] = useState<number | null>(null);
  const [luvOverride, setLuvOverride] = useState<number | null>(null);
  const [luversStepOverride, setLuversStepOverride] = useState<number | null>(null);

  const b300 = b300Override ?? prices.b300;
  const b400 = b400Override ?? prices.b400;
  const luv = luvOverride ?? prices.luv;
  const luversStep = luversStepOverride ?? config.luversStepDefault;

  const totals = useMemo(
    () =>
      calculateBannerTotals({
        square,
        perimeter,
        b300MinPrice: minPrices.b300 || config.minPrice,
        b400MinPrice: minPrices.b400 || config.minPrice,
        b300: normalizeNumber(b300),
        b400: normalizeNumber(b400),
        luv: normalizeNumber(luv),
        luversStep: normalizeNumber(luversStep),
      }),
    [b300, b400, config.minPrice, luversStep, luv, minPrices.b300, minPrices.b400, perimeter, square],
  );

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="text-2xl font-semibold">Баннер</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Ввод цен локальный для текущего расчета. Минимальные пороги для итогов берутся из БД.
        </p>
        {isLoading ? <p className="mt-2 text-xs text-[var(--muted)]">Загрузка цен...</p> : null}
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="space-y-4 lg:col-span-2">
          <h3 className="text-base font-semibold">Ввод цен</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <NumberInput
              id="banner-b300"
              label="Б-300"
              unit="руб/м²"
              value={b300}
              onChange={(value) => setB300Override(value)}
            />
            <NumberInput
              id="banner-b400"
              label="Б-400"
              unit="руб/м²"
              value={b400}
              onChange={(value) => setB400Override(value)}
            />
            <NumberInput
              id="banner-luv"
              label="Люверсы"
              unit="руб/шт"
              value={luv}
              onChange={(value) => setLuvOverride(value)}
            />
            <NumberInput
              id="banner-luvers-step"
              label="Шаг люверсов"
              unit="мм"
              value={luversStep}
              onChange={(value) => setLuversStepOverride(value)}
            />
          </div>
          <p className="text-xs text-[var(--muted)]">
            Кол-во люверсов: <strong>{totals.luversCount.toFixed(2)}</strong> шт.
          </p>
        </Card>

        <Card className="space-y-3 bg-white">
          <h3 className="text-base font-semibold">Результат</h3>
          <ResultItem label="Б-300 без люверсов" value={totals.b300Total} />
          <ResultItem label="Б-400 без люверсов" value={totals.b400Total} />
          <ResultItem label="Б-300 с люверсами" value={totals.b300TotalLuvers} />
          <ResultItem label="Б-400 с люверсами" value={totals.b400TotalLuvers} />
        </Card>
      </div>
    </div>
  );
}
