import type { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

// These types describe the schema metadata and graph used by the overview renderer.
interface Entity {
  id: string;
  key: string;
  title: string;
  filePath: string;
  schema: JSONSchema7;
}

interface Relation {
  source: Entity;
  target: Entity;
  propertyPath: string;
  kind: '$ref' | 'id';
  isArray: boolean;
}

interface DiagramRelation extends Relation {
  primary: Relation;
  parent: Entity;
  child: Entity;
  cardinality: '}o--o{' | '||--o{' | '||--||';
  fields: Relation[];
}

interface SchemaRef {
  value: string;
  path: string[];
  isArray: boolean;
}

type EntityIndex = Map<string, Entity>;
type SchemaProperties = NonNullable<JSONSchema7['properties']>;

const ENTITIES_DIR = 'src/entities';
const OUTPUT_PATH = join(ENTITIES_DIR, 'overview.md');

const schemaFiles = await findSchemaFiles(ENTITIES_DIR);
const entities = await readEntities(schemaFiles);
const entityByRef = indexEntitiesByRef(entities);
const relations = collectRelations(entities, entityByRef);

await writeFile(OUTPUT_PATH, renderOverview(entities, relations));
console.log(`Generated ${OUTPUT_PATH} from ${schemaFiles.length} schemas.`);

async function findSchemaFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        return findSchemaFiles(entryPath);
      }

      return entry.isFile() && entry.name.endsWith('.schema.json') ? [entryPath] : [];
    })
  );

  return files.flat().sort();
}

async function readEntities(files: string[]): Promise<Entity[]> {
  const entities = await Promise.all(
    files.map(async (filePath) => {
      const schema = JSON.parse(await readFile(filePath, 'utf8')) as JSONSchema7;
      const fallbackName = basename(filePath, '.schema.json');
      const title = schema.title || toTitleCase(fallbackName);

      return {
        id: toMermaidEntityId(title),
        key: normalizeName(title),
        title,
        filePath,
        schema,
      };
    })
  );

  return entities.sort((left, right) => left.title.localeCompare(right.title));
}

function indexEntitiesByRef(entities: Entity[]): EntityIndex {
  const byRef: EntityIndex = new Map();

  for (const entity of entities) {
    byRef.set(stripHash(entity.schema.$id || ''), entity);
    byRef.set(entity.key, entity);
    byRef.set(normalizeName(basename(entity.filePath, '.schema.json')), entity);
  }

  return byRef;
}

function collectRelations(entities: Entity[], entityByRef: EntityIndex): DiagramRelation[] {
  const relations: Relation[] = [];
  const relationKeys = new Set<string>();

  for (const entity of entities) {
    const properties = entity.schema.properties || {};

    for (const [propertyName, propertySchema] of Object.entries(properties)) {
      for (const ref of findRefs(propertySchema)) {
        const target = resolveRef(ref.value, entityByRef);
        if (!target) continue;

        addRelation(relations, relationKeys, {
          source: entity,
          target,
          propertyPath: [propertyName, ...ref.path].join('.'),
          kind: '$ref',
          isArray: ref.isArray || (typeof propertySchema === 'object' && propertySchema.type === 'array'),
        });
      }
    }

    for (const [propertyName, propertySchema] of Object.entries(properties)) {
      const target =
        resolveSiblingRefForIdProperty(propertyName, properties, entityByRef) ??
        inferEntityFromIdProperty(propertyName, entities);
      if (!target) continue;

      addRelation(relations, relationKeys, {
        source: entity,
        target,
        propertyPath: propertyName,
        kind: 'id',
        isArray:
          propertyName.endsWith('Ids') || (typeof propertySchema === 'object' && propertySchema.type === 'array'),
      });
    }
  }

  return mergeDiagramRelations(relations).sort((left, right) =>
    [left.parent.title, left.child.title, left.primary.propertyPath]
      .join('|')
      .localeCompare([right.parent.title, right.child.title, right.primary.propertyPath].join('|'))
  );
}

function mergeDiagramRelations(relations: Relation[]): DiagramRelation[] {
  const relationsByEntityPair = new Map<string, Relation[]>();

  for (const relation of relations) {
    const key = [relation.source.id, relation.target.id].sort().join('|');
    const group = relationsByEntityPair.get(key) || [];
    group.push(relation);
    relationsByEntityPair.set(key, group);
  }

  return [...relationsByEntityPair.values()].map(mergeRelationGroup);
}

