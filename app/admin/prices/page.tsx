"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminToken } from "@/components/admin/admin-token-context";
import { Card } from "@/components/ui/card";
import { NumberInput } from "@/components/ui/number-input";
import { useToast } from "@/components/ui/toast-provider";
import { PRICE_UNIT_BY_NAME } from "@/lib/constants";
import { normalizeInteger } from "@/lib/math";
import type { PriceItemDto } from "@/lib/types";

type DraftValues = Record<string, number>;

export default function AdminPricesPage() {
  const { token } = useAdminToken();
  const { showError, showSuccess } = useToast();
  const [items, setItems] = useState<PriceItemDto[]>([]);
  const [draftValues, setDraftValues] = useState<DraftValues>({});
  const [draftMinValues, setDraftMinValues] = useState<DraftValues>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [savingName, setSavingName] = useState<string | null>(null);
  const [resetConfirmation, setResetConfirmation] = useState("");

  const loadPrices = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/prices", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Не удалось загрузить цены.");
      }

      const data = (await response.json()) as PriceItemDto[];
      setItems(data);
      setDraftValues(
        data.reduce((acc, item) => {
          acc[item.name] = item.value;
          return acc;
        }, {} as DraftValues),
      );
      setDraftMinValues(
        data.reduce((acc, item) => {
          acc[item.name] = item.minValue;
          return acc;
        }, {} as DraftValues),
      );
    } catch (error) {
      showError(error instanceof Error ? error.message : "Ошибка загрузки цен.");
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    void loadPrices();
  }, [loadPrices]);

  const canEdit = useMemo(() => token.trim().length > 0, [token]);

  async function savePrice(name: string) {
    if (!canEdit) {
      showError("Введите ADMIN_TOKEN в шапке админки.");
      return;
    }

    setSavingName(name);

    try {
      const response = await fetch(`/api/prices/${name}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({
          value: normalizeInteger(draftValues[name]),
          minValue: normalizeInteger(draftMinValues[name]),
        }),
      });

      const responseBody = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(responseBody.message ?? "Не удалось сохранить позицию.");
      }

      setItems((prev) =>
        prev.map((item) =>
          item.name === name
            ? {
                ...item,
                value: normalizeInteger(draftValues[name]),
                minValue: normalizeInteger(draftMinValues[name]),
              }
            : item,
        ),
      );
      showSuccess(`Позиция "${name}" успешно сохранена.`);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Ошибка сохранения позиции.");
    } finally {
      setSavingName(null);
    }
  }

  async function resetPrices() {
    if (!canEdit) {
      showError("Введите ADMIN_TOKEN в шапке админки.");
      return;
    }

    setIsResetLoading(true);

    try {
      const response = await fetch("/api/prices/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ confirmation: resetConfirmation }),
      });

      const responseBody = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(responseBody.message ?? "Не удалось сбросить цены.");
      }

      setResetConfirmation("");
      showSuccess("Все цены и минимальные пороги сброшены к начальному состоянию.");
      await loadPrices();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Ошибка сброса цен.");
    } finally {
      setIsResetLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="text-xl font-semibold">Управление ценами</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Для каждой позиции редактируются цена и минимальная цена итоговой стоимости.
        </p>
      </Card>

      <Card>
        <h3 className="text-base font-semibold">Список позиций</h3>
        {isLoading ? (
          <p className="mt-3 text-sm text-[var(--muted)]">Загрузка...</p>
        ) : (
          <div className="mt-4 grid gap-4">
            {items.map((item) => (
              <div
                key={item.name}
                className="grid gap-3 rounded-xl border border-[var(--border)] bg-white p-4 md:grid-cols-[1fr_170px_170px_130px]"
              >
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {item.name} · {PRICE_UNIT_BY_NAME[item.name]}
                  </p>
                </div>
                <NumberInput
                  id={`price-${item.name}`}
                  label="Цена"
                  unit={PRICE_UNIT_BY_NAME[item.name]}
                  value={draftValues[item.name] ?? 0}
                  onChange={(value) =>
                    setDraftValues((prev) => ({
                      ...prev,
                      [item.name]: value,
                    }))
                  }
                />
                <NumberInput
                  id={`min-price-${item.name}`}
                  label="Минимальная цена"
                  unit="руб"
                  value={draftMinValues[item.name] ?? 0}
                  onChange={(value) =>
                    setDraftMinValues((prev) => ({
                      ...prev,
                      [item.name]: value,
                    }))
                  }
                />
                <button
                  type="button"
                  onClick={() => void savePrice(item.name)}
                  disabled={savingName === item.name}
                  className="h-11 self-end rounded-xl border border-[var(--accent)] bg-[var(--accent)] px-4 text-sm font-medium text-white transition-all duration-300 hover:opacity-90 disabled:opacity-60"
                >
                  {savingName === item.name ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="space-y-3 border-red-200">
        <h3 className="text-base font-semibold">Сброс цен</h3>
        <p className="text-sm text-[var(--muted)]">
          Введите <code>reset data</code> и нажмите кнопку.
        </p>
        <input
          type="text"
          value={resetConfirmation}
          onChange={(event) => setResetConfirmation(event.target.value)}
          className="h-11 w-full max-w-sm rounded-xl border border-[var(--border)] bg-white px-3 text-sm outline-none transition-all duration-300 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] mr-2"
          placeholder="reset data"
        />
        <button
          type="button"
          onClick={() => void resetPrices()}
          disabled={isResetLoading}
          className="h-11 rounded-xl border border-red-500 px-4 text-sm font-medium text-red-600 transition-all duration-300 hover:bg-red-50 disabled:opacity-60"
        >
          {isResetLoading ? "Сброс..." : "Сбросить цены"}
        </button>
      </Card>
    </div>
  );
}
