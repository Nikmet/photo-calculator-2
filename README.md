# Photo Calculator 2

Переписанная версия калькулятора услуг фотосалона на:
- Next.js (App Router, TypeScript)
- Prisma
- Postgres
- Tailwind CSS

## Функциональность

- Калькуляторы:
  - `/banner`
  - `/tape`
  - `/cut`
  - `/termo`
- Общий блок размеров (ширина/высота -> площадь/периметр) в layout.
- Цены и настройки читаются из БД.
- Для каждой позиции цены есть свой минимальный порог (`minValue`).
- Админка:
  - `/admin/prices` - редактирование цен, минимальных порогов и reset к seed
  - `/admin/min-price` - `minPrice` и `luversStepDefault`
- Защита админских endpoints через `x-admin-token`.

## ENV

Создайте `.env` (можно скопировать из `.env.example`):

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require"
ADMIN_TOKEN="your-admin-token"
```

## Локальный запуск (bun)

```bash
bun install
bunx prisma migrate dev
bunx prisma db seed
bun run dev
```

Открыть: `http://localhost:3000`

## Деплой (готово для Vercel)

1. Добавьте переменные окружения в проект:
   - `DATABASE_URL`
   - `ADMIN_TOKEN`
2. Примените миграции в проде:

```bash
bun run prisma:migrate:deploy
```

3. Соберите проект:

```bash
bun run build
```

`postinstall` уже вызывает `prisma generate`, поэтому Prisma Client будет сгенерирован автоматически при установке зависимостей.

## Полезные команды

```bash
bun run lint
bun run build
bun run prisma:generate
bun run prisma:migrate
bun run prisma:seed
```

## API

- `GET /api/prices`
- `PATCH /api/prices/:name` (body: `{ value?, minValue? }`, требует `x-admin-token`)
- `POST /api/prices/reset` (body: `{ "confirmation": "reset data" }`, требует `x-admin-token`)
- `GET /api/config`
- `PATCH /api/config` (требует `x-admin-token`)