function mergeRelationGroup(group: Relation[]): DiagramRelation {
  const primary = group.toSorted((left, right) => relationRank(right) - relationRank(left))[0];
  if (!primary) throw new Error('Cannot merge an empty relation group');
  const arrayDirections = group.filter((relation) => relation.isArray);
  const hasManyToMany = arrayDirections.some(
    (relation) =>
      relation.source.id !== relation.target.id &&
      arrayDirections.some((other) => other.source.id === relation.target.id && other.target.id === relation.source.id)
  );

  if (hasManyToMany) {
    return { ...primary, primary, parent: primary.source, child: primary.target, cardinality: '}o--o{', fields: group };
  }

  const inverseArrayRelation = arrayDirections.find((relation) =>
    group.some(
      (other) =>
        !other.isArray &&
        (relation.source.id === relation.target.id ||
          (other.source.id === relation.target.id && other.target.id === relation.source.id))
    )
  );

  if (inverseArrayRelation) {
    return {
      ...primary,
      primary: inverseArrayRelation,
      parent: inverseArrayRelation.source,
      child: inverseArrayRelation.target,
      cardinality: '||--o{',
      fields: group,
    };
  }

  if (primary.isArray) {
    return { ...primary, primary, parent: primary.source, child: primary.target, cardinality: '||--o{', fields: group };
  }

  return { ...primary, primary, parent: primary.source, child: primary.target, cardinality: '||--||', fields: group };
}

function relationRank(relation: Relation) {
  // Prefer embedded $ref fields over mirrored id fields; prefer collection labels over singular labels.
  return (relation.kind === '$ref' ? 2 : 0) + (relation.isArray ? 1 : 0);
}

// Recursive schema walking is like traversing a Flutter widget tree: keep path + array context as you go down.
function findRefs(schema: JSONSchema7Definition, path: string[] = [], isArray = false): SchemaRef[] {
  if (!schema || typeof schema !== 'object') return [];

  const refs: SchemaRef[] = [];

  if (schema.$ref) {
    refs.push({ value: schema.$ref, path, isArray });
  }

  if (schema.items) {
    const items = Array.isArray(schema.items) ? schema.items : [schema.items];
    for (const item of items) refs.push(...findRefs(item, path, true));
  }

  for (const compositionKey of ['anyOf', 'oneOf', 'allOf'] as const) {
    for (const [index, childSchema] of (schema[compositionKey] || []).entries()) {
      refs.push(...findRefs(childSchema, [...path, compositionKey, String(index)], isArray));
    }
  }

  for (const [propertyName, childSchema] of Object.entries(schema.properties || {})) {
    refs.push(...findRefs(childSchema, [...path, propertyName], isArray));
  }

  return refs;
}

function addRelation(relations: Relation[], relationKeys: Set<string>, relation: Relation) {
  const key = [relation.source.id, relation.target.id, relation.propertyPath, relation.kind].join('|');

  if (relationKeys.has(key)) return;

  relationKeys.add(key);
  relations.push(relation);
}

function resolveRef(ref: string, entityByRef: EntityIndex): Entity | undefined {
  const refWithoutHash = stripHash(ref);

  if (entityByRef.has(refWithoutHash)) {
    return entityByRef.get(refWithoutHash);
  }

  try {
    const fileName = basename(new URL(refWithoutHash).pathname, '.schema.json');
    return entityByRef.get(normalizeName(fileName));
  } catch {
    return entityByRef.get(normalizeName(basename(refWithoutHash, '.schema.json')));
  }
}

// Paired fields like `outcomeId` + `outcome` should share one FK relation.
function resolveSiblingRefForIdProperty(
  propertyName: string,
  properties: SchemaProperties,
  entityByRef: EntityIndex
): Entity | undefined {
  if (!/(Id|Ids)$/.test(propertyName) || propertyName === 'id' || propertyName === 'ifsId') {
    return undefined;
  }

  const siblingName = propertyName.replace(/Ids?$/, '');
  const siblingSchema = properties[siblingName];
  if (!siblingSchema) return undefined;

  const siblingRef = findRefs(siblingSchema)[0];
  return siblingRef ? resolveRef(siblingRef.value, entityByRef) : undefined;
}

function inferEntityFromIdProperty(propertyName: string, entities: Entity[]): Entity | undefined {
  if (!/(Id|Ids)$/.test(propertyName) || propertyName === 'id' || propertyName === 'ifsId') {
    return undefined;
  }

  const stem = normalizeName(propertyName.replace(/Ids?$/, ''));
  return entities.find((entity) => stem === entity.key || stem.endsWith(entity.key));
}

