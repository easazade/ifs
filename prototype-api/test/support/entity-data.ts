// Required base fields for test payloads; not generated/canonical entity examples.
export function baseEntity(type: string, key: string) {
  const entity = type
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replaceAll(' ', '-')
    .toLowerCase();
  return {
    id: `${type.replaceAll(' ', '')}/${key}`,
    entityType: type,
    entityDocumentationUrl: `https://ifs-standards.org/v0.1/schemas/entities/${entity}.schema.json`,
    createdAt: '2026-07-01T00:00:00Z',
    labelCodes: [],
  };
}
