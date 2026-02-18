import type { PriceName } from "@/lib/constants";

export type PriceItemDto = {
  id: string;
  name: PriceName;
  label: string;
  value: number;
  minValue: number;
  updatedAt: string;
};

export type AppConfigDto = {
  minPrice: number;
  luversStepDefault: number;
  updatedAt: string;
};

export type PriceMap = Record<PriceName, number>;
export type MinPriceMap = Record<PriceName, number>;
