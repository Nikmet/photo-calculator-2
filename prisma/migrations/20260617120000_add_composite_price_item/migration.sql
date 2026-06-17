INSERT INTO "public"."PriceItem" ("id", "name", "label", "value", "minValue", "updatedAt")
SELECT 'price-composite', 'composite', 'Композит', 0, 100, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM "public"."PriceItem" WHERE "name" = 'composite'
);
