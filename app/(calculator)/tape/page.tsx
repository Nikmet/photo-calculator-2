"use client";

import { useMemo, useState } from "react";
import { useCalculatorDimensions } from "@/components/calculator/calculator-context";
import { Card } from "@/components/ui/card";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { NumberInput } from "@/components/ui/number-input";
import { ResultItem } from "@/components/ui/result-item";
import { usePricingData } from "@/hooks/use-pricing-data";
import { calculateTapeTotals } from "@/lib/calc/tape";
import { normalizeNumber } from "@/lib/math";

export default function TapePage() {
  const { square } = useCalculatorDimensions();
  const { prices, minPrices, config, isLoading } = usePricingData();

  const [lfpOverride, setLfpOverride] = useState<number | null>(null);
  const [pcOverride, setPcOverride] = useState<number | null>(null);
  const [withPlastic, setWithPlastic] = useState(false);
  const [withPlastic2, setWithPlastic2] = useState(false);
  const [withMF, setWithMF] = useState(false);

  const lfp = lfpOverride ?? prices.lfp;
  const pc = pcOverride ?? prices.pc;

  const totals = useMemo(
    () =>
      calculateTapeTotals({
        square,
        lfpMinPrice: minPrices.lfp || config.minPrice,
        pcMinPrice: minPrices.pc || config.minPrice,
        lfp: normalizeNumber(lfp),
        pc: normalizeNumber(pc),
        plastic: prices.plastic,
        mf: prices.mf,
        withPlastic,
        withPlastic2,
        withMF,
      }),
    [
      config.minPrice,
      lfp,
      minPrices.lfp,
      minPrices.pc,
      pc,
      prices.mf,
      prices.plastic,
      square,
      withMF,
      withPlastic,
      withPlastic2,
    ],
  );

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="text-2xl font-semibold">Пленка ПВХ</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Доп. ставки из БД: пластик {prices.plastic} руб/м², монтажная пленка {prices.mf} руб/м².
        </p>
        {isLoading ? <p className="mt-2 text-xs text-[var(--muted)]">Загрузка цен...</p> : null}
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="space-y-4 lg:col-span-2">
          <h3 className="text-base font-semibold">Ввод цен</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-xl border border-[var(--border)] p-4">
              <NumberInput
                id="tape-lfp"
                label="Широкоформатная печать"
                unit="руб/м²"
                value={lfp}
                onChange={(value) => setLfpOverride(value)}
              />
              <CheckboxField
                id="tape-with-plastic"
                label="С пластиком"
                checked={withPlastic}
                onChange={setWithPlastic}
              />
            </div>

            <div className="space-y-3 rounded-xl border border-[var(--border)] p-4">
              <NumberInput
                id="tape-pc"
                label="Плоттерная резка"
                unit="руб/м²"
                value={pc}
                onChange={(value) => setPcOverride(value)}
              />
              <CheckboxField
                id="tape-with-mf"
                label="С монтажной пленкой"
                checked={withMF}
                onChange={setWithMF}
              />
              <CheckboxField
                id="tape-with-plastic2"
                label="С пластиком"
                checked={withPlastic2}
                onChange={setWithPlastic2}
              />
            </div>
          </div>
        </Card>

        <Card className="space-y-3 bg-white">
          <h3 className="text-base font-semibold">Результат</h3>
          <ResultItem label="Широкоформатная печать" value={totals.lfpTotal} />
          <ResultItem label="Плоттерная резка" value={totals.pcTotal} />
        </Card>
      </div>
    </div>
  );
}
