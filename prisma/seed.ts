import { PrismaClient } from "@prisma/client";
import { DEFAULT_APP_CONFIG, INITIAL_PRICE_ITEMS } from "../lib/constants";

const prisma = new PrismaClient();

async function main() {
  for (const item of INITIAL_PRICE_ITEMS) {
    await prisma.priceItem.upsert({
      where: { name: item.name },
      update: { label: item.label, value: item.value, minValue: item.minValue },
      create: {
        name: item.name,
        label: item.label,
        value: item.value,
        minValue: item.minValue,
      },
    });
  }

  await prisma.appConfig.upsert({
    where: { id: 1 },
    update: {
      minPrice: DEFAULT_APP_CONFIG.minPrice,
      luversStepDefault: DEFAULT_APP_CONFIG.luversStepDefault,
    },
    create: {
      id: 1,
      minPrice: DEFAULT_APP_CONFIG.minPrice,
      luversStepDefault: DEFAULT_APP_CONFIG.luversStepDefault,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
