#!/usr/bin/env node
// Generates NestJS DTOs from canonical IFS entity schemas; no database required.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { graphEdges } from '../src/surreal/entity-storage.ts';

const apiRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const entitiesRoot = resolve(apiRoot, '../ifs-standards/src/entities');
const pascalCase = (value) =>
  value
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');
const types = (property) =>
  Array.isArray(property.type)
    ? property.type.filter((type) => type !== 'null')
    : [property.type];
const nullable = (property) =>
  Array.isArray(property.type) && property.type.includes('null');

function readSchema(path) {
  if (!existsSync(path)) throw new Error(`Schema not found: ${path}`);
  const schema = JSON.parse(readFileSync(path, 'utf8'));
  if (schema.type !== 'object' || !schema.title || !schema.properties) {
    throw new Error('Schema must be an object with title and properties.');
  }
  for (const name of Object.keys(schema.properties)) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name))
      throw new Error(`Invalid property: ${name}`);
  }
  if (!types(schema.properties.id ?? {}).includes('string'))
    throw new Error('Schema must define a string id property.');
  return schema;
}

function relation(property) {
  const ref = property.$ref ?? property.items?.$ref;
  if (!ref) return undefined;
  const file = basename(ref.split('#')[0]);
  if (!file.endsWith('.schema.json'))
    throw new Error(`Unsupported non-entity $ref: ${ref}`);
  const entity = file.slice(0, -'.schema.json'.length);
  const schema = readSchema(join(entitiesRoot, entity, file));
  return { entity, className: `${pascalCase(schema.title)}ResponseDto` };
}

function propertyType(property) {
  const related = relation(property);
  if (property.$ref) return related.className;
  const [type] = types(property);
  if (type === 'array')
    return `Array<${related?.className ?? propertyType(property.items ?? {})}>`;
  if (type === 'string' && property.const !== undefined)
    return JSON.stringify(property.const);
  if (type === 'string' && property.enum?.length)
    return property.enum.map((value) => JSON.stringify(value)).join(' | ');
  if (type === 'string') return 'string';
  if (type === 'integer' || type === 'number') return 'number';
  if (type === 'boolean') return 'boolean';
  if (type === 'null') return 'null';
  return 'Record<string, unknown>';
}

function itemSchema(property) {
  const [type] = types(property);
  const result = { type: type ?? 'object' };
  for (const key of [
    'description',
    'format',
    'enum',
    'minimum',
    'maximum',
    'minLength',
    'maxLength',
    'pattern',
    'minItems',
    'maxItems',
    'uniqueItems',
    'required',
    'additionalProperties',
  ]) {
    if (property[key] !== undefined) result[key] = property[key];
  }
  if (property.const !== undefined) result.enum = [property.const];
  if (nullable(property)) result.nullable = true;
  if (type === 'array') result.items = itemSchema(property.items ?? {});
  if (property.properties)
    result.properties = Object.fromEntries(
      Object.entries(property.properties).map(([name, value]) => [
        name,
        itemSchema(value),
      ]),
    );
  return result;
}

function decorator(property, required) {
  const options = [];
  for (const key of ['description', 'format']) {
    if (property[key] !== undefined)
      options.push(`${key}: ${JSON.stringify(property[key])}`);
  }
  if (property.const !== undefined)
    options.push(`enum: [${JSON.stringify(property.const)}]`);
  else if (Array.isArray(property.enum))
    options.push(`enum: ${JSON.stringify(property.enum)}`);
  for (const key of ['readOnly', 'writeOnly']) {
    if (property[key] !== undefined)
      options.push(`${key}: ${JSON.stringify(property[key])}`);
  }
  if (nullable(property)) options.push('nullable: true');
  for (const key of [
    'minimum',
    'maximum',
    'minLength',
    'maxLength',
    'pattern',
    'default',
    'minItems',
    'maxItems',
    'uniqueItems',
    'deprecated',
  ]) {
    if (property[key] !== undefined)
      options.push(`${key}: ${JSON.stringify(property[key])}`);
  }
  if (property.examples?.length)
    options.push(`example: ${JSON.stringify(property.examples[0])}`);
  const related = relation(property);
  if (related)
    options.push(
      `type: () => ${types(property)[0] === 'array' ? `[${related.className}]` : related.className}`,
    );
  else if (types(property)[0] === 'array') {
    const itemType = propertyType(property.items ?? {});
    const primitive = {
      string: 'String',
      number: 'Number',
      boolean: 'Boolean',
    }[itemType];
    if (primitive) options.push(`type: [${primitive}]`);
    else
      options.push(
        "type: 'array'",
        `items: ${JSON.stringify(itemSchema(property.items ?? {}))}`,
      );
  } else if (types(property)[0] === 'object' || !property.type)
    options.push("type: 'object'", 'additionalProperties: true');
  return `@${required ? 'ApiProperty' : 'ApiPropertyOptional'}({ ${options.join(', ')} })`;
}

