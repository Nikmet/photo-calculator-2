import { DEFAULT_APP_CONFIG } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export async function getOrCreateAppConfig() {
  return prisma.appConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      minPrice: DEFAULT_APP_CONFIG.minPrice,
      luversStepDefault: DEFAULT_APP_CONFIG.luversStepDefault,
    },
  });
}
