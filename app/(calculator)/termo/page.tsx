"use client";

import { useMemo, useState } from "react";
import { useCalculatorDimensions } from "@/components/calculator/calculator-context";
import { Card } from "@/components/ui/card";
import { NumberInput } from "@/components/ui/number-input";
import { ResultItem } from "@/components/ui/result-item";
import { SelectField } from "@/components/ui/select-field";
import { usePricingData } from "@/hooks/use-pricing-data";
import {
  type TermoDifficulty,
  TERMO_MULTIPLIER,
  calculateTermoTotals,
} from "@/lib/calc/termo";
import { normalizeNumber } from "@/lib/math";

const difficultyOptions: { value: TermoDifficulty; label: string }[] = [
  { value: "easy", label: "Легкий" },
  { value: "hard", label: "Сложный" },
];

export default function TermoPage() {
  const { square } = useCalculatorDimensions();
  const { prices, minPrices, config, isLoading } = usePricingData();

  const [difficulty, setDifficulty] = useState<TermoDifficulty>("easy");
  const [tfOverride, setTfOverride] = useState<number | null>(null);
  const [tpOverride, setTpOverride] = useState<number | null>(null);

  const tf = tfOverride ?? prices.tf;
  const tp = tpOverride ?? prices.tp;

  const totals = useMemo(
    () =>
      calculateTermoTotals({
        square,
        tfMinPrice: minPrices.tf || config.minPrice,
        tpMinPrice: minPrices.tp || config.minPrice,
        difficulty,
        tf: normalizeNumber(tf),
        tp: normalizeNumber(tp),
      }),
    [config.minPrice, difficulty, minPrices.tf, minPrices.tp, square, tf, tp],
  );

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="text-2xl font-semibold">Термотрансфер</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Множитель сложности: {TERMO_MULTIPLIER[difficulty]}x.
        </p>
        {isLoading ? <p className="mt-2 text-xs text-[var(--muted)]">Загрузка цен...</p> : null}
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="space-y-4 lg:col-span-2">
          <h3 className="text-base font-semibold">Ввод цен и опций</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <NumberInput
              id="termo-tf"
              label="Термоткань"
              unit="руб/м²"
              value={tf}
              onChange={(value) => setTfOverride(value)}
            />
            <NumberInput
              id="termo-tp"
              label="Термопленка"
              unit="руб/м²"
              value={tp}
              onChange={(value) => setTpOverride(value)}
            />
            <div className="md:col-span-2">
              <SelectField
                id="termo-difficulty"
                label="Уровень сложности"
                value={difficulty}
                options={difficultyOptions}
                onChange={(value) => setDifficulty(value as TermoDifficulty)}
              />
            </div>
          </div>
        </Card>

        <Card className="space-y-3 bg-white">
          <h3 className="text-base font-semibold">Результат</h3>
          <ResultItem label="Термоткань" value={totals.tfTotal} />
          <ResultItem label="Термопленка" value={totals.tpTotal} />
        </Card>
      </div>
    </div>
  );
}