function renderClass(
  className,
  entity,
  properties,
  required,
  additionalProperties,
) {
  const decorators = [
    ...new Set(
      properties.map(([name]) =>
        required.has(name) ? 'ApiProperty' : 'ApiPropertyOptional',
      ),
    ),
  ];
  const imports = new Map();
  for (const [, property] of properties) {
    const related = relation(property);
    if (!related || related.className === className) continue;
    imports.set(
      related.className,
      related.entity === entity
        ? `./${entity}-response.dto.js`
        : `../../${related.entity}/dto/${related.entity}-response.dto.js`,
    );
  }
  return [
    `import { ${decorators.join(', ')} } from '@nestjs/swagger';`,
    ...[...imports]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, path]) => `import { ${name} } from '${path}';`),
    '',
    `export class ${className} {`,
    ...properties.flatMap(([name, property]) => [
      `  ${decorator(property, required.has(name))}`,
      `  ${name}${required.has(name) ? '' : '?'}: ${propertyType(property)}${nullable(property) ? ' | null' : ''};`,
      '',
    ]),
    ...(additionalProperties ? ['  [key: string]: unknown;', ''] : []),
    '}',
    '',
  ].join('\n');
}

export function generateDto(input, options = {}) {
  if (!input) throw new Error('Missing entity name or schema path.');
  const isPath =
    input.includes('/') || input.includes('\\') || input.endsWith('.json');
  if (!isPath && !/^[A-Za-z][A-Za-z0-9-]*$/.test(input))
    throw new Error(`Invalid entity name: ${input}`);
  const name = input.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  const schemaPath = isPath
    ? resolve(process.cwd(), input)
    : join(entitiesRoot, name, `${name}.schema.json`);
  const schema = readSchema(schemaPath);
  const entity = basename(schemaPath, '.schema.json');
  const modelName = pascalCase(schema.title);
  const dtoDir = join(apiRoot, 'src', entity, 'dto');
  // Verify dependencies before writing; generation order supplies related DTOs.
  const missing = Object.values(schema.properties)
    .map(relation)
    .filter(
      (related) =>
        related &&
        related.entity !== entity &&
        !existsSync(
          join(
            apiRoot,
            'src',
            related.entity,
            'dto',
            `${related.entity}-response.dto.ts`,
          ),
        ),
    );
  if (missing.length)
    throw new Error(
      `Required related response DTOs do not exist: ${[...new Set(missing.map((item) => item.className))].join(', ')}`,
    );
  const required = new Set(schema.required ?? []);
  const properties = Object.entries(schema.properties);
  const create = renderClass(
    `Create${modelName}Dto`,
    entity,
    properties.filter(([, value]) => !value.readOnly),
    required,
    schema.additionalProperties !== false,
  );
  const response = renderClass(
    `${modelName}ResponseDto`,
    entity,
    properties.filter(([, value]) => !value.writeOnly),
    required,
    schema.additionalProperties !== false,
  );
  mkdirSync(dtoDir, { recursive: true });
  writeFileSync(join(dtoDir, `create-${entity}.dto.ts`), create);
  writeFileSync(join(dtoDir, `${entity}-response.dto.ts`), response);
  const edge = graphEdges[entity.replaceAll('-', '_')];
  const updateBase = edge
    ? `OmitType(Create${modelName}Dto, ${JSON.stringify(edge.immutable)} as const)`
    : `Create${modelName}Dto`;
  writeFileSync(
    join(dtoDir, `update-${entity}.dto.ts`),
    `import { PartialType${edge ? ', OmitType' : ''} } from '@nestjs/swagger';\nimport { Create${modelName}Dto } from './create-${entity}.dto.js';\n\nexport class Update${modelName}Dto extends PartialType(${updateBase}) {}\n`,
  );
  if (!options.skipFormat)
    execFileSync('pnpm', ['exec', 'prettier', '--write', dtoDir], {
      cwd: apiRoot,
      stdio: 'inherit',
    });
  return { schemaPath, dtoDir, modelName };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const args = process.argv.slice(2);
  const usage =
    'Usage: pnpm --filter prototype-api dto:generate <entity-name|schema-path> [--skip-format]';
  if (args.includes('--help') || args.includes('-h')) console.log(usage);
  else {
    try {
      const positional = args.filter((arg) => !arg.startsWith('-'));
      if (
        positional.length !== 1 ||
        args.some((arg) => arg.startsWith('-') && arg !== '--skip-format')
      )
        throw new Error(usage);
      const result = generateDto(positional[0], {
        skipFormat: args.includes('--skip-format'),
      });
      console.log(
        `Generated ${result.modelName} DTOs in ${relative(apiRoot, result.dtoDir)}`,
      );
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    }
  }
}
