"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/toast-provider";
import { DEFAULT_APP_CONFIG } from "@/lib/constants";
import { subscribePricingSync } from "@/lib/pricing-sync";
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

type ReloadOptions = {
  silent?: boolean;
};

const initialConfig: AppConfigDto = {
  minPrice: DEFAULT_APP_CONFIG.minPrice,
  luversStepDefault: DEFAULT_APP_CONFIG.luversStepDefault,
  updatedAt: new Date(0).toISOString(),
};

export function usePricingData() {
  const { showError } = useToast();
  const isReloadingRef = useRef(false);
  const [state, setState] = useState<PricingDataState>({
    prices: createEmptyPriceMap(),
    minPrices: createEmptyMinPriceMap(),
    config: initialConfig,
    isLoading: true,
    error: null,
  });

  const reload = useCallback(
    async (options?: ReloadOptions) => {
      if (isReloadingRef.current) {
        return;
      }

      isReloadingRef.current = true;
      const silent = options?.silent ?? false;

      if (!silent) {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
      }

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

        if (!silent) {
          showError(message);
        }
      } finally {
        isReloadingRef.current = false;
      }
    },
    [showError],
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    const refreshSilently = () => {
      void reload({ silent: true });
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshSilently();
      }
    };

    window.addEventListener("focus", refreshSilently);
    window.addEventListener("online", refreshSilently);
    document.addEventListener("visibilitychange", onVisibilityChange);

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        refreshSilently();
      }
    }, 30_000);

    const unsubscribePricingSync = subscribePricingSync(refreshSilently);

    return () => {
      window.removeEventListener("focus", refreshSilently);
      window.removeEventListener("online", refreshSilently);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.clearInterval(intervalId);
      unsubscribePricingSync();
    };
  }, [reload]);

  return { ...state, reload };
}
