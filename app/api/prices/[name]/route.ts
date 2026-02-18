import { NextRequest, NextResponse } from "next/server";
import { ensureAdminToken } from "@/lib/admin-token";
import { PRICE_NAMES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { updatePriceSchema } from "@/lib/validators/price";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ name: string }>;
};

export async function PATCH(request: NextRequest, { params }: Params) {
  const authError = ensureAdminToken(request);
  if (authError) {
    return authError;
  }

  const parsedParams = await params;
  if (!PRICE_NAMES.includes(parsedParams.name as (typeof PRICE_NAMES)[number])) {
    return NextResponse.json({ message: "Неизвестная позиция цены." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsedBody = updatePriceSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { message: "Проверьте корректность полей value и minValue.", errors: parsedBody.error.flatten() },
      { status: 400 },
    );
  }

  const existing = await prisma.priceItem.findUnique({
    where: { name: parsedParams.name },
  });

  if (!existing) {
    return NextResponse.json({ message: "Позиция цены не найдена." }, { status: 404 });
  }

  const updated = await prisma.priceItem.update({
    where: { name: parsedParams.name },
    data: {
      ...(parsedBody.data.value !== undefined ? { value: parsedBody.data.value } : {}),
      ...(parsedBody.data.minValue !== undefined ? { minValue: parsedBody.data.minValue } : {}),
    },
  });

  return NextResponse.json({
    id: updated.id,
    name: updated.name,
    label: updated.label,
    value: updated.value,
    minValue: updated.minValue,
    updatedAt: updated.updatedAt.toISOString(),
  });
}
