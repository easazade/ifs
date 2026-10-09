// Abstract schemas define shared contracts, not standalone resources or database tables.
export function isAbstractEntity(schema: object): boolean {
  return 'x-ifs-abstract' in schema && schema['x-ifs-abstract'] === true;
}
