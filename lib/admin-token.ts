import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function ensureAdminToken(request: NextRequest): NextResponse | null {
  const configuredToken = process.env.ADMIN_TOKEN;

  if (!configuredToken) {
    return NextResponse.json(
      { message: "На сервере не настроен ADMIN_TOKEN." },
      { status: 500 },
    );
  }

  const token = request.headers.get("x-admin-token");
  if (!token || token !== configuredToken) {
    return NextResponse.json({ message: "Неверный токен администратора." }, { status: 401 });
  }

  return null;
}
