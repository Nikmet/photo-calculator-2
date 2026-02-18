import { NextResponse } from "next/server";
import { PRICE_ORDER } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const items = await prisma.priceItem.findMany();
  const orderMap = new Map<string, number>(PRICE_ORDER.map((name, idx) => [name, idx]));

  const sorted = items.sort((a, b) => {
    const idxA = orderMap.get(a.name) ?? Number.MAX_SAFE_INTEGER;
    const idxB = orderMap.get(b.name) ?? Number.MAX_SAFE_INTEGER;
    return idxA - idxB;
  });

  return NextResponse.json(
    sorted.map((item) => ({
      id: item.id,
      name: item.name,
      label: item.label,
      value: item.value,
      minValue: item.minValue,
      updatedAt: item.updatedAt.toISOString(),
    })),
  );
}
