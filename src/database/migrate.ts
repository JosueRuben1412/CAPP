import type { SQLiteDatabase } from 'expo-sqlite';

import { migrations } from './migrations';

export async function migrate(database: SQLiteDatabase): Promise<void> {
  const row = await database.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  if (!row) throw new Error('No se pudo leer la versión del esquema.');

  const latestVersion = migrations[migrations.length - 1]?.version ?? 0;
  if (row.user_version > latestVersion) {
    throw new Error('La base de datos pertenece a una versión más reciente de CORONAPP.');
  }

  let currentVersion = row.user_version;
  for (const migration of migrations) {
    if (migration.version <= currentVersion) continue;
    if (!Number.isSafeInteger(migration.version) || migration.version !== currentVersion + 1) {
      throw new Error('La secuencia de migraciones no es válida.');
    }

    // El provider todavía no expone la conexión: no hay consultas de la UI concurrentes.
    // Usamos la misma conexión para conservar foreign_keys durante la transacción.
    await database.withTransactionAsync(async () => {
      await database.execAsync(migration.sql);
      await database.execAsync(`PRAGMA user_version = ${migration.version}`);
    });
    currentVersion = migration.version;
  }
}
