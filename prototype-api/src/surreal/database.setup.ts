import type { Surreal } from 'surrealdb';
import { graphEdges } from './entity-storage.ts';

// Explicit setup only: application startup never changes database definitions.
export async function initializeDatabase(
  client: Surreal,
  tables: readonly string[],
): Promise<void> {
  const namespace = client.namespace;
  const database = client.database;
  if (
    ![namespace, database, ...tables].every(
      (name) =>
        typeof name === 'string' && /^[A-Za-z_][A-Za-z0-9_-]*$/.test(name),
    )
  ) {
    throw new Error(
      'Database setup requires simple namespace, database, and table identifiers.',
    );
  }
  await client.query(
    [
      `DEFINE NAMESPACE IF NOT EXISTS \`${namespace}\`;`,
      `DEFINE DATABASE IF NOT EXISTS \`${database}\`;`,
    ].join('\n'),
  );
  const [info] =
    await client.query<[{ tables: Record<string, string> }]>('INFO FOR DB;');
  for (const table of tables) {
    if (
      table in graphEdges &&
      info.tables[table] &&
      !/\bTYPE RELATION\b/.test(info.tables[table])
    ) {
      throw new Error(
        `Table ${table} is not a graph relation. Migrate or explicitly remove it before running db:setup.`,
      );
    }
  }
  await client.query(
    tables
      .map(
        (table) =>
          `DEFINE TABLE IF NOT EXISTS \`${table}\` ${table in graphEdges ? 'TYPE RELATION ENFORCED ' : ''}SCHEMALESS;`,
      )
      .join('\n'),
  );
}
