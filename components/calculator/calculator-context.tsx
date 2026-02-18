"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { calculatePerimeter, calculateSquare, normalizeNumber } from "@/lib/math";

type CalculatorContextValue = {
  width: number;
  height: number;
  square: number;
  perimeter: number;
  setWidth: (value: number) => void;
  setHeight: (value: number) => void;
};

const CalculatorContext = createContext<CalculatorContextValue | null>(null);

export function CalculatorProvider({ children }: PropsWithChildren) {
  const [width, setWidthState] = useState(0);
  const [height, setHeightState] = useState(0);

  const square = useMemo(() => calculateSquare(width, height), [width, height]);
  const perimeter = useMemo(() => calculatePerimeter(width, height), [width, height]);

  const value = useMemo<CalculatorContextValue>(
    () => ({
      width,
      height,
      square,
      perimeter,
      setWidth: (nextWidth) => setWidthState(normalizeNumber(nextWidth)),
      setHeight: (nextHeight) => setHeightState(normalizeNumber(nextHeight)),
    }),
    [height, perimeter, square, width],
  );

  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>;
}

export function useCalculatorDimensions() {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error("useCalculatorDimensions must be used within CalculatorProvider");
  }
  return context;
}
