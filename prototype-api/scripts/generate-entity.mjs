#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const apiRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const workspaceRoot = resolve(apiRoot, '..');
const entitiesRoot = join(workspaceRoot, 'ifs-standards', 'src', 'entities');
const prismaSchemaPath = join(apiRoot, 'prisma', 'schema.prisma');

function usage(message) {
  if (message) console.error(`Error: ${message}\n`);
  console.error(
    'Usage: pnpm --filter prototype-api entity:generate <entity-name|schema-path> [--skip-prisma-generate]',
  );
  process.exitCode = message ? 1 : 0;
}

function kebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function pascalCase(value) {
  return value
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');
}

function resolveSchemaPath(input) {
  if (!input) throw new Error('Missing entity name or schema path.');

  const looksLikePath =
    input.includes('/') || input.includes('\\') || input.endsWith('.json');
  if (looksLikePath) return resolve(process.cwd(), input);

  if (!/^[A-Za-z][A-Za-z0-9-]*$/.test(input)) {
    throw new Error(`Invalid entity name: ${input}`);
  }

  const name = kebabCase(input);
  return join(entitiesRoot, name, `${name}.schema.json`);
}

function readSchema(schemaPath) {
  if (!existsSync(schemaPath))
    throw new Error(`Schema not found: ${schemaPath}`);

  let schema;
  try {
    schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
  } catch (error) {
    throw new Error(`Invalid JSON in ${schemaPath}: ${error.message}`);
  }

  if (schema.type !== 'object' || !schema.title || !schema.properties) {
    throw new Error('Schema must be an object with title and properties.');
  }

  const invalidProperty = Object.keys(schema.properties).find(
    (name) => !/^[A-Za-z_][A-Za-z0-9_]*$/.test(name),
  );
  if (invalidProperty) {
    throw new Error(
      `Property cannot be represented in TypeScript/Prisma: ${invalidProperty}`,
    );
  }

  if (
    !schema.properties.id ||
    !scalarTypes(schema.properties.id).includes('string')
  ) {
    throw new Error(
      'Schema must define a string id property for Prisma @id mapping.',
    );
  }

  return schema;
}

function scalarTypes(property) {
  const type = property.type;
  return Array.isArray(type)
    ? type.filter((item) => item !== 'null')
    : type
      ? [type]
      : [];
}

function isNullable(property) {
  return Array.isArray(property.type) && property.type.includes('null');
}

function propertyType(property) {
  if (property.$ref) return 'Record<string, unknown>';

  const [type] = scalarTypes(property);
  if (type === 'array') {
    const item = property.items ?? {};
    const itemType = item.$ref ? 'Record<string, unknown>' : propertyType(item);
    return `Array<${itemType}>`;
  }
  if (type === 'string' && property.const !== undefined)
    return JSON.stringify(property.const);
  if (type === 'string' && Array.isArray(property.enum)) {
    return (
      property.enum.map((value) => JSON.stringify(value)).join(' | ') ||
      'string'
    );
  }
  if (type === 'string') return 'string';
  if (type === 'integer' || type === 'number') return 'number';
  if (type === 'boolean') return 'boolean';
  if (type === 'null') return 'null';
  return 'Record<string, unknown>';
}

function decoratorFor(property, required) {
  const decorator = required ? 'ApiProperty' : 'ApiPropertyOptional';
  const options = [];
  if (property.description)
    options.push(`description: ${JSON.stringify(property.description)}`);
  if (property.format)
    options.push(`format: ${JSON.stringify(property.format)}`);
  if (property.const !== undefined)
    options.push(`enum: [${JSON.stringify(property.const)}]`);
  else if (Array.isArray(property.enum))
    options.push(`enum: ${JSON.stringify(property.enum)}`);
  if (property.readOnly) options.push('readOnly: true');
  if (property.writeOnly) options.push('writeOnly: true');
  if (isNullable(property)) options.push('nullable: true');
  if (typeof property.minimum === 'number')
    options.push(`minimum: ${property.minimum}`);
  if (typeof property.maximum === 'number')
    options.push(`maximum: ${property.maximum}`);
  if (typeof property.minLength === 'number')
    options.push(`minLength: ${property.minLength}`);
  if (typeof property.maxLength === 'number')
    options.push(`maxLength: ${property.maxLength}`);
  if (property.pattern)
    options.push(`pattern: ${JSON.stringify(property.pattern)}`);

  const ref = property.$ref ?? property.items?.$ref;
  if (ref) {
    options.push(
      property.type === 'array'
        ? "type: 'object', isArray: true, additionalProperties: true"
        : "type: 'object', additionalProperties: true",
    );
  } else if (property.type === 'array') {
    const itemType = propertyType(property.items ?? {});
    const swaggerType =
      itemType === 'string'
        ? 'String'
        : itemType === 'number'
          ? 'Number'
          : itemType === 'boolean'
            ? 'Boolean'
            : "'object'";
    options.push(`type: [${swaggerType}]`);
  } else if (
    scalarTypes(property)[0] === 'object' ||
    property.$ref ||
    !property.type
  ) {
    options.push("type: 'object'", 'additionalProperties: true');
  }

  return `@${decorator}({ ${options.join(', ')} })`;
}

