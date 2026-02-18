export function normalizeNumber(value: unknown): number {
  const num = Number(value);
  if (!Number.isFinite(num) || Number.isNaN(num)) {
    return 0;
  }

  return num < 0 ? 0 : num;
}

export function normalizeInteger(value: unknown): number {
  return Math.floor(normalizeNumber(value));
}

export function calculateSquare(width: number, height: number): number {
  const w = normalizeNumber(width);
  const h = normalizeNumber(height);
  return Number(((w * h) / 1_000_000).toFixed(3));
}

export function calculatePerimeter(width: number, height: number): number {
  const w = normalizeNumber(width);
  const h = normalizeNumber(height);
  return Number(((w + h) * 2).toFixed(3));
}

export function applyMinPrice(value: number, minPrice: number): number {
  const rounded = Math.floor(normalizeNumber(value));
  return Math.max(normalizeInteger(minPrice), rounded);
}
