import type { Surreal } from 'surrealdb';

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
      ...tables.map(
        (table) => `DEFINE TABLE IF NOT EXISTS \`${table}\` SCHEMALESS;`,
      ),
    ].join('\n'),
  );
}
