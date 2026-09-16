import type { SQLiteDatabase } from 'expo-sqlite';

import { migrate } from './migrate';

export async function initializeDatabase(database: SQLiteDatabase): Promise<void> {
  await database.execAsync('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
  await migrate(database);
}
