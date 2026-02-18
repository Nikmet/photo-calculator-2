import { NextRequest, NextResponse } from "next/server";
import { ensureAdminToken } from "@/lib/admin-token";
import { getOrCreateAppConfig } from "@/lib/config";
import { prisma } from "@/lib/prisma";
import { updateConfigSchema } from "@/lib/validators/config";

export const runtime = "nodejs";

export async function GET() {
  const config = await getOrCreateAppConfig();
  return NextResponse.json({
    minPrice: config.minPrice,
    luversStepDefault: config.luversStepDefault,
    updatedAt: config.updatedAt.toISOString(),
  });
}

export async function PATCH(request: NextRequest) {
  const authError = ensureAdminToken(request);
  if (authError) {
    return authError;
  }

  const body = await request.json().catch(() => null);
  const parsedBody = updateConfigSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { message: "Проверьте значения minPrice и luversStepDefault.", errors: parsedBody.error.flatten() },
      { status: 400 },
    );
  }

  const updated = await prisma.appConfig.upsert({
    where: { id: 1 },
    update: {
      minPrice: parsedBody.data.minPrice,
      luversStepDefault: parsedBody.data.luversStepDefault,
    },
    create: {
      id: 1,
      minPrice: parsedBody.data.minPrice,
      luversStepDefault: parsedBody.data.luversStepDefault,
    },
  });

  return NextResponse.json({
    minPrice: updated.minPrice,
    luversStepDefault: updated.luversStepDefault,
    updatedAt: updated.updatedAt.toISOString(),
  });
}
