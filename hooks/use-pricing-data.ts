"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/toast-provider";
import { DEFAULT_APP_CONFIG } from "@/lib/constants";
import {
  createEmptyMinPriceMap,
  createEmptyPriceMap,
  priceItemsToMap,
  priceItemsToMinMap,
} from "@/lib/prices";
import type { AppConfigDto, MinPriceMap, PriceItemDto, PriceMap } from "@/lib/types";

type PricingDataState = {
  prices: PriceMap;
  minPrices: MinPriceMap;
  config: AppConfigDto;
  isLoading: boolean;
  error: string | null;
};

const initialConfig: AppConfigDto = {
  minPrice: DEFAULT_APP_CONFIG.minPrice,
  luversStepDefault: DEFAULT_APP_CONFIG.luversStepDefault,
  updatedAt: new Date(0).toISOString(),
};

export function usePricingData() {
  const { showError } = useToast();
  const [state, setState] = useState<PricingDataState>({
    prices: createEmptyPriceMap(),
    minPrices: createEmptyMinPriceMap(),
    config: initialConfig,
    isLoading: true,
    error: null,
  });

  const reload = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const [pricesResponse, configResponse] = await Promise.all([
        fetch("/api/prices", { cache: "no-store" }),
        fetch("/api/config", { cache: "no-store" }),
      ]);

      if (!pricesResponse.ok || !configResponse.ok) {
        throw new Error("Не удалось загрузить цены и настройки приложения.");
      }

      const [priceItems, config] = (await Promise.all([
        pricesResponse.json(),
        configResponse.json(),
      ])) as [PriceItemDto[], AppConfigDto];

      setState({
        prices: priceItemsToMap(priceItems),
        minPrices: priceItemsToMinMap(priceItems),
        config,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Произошла неизвестная ошибка загрузки.";

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      showError(message);
    }
  }, [showError]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { ...state, reload };
}
