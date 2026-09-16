import { initialSchema } from './001_initial_schema';

export const migrations: readonly { version: number; sql: string }[] = [
  { version: 1, sql: initialSchema },
];
