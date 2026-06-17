"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminToken } from "@/components/admin/admin-token-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NumberInput } from "@/components/ui/number-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast-provider";
import { PRICE_UNIT_BY_NAME } from "@/lib/constants";
import { normalizeInteger } from "@/lib/math";
import { emitPricingSync } from "@/lib/pricing-sync";
import type { PriceItemDto } from "@/lib/types";

type DraftValues = Record<string, number>;

function PriceItemsSkeleton() {
  return (
    <div className="mt-4 grid gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`price-skeleton-${index}`}
          className="grid gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 md:grid-cols-[1fr_170px_170px_130px]"
        >
          <div className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-full self-end" />
          <Skeleton className="h-10 w-full self-end" />
          <Skeleton className="h-10 w-full self-end" />
        </div>
      ))}
    </div>
  );
}

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
      emitPricingSync();
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
      emitPricingSync();
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
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Для каждой позиции редактируются цена и минимальная цена итоговой стоимости.
        </p>
      </Card>

      <Card>
        <h3 className="text-base font-semibold">Список позиций</h3>
        {isLoading ? (
          <PriceItemsSkeleton />
        ) : (
          <div className="mt-4 grid gap-4">
            {items.map((item) => (
              <div
                key={item.name}
                className="grid gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 md:grid-cols-[1fr_170px_170px_130px]"
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
                <Button
                  type="button"
                  onClick={() => void savePrice(item.name)}
                  disabled={savingName === item.name}
                  className="self-end"
                >
                  {savingName === item.name ? "Сохранение..." : "Сохранить"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="space-y-3 border-[var(--danger)]/30 bg-[var(--danger-soft)]/45">
        <h3 className="text-base font-semibold">Сброс цен</h3>
        <p className="text-sm leading-6 text-[var(--muted)]">
          Введите <code>reset data</code> и нажмите кнопку.
        </p>
        <input
          type="text"
          value={resetConfirmation}
          onChange={(event) => setResetConfirmation(event.target.value)}
          className="mr-2 h-10 w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--control)] px-3 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
          placeholder="reset data"
        />
        <Button
          type="button"
          onClick={() => void resetPrices()}
          disabled={isResetLoading}
          variant="danger"
          className="w-fit"
        >
          {isResetLoading ? "Сброс..." : "Сбросить цены"}
        </Button>
      </Card>
    </div>
  );
}
