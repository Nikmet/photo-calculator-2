"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminToken } from "@/components/admin/admin-token-context";
import { Card } from "@/components/ui/card";
import { NumberInput } from "@/components/ui/number-input";
import { useToast } from "@/components/ui/toast-provider";
import { normalizeInteger } from "@/lib/math";
import type { AppConfigDto } from "@/lib/types";

export default function AdminMinPricePage() {
  const { token } = useAdminToken();
  const { showError, showSuccess } = useToast();
  const [minPrice, setMinPrice] = useState(100);
  const [luversStepDefault, setLuversStepDefault] = useState(500);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadConfig = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/config", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Не удалось загрузить настройки.");
      }

      const config = (await response.json()) as AppConfigDto;
      setMinPrice(config.minPrice);
      setLuversStepDefault(config.luversStepDefault);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Ошибка загрузки настроек.");
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    void loadConfig();
  }, [loadConfig]);

  async function saveConfig() {
    if (!token.trim()) {
      showError("Введите ADMIN_TOKEN в шапке админки.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/config", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({
          minPrice: normalizeInteger(minPrice),
          luversStepDefault: normalizeInteger(luversStepDefault),
        }),
      });

      const responseBody = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(responseBody.message ?? "Не удалось сохранить настройки.");
      }

      showSuccess("Базовые настройки успешно сохранены.");
      await loadConfig();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Ошибка сохранения настроек.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="text-xl font-semibold">Базовые настройки</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Глобальный минимум используется как резервный, если для позиции нет индивидуального порога.
        </p>
      </Card>

      <Card className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-[var(--muted)]">Загрузка...</p>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <NumberInput
                id="admin-min-price"
                label="Глобальный минимум"
                unit="руб"
                value={minPrice}
                onChange={setMinPrice}
              />
              <NumberInput
                id="admin-luvers-step"
                label="Шаг люверсов по умолчанию"
                unit="мм"
                value={luversStepDefault}
                onChange={setLuversStepDefault}
              />
            </div>
            <button
              type="button"
              onClick={() => void saveConfig()}
              disabled={isSaving}
              className="h-11 rounded-xl border border-[var(--accent)] bg-[var(--accent)] px-4 text-sm font-medium text-white transition-all duration-300 hover:opacity-90 disabled:opacity-60"
            >
              {isSaving ? "Сохранение..." : "Сохранить настройки"}
            </button>
          </>
        )}
      </Card>
    </div>
  );
}
