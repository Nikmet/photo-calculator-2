export const PRICE_NAMES = [
  "b300",
  "b400",
  "luv",
  "lfp",
  "plastic",
  "pc",
  "mf",
  "plywood",
  "acrylic",
  "tf",
  "tp",
  "env",
] as const;

export type PriceName = (typeof PRICE_NAMES)[number];
export type PriceUnit = "руб/м²" | "руб/шт" | "руб";

export type SeedPriceItem = {
  name: PriceName;
  label: string;
  value: number;
  minValue: number;
};

export const INITIAL_PRICE_ITEMS: SeedPriceItem[] = [
  { name: "b300", value: 0, minValue: 100, label: "Б-300" },
  { name: "b400", value: 0, minValue: 100, label: "Б-400" },
  { name: "luv", value: 0, minValue: 100, label: "Люверсы" },
  { name: "lfp", value: 0, minValue: 100, label: "Широкоформатная печать" },
  { name: "plastic", value: 0, minValue: 100, label: "Пластик" },
  { name: "pc", value: 0, minValue: 100, label: "Плоттерная резка" },
  { name: "mf", value: 0, minValue: 100, label: "Монтажная пленка" },
  { name: "plywood", value: 0, minValue: 100, label: "Фанера" },
  { name: "acrylic", value: 0, minValue: 100, label: "Акрил" },
  { name: "tf", value: 0, minValue: 100, label: "Термоткань" },
  { name: "tp", value: 0, minValue: 100, label: "Термопленка" },
  { name: "env", value: 0, minValue: 100, label: "Гравировка" },
];

export const PRICE_ORDER = INITIAL_PRICE_ITEMS.map((item) => item.name);

export const PRICE_UNIT_BY_NAME: Record<PriceName, PriceUnit> = {
  b300: "руб/м²",
  b400: "руб/м²",
  luv: "руб/шт",
  lfp: "руб/м²",
  plastic: "руб/м²",
  pc: "руб/м²",
  mf: "руб/м²",
  plywood: "руб/м²",
  acrylic: "руб/м²",
  tf: "руб/м²",
  tp: "руб/м²",
  env: "руб",
};

export const DEFAULT_APP_CONFIG = {
  minPrice: 100,
  luversStepDefault: 500,
};
