
# Как работать с Drizzle ORM

### Студия

Студия для управления базой из браузера
```bash
npx drizzle-kit studio
```

## Только загрузили проект?
Если вы только загрузили проект, тогда вам нужно применить уже созданные миграции

```bash
npx drizzle-kit migrate
```

### Миграции

После того как закончите менять/добавлять схему
создайте миграцию:
```bash
npx drizzle-kit generate
```

Далее примените миграцию:
```bash
npx drizzle-kit migrate
```

### Сброс базы для тестов

Полностью удаляет Enums, Tables, и схему миграций drizzle
```bash
npm run dev:reset-db
```

после этого можете написать
```bash
npx drizzle-kit migrate
```