function renderClass({
  className,
  properties,
  required,
  additionalProperties,
}) {
  const decorators = properties.some(([name]) => required.has(name))
    ? [
        'ApiProperty',
        ...(properties.some(([name]) => !required.has(name))
          ? ['ApiPropertyOptional']
          : []),
      ]
    : ['ApiPropertyOptional'];
  const lines = [
    `import { ${decorators.join(', ')} } from '@nestjs/swagger';`,
    '',
    `export class ${className} {`,
  ];

  for (const [name, property] of properties) {
    const isRequired = required.has(name);
    const optional = isRequired ? '' : '?';
    const nullable = isNullable(property) ? ' | null' : '';
    lines.push(`  ${decoratorFor(property, isRequired)}`);
    lines.push(
      `  ${name}${optional}: ${propertyType(property)}${nullable};`,
      '',
    );
  }

  if (additionalProperties) {
    lines.push('  [key: string]: unknown;', '');
  }

  lines.push('}', '');
  return lines.join('\n');
}

function prismaType(property) {
  const [type] = scalarTypes(property);
  if (property.$ref || type === 'array' || type === 'object' || !type)
    return 'Json';
  if (type === 'string') return 'String';
  if (type === 'integer') return 'Int';
  if (type === 'number') return 'Float';
  if (type === 'boolean') return 'Boolean';
  throw new Error(
    `Unsupported JSON Schema type: ${JSON.stringify(property.type)}`,
  );
}

function renderPrismaModel(schema, modelName, sourcePath) {
  const required = new Set(schema.required ?? []);
  const fields = [];

  for (const [name, property] of Object.entries(schema.properties)) {
    const optional = required.has(name) && !isNullable(property) ? '' : '?';
    const id = name === 'id' ? ' @id' : '';
    fields.push(`  ${name} ${prismaType(property)}${optional}${id}`);
  }

  if (schema.additionalProperties !== false && !schema.properties.extensions) {
    fields.push('  extensions Json?');
  }

  const source = relative(apiRoot, sourcePath).replaceAll('\\', '/');
  return [
    `// <generated:model ${modelName} source="${source}">`,
    `model ${modelName} {`,
    ...fields,
    '}',
    `// </generated:model ${modelName}>`,
  ].join('\n');
}

function upsertPrismaModel(prismaSource, modelName, model) {
  const escaped = modelName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const block = new RegExp(
    `\\n?// <generated:model ${escaped} source="[^"]+">[\\s\\S]*?// </generated:model ${escaped}>\\n?`,
  );
  const withoutOldBlock = prismaSource.replace(block, '\n');
  return `${withoutOldBlock.trimEnd()}\n\n${model}\n`;
}

export function generateEntity(schemaPathInput, options = {}) {
  const schemaPath = resolveSchemaPath(schemaPathInput);
  const schema = readSchema(schemaPath);
  const entityName = kebabCase(basename(schemaPath, '.schema.json'));
  const modelName = pascalCase(schema.title || entityName);
  const dtoDir = join(apiRoot, 'src', entityName, 'dto');
  const required = new Set(schema.required ?? []);

  const createProperties = Object.entries(schema.properties).filter(
    ([, property]) => !property.readOnly,
  );
  const responseProperties = Object.entries(schema.properties).filter(
    ([, property]) => !property.writeOnly,
  );

  mkdirSync(dtoDir, { recursive: true });
  writeFileSync(
    join(dtoDir, `create-${entityName}.dto.ts`),
    renderClass({
      className: `Create${modelName}Dto`,
      properties: createProperties,
      required,
      additionalProperties: schema.additionalProperties !== false,
    }),
  );
  writeFileSync(
    join(dtoDir, `update-${entityName}.dto.ts`),
    [
      `import { PartialType } from '@nestjs/swagger';`,
      `import { Create${modelName}Dto } from './create-${entityName}.dto.js';`,
      '',
      `export class Update${modelName}Dto extends PartialType(Create${modelName}Dto) {}`,
      '',
    ].join('\n'),
  );
  writeFileSync(
    join(dtoDir, `${entityName}-response.dto.ts`),
    renderClass({
      className: `${modelName}ResponseDto`,
      properties: responseProperties,
      required,
      additionalProperties: schema.additionalProperties !== false,
    }),
  );

  const prismaSource = readFileSync(prismaSchemaPath, 'utf8');
  const prismaModel = renderPrismaModel(schema, modelName, schemaPath);
  writeFileSync(
    prismaSchemaPath,
    upsertPrismaModel(prismaSource, modelName, prismaModel),
  );

  if (!options.skipPrismaGenerate) {
    execFileSync('pnpm', ['exec', 'prisma', 'format'], {
      cwd: apiRoot,
      stdio: 'inherit',
    });
    execFileSync('pnpm', ['exec', 'prisma', 'generate'], {
      cwd: apiRoot,
      stdio: 'inherit',
    });
  }

  return {
    schemaPath,
    dtoDir,
    modelName,
    prismaSchemaPath,
  };
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) return usage();

  const allowedFlags = new Set(['--skip-prisma-generate']);
  const unknownFlag = args.find(
    (arg) => arg.startsWith('-') && !allowedFlags.has(arg),
  );
  if (unknownFlag) return usage(`Unknown option: ${unknownFlag}`);

  const skipPrismaGenerate = args.includes('--skip-prisma-generate');
  const positional = args.filter((arg) => !arg.startsWith('--'));
  if (positional.length !== 1)
    return usage('Expected exactly one entity name or schema path.');

  try {
    const result = generateEntity(positional[0], { skipPrismaGenerate });
    console.log(
      `Generated ${result.modelName} DTOs in ${relative(workspaceRoot, result.dtoDir)}`,
    );
    console.log(`Updated ${relative(workspaceRoot, result.prismaSchemaPath)}`);
    if (skipPrismaGenerate)
      console.log('Skipped Prisma format/client generation.');
  } catch (error) {
    usage(error instanceof Error ? error.message : String(error));
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main();
