import type { SQLiteBindValue, SQLiteDatabase } from 'expo-sqlite';

import { repositoryOperation } from './errors';

// Column names come exclusively from repository-owned constant lists. Values are always bound.
export async function updateRow(
  db: SQLiteDatabase, table: string, idColumn: string, id: string,
  fields: readonly (readonly [string, SQLiteBindValue | undefined])[],
  updatedAt: string,
): Promise<boolean> {
  return repositoryOperation(`${table}.update`, async () => {
    const supplied = fields.filter((field): field is readonly [string, SQLiteBindValue] => field[1] !== undefined);
    const assignments = [...supplied.map(([column]) => `${column} = ?`), 'updated_at = ?'];
    const values = [...supplied.map(([, value]) => value), updatedAt, id];
    const result = await db.runAsync(
      `UPDATE ${table} SET ${assignments.join(', ')} WHERE ${idColumn} = ?`, values,
    );
    return result.changes > 0;
  });
}

export async function deleteRow(db: SQLiteDatabase, table: string, column: string, id: string): Promise<boolean> {
  return repositoryOperation(`${table}.delete`, async () =>
    (await db.runAsync(`DELETE FROM ${table} WHERE ${column} = ?`, id)).changes > 0);
}
