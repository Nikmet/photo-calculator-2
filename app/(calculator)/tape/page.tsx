"use client";

import { useMemo, useState } from "react";
import { CalculatorLoading } from "@/components/calculator/calculator-loading";
import { useCalculatorDimensions } from "@/components/calculator/calculator-context";
import { Card } from "@/components/ui/card";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { NumberInput } from "@/components/ui/number-input";
import { ResultItem } from "@/components/ui/result-item";
import { SelectField } from "@/components/ui/select-field";
import { usePricingData } from "@/hooks/use-pricing-data";
import { calculateTapeTotals } from "@/lib/calc/tape";
import type { LfpMaterial } from "@/lib/calc/tape";
import { normalizeNumber } from "@/lib/math";

const LFP_MATERIAL_OPTIONS = [
  { value: "none", label: "Без доп. материала" },
  { value: "plastic", label: "С пластиком" },
  { value: "composite", label: "С композитом" },
];

export default function TapePage() {
  const { square } = useCalculatorDimensions();
  const { prices, minPrices, config, isLoading } = usePricingData();

  const [lfpOverride, setLfpOverride] = useState<number | null>(null);
  const [pcOverride, setPcOverride] = useState<number | null>(null);
  const [lfpMaterial, setLfpMaterial] = useState<LfpMaterial>("none");
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
        composite: prices.composite,
        mf: prices.mf,
        lfpMaterial,
        withPlastic2,
        withMF,
      }),
    [
      config.minPrice,
      lfp,
      minPrices.lfp,
      minPrices.pc,
      pc,
      prices.composite,
      prices.mf,
      prices.plastic,
      square,
      withMF,
      lfpMaterial,
      withPlastic2,
    ],
  );

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="text-2xl font-semibold">Пленка ПВХ</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Доп. ставки из БД: пластик {prices.plastic} руб/м², композит {prices.composite} руб/м²,
          монтажная пленка {prices.mf} руб/м².
        </p>
      </Card>

      {isLoading ? (
        <CalculatorLoading inputRows={2} resultRows={2} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold">Ввод цен</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
                <NumberInput
                  id="tape-lfp"
                  label="Широкоформатная печать"
                  unit="руб/м²"
                  value={lfp}
                  onChange={(value) => setLfpOverride(value)}
                />
                <SelectField
                  id="tape-lfp-material"
                  label="Материал"
                  value={lfpMaterial}
                  options={LFP_MATERIAL_OPTIONS}
                  onChange={(value) => setLfpMaterial(value as LfpMaterial)}
                  hint="Ставка материала добавляется к цене печати за м²."
                />
              </div>

              <div className="grid gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
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

          <Card className="space-y-3">
            <h3 className="text-base font-semibold">Результат</h3>
            <ResultItem label="Широкоформатная печать" value={totals.lfpTotal} />
            <ResultItem label="Плоттерная резка" value={totals.pcTotal} />
          </Card>
        </div>
      )}
    </div>
  );
}
