import { PRICE_NAMES, type PriceName } from "@/lib/constants";
import type { MinPriceMap, PriceItemDto, PriceMap } from "@/lib/types";

export function createEmptyPriceMap(): PriceMap {
  return PRICE_NAMES.reduce((acc, name) => {
    acc[name] = 0;
    return acc;
  }, {} as PriceMap);
}

export function priceItemsToMap(items: PriceItemDto[]): PriceMap {
  const map = createEmptyPriceMap();
  for (const item of items) {
    map[item.name as PriceName] = item.value;
  }
  return map;
}

export function createEmptyMinPriceMap(): MinPriceMap {
  return PRICE_NAMES.reduce((acc, name) => {
    acc[name] = 100;
    return acc;
  }, {} as MinPriceMap);
}

export function priceItemsToMinMap(items: PriceItemDto[]): MinPriceMap {
  const map = createEmptyMinPriceMap();
  for (const item of items) {
    map[item.name as PriceName] = item.minValue;
  }
  return map;
}
