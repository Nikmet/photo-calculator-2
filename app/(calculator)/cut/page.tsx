"use client";

import { useMemo, useState } from "react";
import { useCalculatorDimensions } from "@/components/calculator/calculator-context";
import { Card } from "@/components/ui/card";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { NumberInput } from "@/components/ui/number-input";
import { ResultItem } from "@/components/ui/result-item";
import { SelectField } from "@/components/ui/select-field";
import { usePricingData } from "@/hooks/use-pricing-data";
import { type CutDifficulty, CUT_MULTIPLIER, calculateCutTotals } from "@/lib/calc/cut";
import { normalizeNumber } from "@/lib/math";

const difficultyOptions: { value: CutDifficulty; label: string }[] = [
  { value: "easy", label: "Легкий" },
  { value: "medium", label: "Средний" },
  { value: "hard", label: "Сложный" },
];

export default function CutPage() {
  const { square } = useCalculatorDimensions();
  const { prices, minPrices, config, isLoading } = usePricingData();

  const [difficulty, setDifficulty] = useState<CutDifficulty>("easy");
  const [plywoodOverride, setPlywoodOverride] = useState<number | null>(null);
  const [acrylicOverride, setAcrylicOverride] = useState<number | null>(null);
  const [withEngraving, setWithEngraving] = useState(false);

  const plywood = plywoodOverride ?? prices.plywood;
  const acrylic = acrylicOverride ?? prices.acrylic;

  const totals = useMemo(
    () =>
      calculateCutTotals({
        square,
        plywoodMinPrice: minPrices.plywood || config.minPrice,
        acrylicMinPrice: minPrices.acrylic || config.minPrice,
        difficulty,
        plywood: normalizeNumber(plywood),
        acrylic: normalizeNumber(acrylic),
        env: prices.env,
        withEngraving,
      }),
    [
      acrylic,
      config.minPrice,
      difficulty,
      minPrices.acrylic,
      minPrices.plywood,
      plywood,
      prices.env,
      square,
      withEngraving,
    ],
  );

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="text-2xl font-semibold">Лазерная резка</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Множитель сложности: {CUT_MULTIPLIER[difficulty]}x. Гравировка добавляет фикс {prices.env} руб.
        </p>
        {isLoading ? <p className="mt-2 text-xs text-[var(--muted)]">Загрузка цен...</p> : null}
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="space-y-4 lg:col-span-2">
          <h3 className="text-base font-semibold">Ввод цен и опций</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <NumberInput
              id="cut-plywood"
              label="Фанера"
              unit="руб/м²"
              value={plywood}
              onChange={(value) => setPlywoodOverride(value)}
            />
            <div className="space-y-3">
              <NumberInput
                id="cut-acrylic"
                label="Акрил"
                unit="руб/м²"
                value={acrylic}
                onChange={(value) => setAcrylicOverride(value)}
              />
              <CheckboxField
                id="cut-engraving"
                label="С гравировкой"
                checked={withEngraving}
                onChange={setWithEngraving}
              />
            </div>
            <div className="md:col-span-2">
              <SelectField
                id="cut-difficulty"
                label="Уровень сложности"
                value={difficulty}
                options={difficultyOptions}
                onChange={(value) => setDifficulty(value as CutDifficulty)}
              />
            </div>
          </div>
        </Card>

        <Card className="space-y-3 bg-white">
          <h3 className="text-base font-semibold">Результат</h3>
          <ResultItem label="Фанера" value={totals.plywoodTotal} />
          <ResultItem label="Акрил" value={totals.acrylicTotal} />
        </Card>
      </div>
    </div>
  );
}
