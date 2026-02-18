const rubFormatter = new Intl.NumberFormat("ru-RU");

export function formatRub(value: number): string {
  return `${rubFormatter.format(Math.floor(value))}`;
}
