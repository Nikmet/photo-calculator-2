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
      <Card>
        <h2 className="text-2xl font-semibold tracking-tight">Калькулятор услуг фотосалона</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          Выберите нужный тип услуги и введите размеры в шапке. Все расчеты используют площадь в м² и
          общий минимум из настроек.
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {calculators.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)]/70 hover:shadow-[0_14px_30px_rgba(29,52,49,0.12)]">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{item.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