function renderOverview(entities: Entity[], relations: DiagramRelation[]) {
  const lines = [
    '# Entities Overview',
    '',
    '<!-- GENERATED BY scripts/generate-entities-overview.ts. DO NOT EDIT BY HAND. -->',
    '',
    `Generated from \`${ENTITIES_DIR}/**/*.schema.json\`.`,
    '',
    '```mermaid',
    'erDiagram',
  ];

  for (const entity of entities) {
    lines.push(...renderEntity(entity, relations, entities));
  }

  for (const relation of relations) {
    lines.push(renderRelation(relation));
  }

  lines.push('```', '', '## Relation fields', '');

  if (relations.length === 0) {
    lines.push('- No relations found.');
  } else {
    for (const relation of relations) {
      for (const field of relation.fields) {
        lines.push(
          `- \`${field.source.title}.${field.propertyPath}\` → \`${field.target.title}\` (${field.kind}${
            field.isArray ? ', many' : ', one'
          })`
        );
      }
    }
  }

  lines.push('');
  return lines.join('\n');
}

function renderEntity(entity: Entity, relations: DiagramRelation[], entities: Entity[]) {
  const lines = [`  ${entity.id} {`];
  const properties = entity.schema.properties || {};
  const required = new Set(entity.schema.required || []);
  const foreignKeyProperties = new Set(
    relations.flatMap((relation) =>
      relation.fields.filter((field) => field.source.id === entity.id).map((field) => field.propertyPath.split('.')[0])
    )
  );

  for (const propertyName of Object.keys(properties)) {
    if (inferEntityFromIdProperty(propertyName, entities)) {
      foreignKeyProperties.add(propertyName);
    }
  }

  for (const [propertyName, propertySchema] of Object.entries(properties)) {
    const flags = [];
    if (propertyName === 'id') flags.push('PK');
    if (foreignKeyProperties.has(propertyName)) flags.push('FK');

    lines.push(
      `    ${sanitizeAttributeName(propertyName)} ${toMermaidType(propertySchema)}${
        flags.length ? ` ${flags.join(',')}` : ''
      } "${formatAttributeComment(propertySchema, required.has(propertyName))}"`
    );
  }

  lines.push('  }');
  return lines;
}

function renderRelation(relation: DiagramRelation) {
  return `  ${relation.parent.id} ${relation.cardinality} ${relation.child.id} : ${renderRelationLabel(relation)}`;
}

function renderRelationLabel(relation: DiagramRelation) {
  const mirrorFields = relation.fields.filter((field) => field !== relation.primary);
  const fkFields = mirrorFields.filter((field) => field.kind === 'id').map((field) => field.propertyPath);
  const otherFields = mirrorFields.filter((field) => field.kind !== 'id').map((field) => field.propertyPath);
  const labelParts = [sanitizeRelationLabel(relation.primary.propertyPath)];

  if (fkFields.length > 0) {
    labelParts.push('fk', fkFields.map(sanitizeRelationLabel).join('_and_'));
  }

  if (otherFields.length > 0) {
    labelParts.push('also', otherFields.map(sanitizeRelationLabel).join('_and_'));
  }

  return labelParts.join('_');
}

function toMermaidType(schema: JSONSchema7Definition) {
  if (typeof schema === 'boolean') return 'unknown';
  if (schema.$ref) return 'object';
  if (Array.isArray(schema.type)) return sanitizeType(schema.type.join('_or_'));
  if (schema.enum) return 'string';
  if (schema.type === 'integer') return 'int';
  if (schema.type === 'number') return 'float';
  if (schema.type === 'boolean') return 'boolean';
  if (schema.type === 'array') return 'array';
  if (schema.type === 'object') return 'object';
  return 'string';
}

function formatAttributeComment(schema: JSONSchema7Definition, isRequired: boolean) {
  if (typeof schema === 'boolean') return isRequired ? 'required' : 'optional';
  const parts = [];
  if (isRequired) parts.push('required');
  if (schema.format) parts.push(schema.format);
  if (schema.items && !Array.isArray(schema.items) && typeof schema.items === 'object' && schema.items.$ref) {
    parts.push(`${toTitleCase(basename(stripHash(schema.items.$ref), '.schema.json'))}[]`);
  }
  if (schema.$ref) parts.push(toTitleCase(basename(stripHash(schema.$ref), '.schema.json')));
  return escapeMermaidComment(parts.join(', ') || 'optional');
}

function sanitizeAttributeName(name: string) {
  return name.replace(/[^A-Za-z0-9_]/g, '_');
}

function sanitizeRelationLabel(label: string) {
  return label.replace(/[^A-Za-z0-9_]/g, '_');
}

function sanitizeType(type: string) {
  return type.replace(/[^A-Za-z0-9_]/g, '_');
}

function toMermaidEntityId(name: string) {
  return normalizeName(name)
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toUpperCase();
}

function normalizeName(value: string) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function toTitleCase(value: string) {
  return String(value)
    .replace(/\.schema\.json$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\s+/g, '');
}

function stripHash(value: string) {
  return value.split('#', 1)[0] ?? value;
}

function escapeMermaidComment(value: string) {
  return String(value).replace(/"/g, "'");
}
