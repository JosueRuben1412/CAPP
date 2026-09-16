export type RepositoryErrorKind = 'constraint' | 'not_found' | 'unknown';

export class RepositoryError extends Error {
  constructor(public readonly kind: RepositoryErrorKind, operation: string, cause?: unknown) {
    super(`Error de persistencia en ${operation}: ${kind}`, { cause });
    this.name = 'RepositoryError';
  }
}

export async function repositoryOperation<T>(operation: string, action: () => Promise<T>): Promise<T> {
  try {
    return await action();
  } catch (cause) {
    if (cause instanceof RepositoryError) throw cause;
    // Expo SQLite surfaces native constraint errors as message text; classify only known forms.
    const message = cause instanceof Error ? cause.message : '';
    const kind = /SQLITE_CONSTRAINT|constraint failed|UNIQUE constraint|FOREIGN KEY constraint|CHECK constraint|NOT NULL constraint/i.test(message)
      ? 'constraint' : 'unknown';
    throw new RepositoryError(kind, operation, cause);
  }
}
