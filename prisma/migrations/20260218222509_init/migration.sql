-- CreateTable
CREATE TABLE "public"."PriceItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AppConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "minPrice" INTEGER NOT NULL DEFAULT 100,
    "luversStepDefault" INTEGER NOT NULL DEFAULT 500,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PriceItem_name_key" ON "public"."PriceItem"("name");
