import Link from "next/link";
import { Card } from "@/components/ui/card";

const calculators = [
  {
    href: "/banner",
    title: "Баннер",
    description: "Расчет стоимости Б-300 и Б-400, с люверсами и без.",
  },
  {
    href: "/tape",
    title: "Пленка ПВХ",
    description: "Широкоформатная печать и плоттерная резка с опциями материалов.",
  },
  {
    href: "/cut",
    title: "Лазерная резка",
    description: "Фанера и акрил с учетом сложности и гравировки.",
  },
  {
    href: "/termo",
    title: "Термотрансфер",
    description: "Термоткань и термопленка с множителем сложности.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          Рабочая область
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Калькулятор услуг фотосалона</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Выберите нужный тип услуги и введите размеры в шапке. Все расчеты используют площадь в м² и
          общий минимум из настроек.
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {calculators.map((item) => (
          <Link key={item.href} href={item.href} className="group block">
            <Card className="h-full p-5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-[var(--accent)] group-hover:shadow-[var(--shadow)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-sm font-semibold text-[var(--muted)] transition-colors group-hover:border-[var(--accent-soft)] group-hover:text-[var(--accent-strong)]"
                >
                  →
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
