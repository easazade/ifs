import { randomUUID } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { BadRequestException } from '@nestjs/common';
import { RecordId } from 'surrealdb';
import { entityRelations, entityTables } from './entity-tables.generated.js';
import { graphEdges } from './entity-storage.js';
import { entityContracts } from './entity-schemas.generated.js';
import { assertEntityType } from './entity-type.js';
import type { Relation } from './surreal.service.js';

export const missingNestedReference = 'IFS_NESTED_REFERENCE_NOT_FOUND';
export const missingNestedRoot = 'IFS_NESTED_ROOT_NOT_FOUND';
type Document = Record<string, unknown>;
type Node = { record: RecordId; content: Document };

// Build one bound transaction: nested objects are identities, not embedded copies.
// Full schema/semantic validation is deliberately separate from graph persistence.
export function planNestedWrite(
  table: string,
  id: string,
  data: object,
  relations: readonly Relation[],
  update: boolean,
) {
  const nodes = new Map<string, Node>();
  const references = new Map<string, RecordId>();
  const root = new RecordId(table, id);
  const key = (record: RecordId) =>
    JSON.stringify([record.table.name, record.id]);
  let count = 1;

  function content(
    value: Document,
    fields: readonly Relation[],
    depth: number,
  ): Document {
    if (depth > 32)
      throw new BadRequestException(
        'Nested writes exceed the depth or object limit.',
      );
    const result = { ...value };
    delete result.id;
    for (const { property, table: target, isArray, readOnly } of fields) {
      if (readOnly) {
        delete result[property];
        continue;
      }
      const supplied = result[property];
      if (supplied === undefined || supplied === null) continue;
      if (isArray && !Array.isArray(supplied))
        throw new BadRequestException(`${property} must be an array.`);
      const records = (isArray ? (supplied as unknown[]) : [supplied]).map(
        (item) => {
          if (++count > 1000)
            throw new BadRequestException(
              'Nested writes exceed the object limit.',
            );
          if (!item || typeof item !== 'object' || Array.isArray(item))
            throw new BadRequestException(
              `${property} must contain entity objects.`,
            );
          if (target in graphEdges)
            throw new BadRequestException(
              'Graph edges cannot be nested writes.',
            );
          const child = item as Document;
          const type = Object.keys(entityTables).find(
            (name) => entityTables[name] === target,
          );
          if (!type)
            throw new BadRequestException(
              `Unknown nested entity table: ${target}.`,
            );
          const discriminator =
            (
              entityContracts[target]?.properties as
                Record<string, { const?: string }> | undefined
            )?.entityType?.const ?? type;
          assertEntityType(child, discriminator, true);
          const suppliedId = child.id;
          const fresh =
            suppliedId === undefined ||
            suppliedId === null ||
            suppliedId === '';
          if (!fresh && (typeof suppliedId !== 'string' || !suppliedId.trim()))
            throw new BadRequestException(
              `${property} has an invalid entity ID.`,
            );
          const childId = fresh
            ? `${type}/${randomUUID()}`
            : (suppliedId as string);
          // Retain support for existing legacy keys; canonical IDs must match the target type.
          if (
            childId.includes('/') &&
            !new RegExp(`^${type}/[^/\\s]+$`).test(childId)
          )
            throw new BadRequestException(
              `${property} must reference a ${type} ID.`,
            );
          const record = new RecordId(target, childId);
          const identity = key(record);
          references.set(identity, record);
          const hasFields = Object.keys(child).some((name) => name !== 'id');
          if (!fresh && !hasFields) return record;
          if (!hasFields)
            throw new BadRequestException(
              `${property} needs fields when creating a new entity.`,
            );
          const childContent = content(
            { ...child, entityType: discriminator },
            entityRelations[target] ?? [],
            depth + 1,
          );
          if (identity === key(root))
            throw new BadRequestException(
              'A nested definition cannot overwrite the root; use an ID-only reference.',
            );
          const previous = nodes.get(identity);
          if (previous && !isDeepStrictEqual(previous.content, childContent))
            throw new BadRequestException(
              `Conflicting nested definitions for ${childId}.`,
            );
          nodes.set(identity, { record, content: childContent });
          return record;
        },
      );
      result[property] = isArray ? records : records[0];
    }
    return result;
  }

  const rootContent = content(data as Document, relations, 0);
  const bindings: Record<string, unknown> = { root, rootContent };
  const statements = ['BEGIN TRANSACTION;'];
  if (update)
    statements.push(
      `IF !record::exists($root) { THROW '${missingNestedRoot}'; };`,
    );
  let index = 0;
  for (const { record, content: nodeContent } of nodes.values()) {
    bindings[`node${index}`] = record;
    bindings[`content${index}`] = nodeContent;
    statements.push(`UPSERT $node${index} MERGE $content${index};`);
    index++;
  }
  statements.push(
    update
      ? 'UPDATE $root MERGE $rootContent;'
      : 'CREATE $root CONTENT $rootContent;',
  );
  index = 0;
  for (const record of references.values()) {
    bindings[`reference${index}`] = record;
    statements.push(
      `IF !record::exists($reference${index}) { THROW '${missingNestedReference}'; };`,
    );
    index++;
  }
  statements.push('COMMIT TRANSACTION;');
  return {
    sql: statements.join('\n'),
    transactionSql: statements.slice(1, -1).join('\n'),
    records: [root, ...[...nodes.values()].map((node) => node.record)],
    bindings,
  };
}
