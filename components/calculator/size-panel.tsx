"use client";

import { useCalculatorDimensions } from "@/components/calculator/calculator-context";
import { Card } from "@/components/ui/card";
import { NumberInput } from "@/components/ui/number-input";

export function SizePanel() {
    const { width, height, square, perimeter, setWidth, setHeight } = useCalculatorDimensions();

    return (
        <Card className="sticky top-3 z-20 rounded-2xl bg-[var(--card)]/95 backdrop-blur">
            <div className="grid gap-4 md:grid-cols-4">
                <NumberInput id="width" label="Ширина" unit="мм" value={width} onChange={setWidth} />
                <NumberInput id="height" label="Высота" unit="мм" value={height} onChange={setHeight} />
                <NumberInput id="square" label="Площадь" unit="м²" value={square} step={0.001} readOnly />
                <NumberInput id="perimeter" label="Периметр" unit="мм" value={perimeter} step={0.001} readOnly />
            </div>
        </Card>
    );
}
