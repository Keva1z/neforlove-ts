import { sql } from 'drizzle-orm';
import db from '@/db'; // Путь к твоей конфигурации Drizzle

async function resetDatabase(): Promise<void> {
  try {
    // Отключение ограничений внешних ключей
    await db.execute(sql.raw('SET session_replication_role = replica;'));

    // Получение списка всех таблиц в публичной схеме
    const tablesResult = await db.execute(sql`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `);

    const tableNames = tablesResult.map((row: Record<string, unknown>) => row.tablename as string);

    // Удаление всех таблиц
    for (const table of tableNames) {
      await db.execute(sql.raw(`DROP TABLE IF EXISTS "${table}" CASCADE;`));
      console.log(`Таблица "${table}" удалена.`);
    }

    // Удаление схемы drizzle и таблицы __drizzle_migrations
    await db.execute(sql.raw('DROP SCHEMA IF EXISTS drizzle CASCADE;'));
    console.log('Схема "drizzle" и таблица "__drizzle_migrations" удалены.');

    // Включение ограничений внешних ключей
    await db.execute(sql.raw('SET session_replication_role = DEFAULT;'));

    console.log('База данных успешно очищена.');
  } catch (error) {
    console.error('Ошибка при очистке базы данных:', error);
  }
}

resetDatabase();
