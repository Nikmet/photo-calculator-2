import { NextRequest, NextResponse } from "next/server";
import { ensureAdminToken } from "@/lib/admin-token";
import { INITIAL_PRICE_ITEMS, PRICE_ORDER } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { resetPricesSchema } from "@/lib/validators/reset";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const authError = ensureAdminToken(request);
  if (authError) {
    return authError;
  }

  const body = await request.json().catch(() => null);
  const parsedBody = resetPricesSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { message: "Для сброса введите подтверждение: reset data.", errors: parsedBody.error.flatten() },
      { status: 400 },
    );
  }

  await prisma.$transaction(async (tx) => {
    for (const item of INITIAL_PRICE_ITEMS) {
      await tx.priceItem.upsert({
        where: { name: item.name },
        update: {
          label: item.label,
          value: item.value,
          minValue: item.minValue,
        },
        create: {
          name: item.name,
          label: item.label,
          value: item.value,
          minValue: item.minValue,
        },
      });
    }

    await tx.priceItem.deleteMany({
      where: {
        name: {
          notIn: PRICE_ORDER,
        },
      },
    });
  });

  return NextResponse.json({ ok: true, count: INITIAL_PRICE_ITEMS.length });
}
