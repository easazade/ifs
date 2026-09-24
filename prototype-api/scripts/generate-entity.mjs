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

function propertyRef(property) {
  return property.$ref ?? property.items?.$ref;
}

function referencedEntityName(ref) {
  const schemaFile = basename(ref.split('#')[0]);
  if (!schemaFile.endsWith('.schema.json')) {
    throw new Error(`Unsupported non-entity $ref: ${ref}`);
  }
  return schemaFile.slice(0, -'.schema.json'.length);
}

function relationInfo(property) {
  const ref = propertyRef(property);
  if (!ref) return undefined;

  const entityName = referencedEntityName(ref);
  const schemaPath = join(
    entitiesRoot,
    entityName,
    `${entityName}.schema.json`,
  );
  const schema = readSchema(schemaPath);
  return {
    ref,
    entityName,
    modelName: pascalCase(schema.title),
    isArray: scalarTypes(property)[0] === 'array',
  };
}

function collectRelations(schema) {
  return Object.entries(schema.properties)
    .filter(([, property]) => propertyRef(property))
    .map(([propertyName, property]) => ({
      propertyName,
      property,
      ...relationInfo(property),
    }));
}

function modelExists(prismaSource, modelName) {
  return new RegExp(`(^|\\n)model\\s+${modelName}\\s*\\{`).test(prismaSource);
}

function generatedModelExists(prismaSource, modelName) {
  return prismaSource.includes(`// <generated:model ${modelName} source=`);
}

function assertDependencies(prismaSource, relations, modelName) {
  const missingModels = [
    ...new Set(
      relations
        .filter((relation) => relation.modelName !== modelName)
        .filter((relation) => !modelExists(prismaSource, relation.modelName))
        .map((relation) => relation.modelName),
    ),
  ];

  if (missingModels.length) {
    throw new Error(
      `Cannot generate ${modelName}. Required related Prisma models do not exist: ${missingModels.join(', ')}. Generate those models first.`,
    );
  }

  const incompatibleModels = [
    ...new Set(
      relations
        .filter((relation) => relation.modelName !== modelName)
        .filter((relation) => {
          const model = findModel(prismaSource, relation.modelName);
          return !model || !/^\s*id\s+String\s+[^\n]*@id/m.test(model.text);
        })
        .map((relation) => relation.modelName),
    ),
  ];
  if (incompatibleModels.length) {
    throw new Error(
      `Cannot generate ${modelName}. Related Prisma models must expose id String @id: ${incompatibleModels.join(', ')}.`,
    );
  }

  const missingDtos = [
    ...new Set(
      relations
        .filter((relation) => relation.modelName !== modelName)
        .filter(
          (relation) =>
            !existsSync(
              join(
                apiRoot,
                'src',
                relation.entityName,
                'dto',
                `${relation.entityName}-response.dto.ts`,
              ),
            ),
        )
        .map((relation) => `${relation.modelName}ResponseDto`),
    ),
  ];

  if (missingDtos.length) {
    throw new Error(
      `Cannot generate ${modelName} DTOs. Required related response DTOs do not exist: ${missingDtos.join(', ')}. Generate those entities first.`,
    );
  }
}

function relationClass(property) {
  const relation = relationInfo(property);
  return relation ? `${relation.modelName}ResponseDto` : undefined;
}

function propertyType(property) {
  const relationType = relationClass(property);
  if (property.$ref) return relationType;

  const [type] = scalarTypes(property);
  if (type === 'array') {
    const item = property.items ?? {};
    return `Array<${relationType ?? propertyType(item)}>`;
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

  const relatedClass = relationClass(property);
  if (relatedClass) {
    options.push(
      scalarTypes(property)[0] === 'array'
        ? `type: () => [${relatedClass}]`
        : `type: () => ${relatedClass}`,
    );
  } else if (scalarTypes(property)[0] === 'array') {
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
  } else if (scalarTypes(property)[0] === 'object' || !property.type) {
    options.push("type: 'object'", 'additionalProperties: true');
  }

  return `@${decorator}({ ${options.join(', ')} })`;
}

function dtoImports(properties, entityName, modelName, className) {
  const imports = new Map();
  for (const [, property] of properties) {
    const relation = relationInfo(property);
    if (!relation) continue;

    const relatedClass = `${relation.modelName}ResponseDto`;
    if (relatedClass === className) continue;

    const importPath =
      relation.modelName === modelName
        ? `./${entityName}-response.dto.js`
        : `../../${relation.entityName}/dto/${relation.entityName}-response.dto.js`;
    imports.set(relatedClass, importPath);
  }
  return [...imports.entries()].sort(([left], [right]) =>
    left.localeCompare(right),
  );
}

function renderClass({
  className,
  entityName,
  modelName,
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
  const imports = dtoImports(properties, entityName, modelName, className);
  const lines = [
    `import { ${decorators.join(', ')} } from '@nestjs/swagger';`,
    ...imports.map(
      ([importName, importPath]) =>
        `import { ${importName} } from '${importPath}';`,
    ),
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

  if (additionalProperties) lines.push('  [key: string]: unknown;', '');
  lines.push('}', '');
  return lines.join('\n');
}

function prismaScalarType(property) {
  const [type] = scalarTypes(property);
  if (type === 'array' || type === 'object' || !type) return 'Json';
  if (type === 'string') return 'String';
  if (type === 'integer') return 'Int';
  if (type === 'number') return 'Float';
  if (type === 'boolean') return 'Boolean';
  throw new Error(
    `Unsupported JSON Schema type: ${JSON.stringify(property.type)}`,
  );
}

function relationName(modelName, propertyName) {
  return `${modelName}_${propertyName}`;
}

function extractInboundRelationBlocks(prismaSource, modelName) {
  const model = findModel(prismaSource, modelName);
  if (!model) return [];
  return [
    ...model.text.matchAll(
      /  \/\/ <generated:inverse ([^>]+)>[\s\S]*?  \/\/ <\/generated:inverse \1>/g,
    ),
  ]
    .filter((match) => !match[1].startsWith(`${modelName}_`))
    .map((match) => match[0]);
}

function renderPrismaModel(
  schema,
  modelName,
  sourcePath,
  relations,
  inboundBlocks,
) {
  const required = new Set(schema.required ?? []);
  const relationByProperty = new Map(
    relations.map((relation) => [relation.propertyName, relation]),
  );
  const fields = [];

  for (const [name, property] of Object.entries(schema.properties)) {
    const relation = relationByProperty.get(name);
    if (!relation) {
      const optional = required.has(name) && !isNullable(property) ? '' : '?';
      const id = name === 'id' ? ' @id' : '';
      fields.push(`  ${name} ${prismaScalarType(property)}${optional}${id}`);
      continue;
    }

    const namedRelation = relationName(modelName, name);
    if (relation.isArray) {
      fields.push(
        `  ${name} ${relation.modelName}[] @relation("${namedRelation}")`,
      );
      continue;
    }

    const candidateId = `${name}Id`;
    const candidateProperty = schema.properties[candidateId];
    const candidateMatches =
      candidateProperty &&
      !propertyRef(candidateProperty) &&
      scalarTypes(candidateProperty)[0] === 'string';
    const relationRequired = required.has(name) && !isNullable(property);
    const candidateRequired =
      candidateMatches &&
      required.has(candidateId) &&
      !isNullable(candidateProperty);
    const foreignKey =
      candidateMatches && candidateRequired === relationRequired
        ? candidateId
        : `${name}RelationId`;

    if (foreignKey !== candidateId) {
      fields.push(`  ${foreignKey} String${relationRequired ? '' : '?'}`);
    }
    fields.push(
      `  ${name} ${relation.modelName}${relationRequired ? '' : '?'} @relation("${namedRelation}", fields: [${foreignKey}], references: [id])`,
    );
  }

  if (schema.additionalProperties !== false && !schema.properties.extensions) {
    fields.push('  extensions Json?');
  }
  if (inboundBlocks.length) fields.push('', ...inboundBlocks);

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
    `// <generated:model ${escaped} source="[^"]+">[\\s\\S]*?// </generated:model ${escaped}>`,
  );

  // Replace in place so regeneration does not create noisy model-order diffs.
  if (block.test(prismaSource)) return prismaSource.replace(block, model);
  return `${prismaSource.trimEnd()}\n\n${model}\n`;
}

function findModel(prismaSource, modelName) {
  const match = new RegExp(`(^|\\n)model\\s+${modelName}\\s*\\{`).exec(
    prismaSource,
  );
  if (!match) return undefined;

  const start = match.index + match[1].length;
  const close = prismaSource.indexOf('\n}', start);
  if (close < 0) throw new Error(`Could not parse Prisma model ${modelName}.`);
  const end = close + 2;
  return { start, end, text: prismaSource.slice(start, end) };
}

function removeOutgoingInverseBlocks(prismaSource, modelName) {
  const escaped = modelName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return prismaSource.replace(
    new RegExp(
      `\\n?  // <generated:inverse ${escaped}_[^>]+>[\\s\\S]*?  // </generated:inverse ${escaped}_[^>]+>`,
      'g',
    ),
    '',
  );
}

function upsertInverseRelation(prismaSource, relation, sourceModelName) {
  const namedRelation = relationName(sourceModelName, relation.propertyName);
  const escapedRelation = namedRelation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  prismaSource = prismaSource.replace(
    new RegExp(
      `\\n?  // <generated:inverse ${escapedRelation}>[\\s\\S]*?  // </generated:inverse ${escapedRelation}>`,
    ),
    '',
  );
  const fieldName = `relationFrom${sourceModelName}${pascalCase(relation.propertyName)}`;
  const block = [
    `  // <generated:inverse ${namedRelation}>`,
    `  ${fieldName} ${sourceModelName}[] @relation("${namedRelation}")`,
    `  // </generated:inverse ${namedRelation}>`,
  ].join('\n');

  const target = findModel(prismaSource, relation.modelName);
  if (!target) {
    throw new Error(`Required Prisma model disappeared: ${relation.modelName}`);
  }
  const updatedTarget = `${target.text.slice(0, -2).trimEnd()}\n${block}\n}`;
  return (
    prismaSource.slice(0, target.start) +
    updatedTarget +
    prismaSource.slice(target.end)
  );
}

export function generateEntity(schemaPathInput, options = {}) {
  const schemaPath = resolveSchemaPath(schemaPathInput);
  const schema = readSchema(schemaPath);
  const entityName = kebabCase(basename(schemaPath, '.schema.json'));
  const modelName = pascalCase(schema.title || entityName);
  const dtoDir = join(apiRoot, 'src', entityName, 'dto');
  const required = new Set(schema.required ?? []);
  const relations = collectRelations(schema);
  let prismaSource = readFileSync(prismaSchemaPath, 'utf8');

  assertDependencies(prismaSource, relations, modelName);
  if (
    modelExists(prismaSource, modelName) &&
    !generatedModelExists(prismaSource, modelName)
  ) {
    throw new Error(
      `Prisma model ${modelName} already exists but is not managed by this generator. Refusing to overwrite it.`,
    );
  }

  const createProperties = Object.entries(schema.properties).filter(
    ([, property]) => !property.readOnly,
  );
  const responseProperties = Object.entries(schema.properties).filter(
    ([, property]) => !property.writeOnly,
  );
  const classOptions = {
    entityName,
    modelName,
    required,
    additionalProperties: schema.additionalProperties !== false,
  };

  const createDto = renderClass({
    ...classOptions,
    className: `Create${modelName}Dto`,
    properties: createProperties,
  });
  const responseDto = renderClass({
    ...classOptions,
    className: `${modelName}ResponseDto`,
    properties: responseProperties,
  });
  const updateDto = [
    `import { PartialType } from '@nestjs/swagger';`,
    `import { Create${modelName}Dto } from './create-${entityName}.dto.js';`,
    '',
    `export class Update${modelName}Dto extends PartialType(Create${modelName}Dto) {}`,
    '',
  ].join('\n');

  const inboundBlocks = extractInboundRelationBlocks(prismaSource, modelName);
  prismaSource = removeOutgoingInverseBlocks(prismaSource, modelName);
  const prismaModel = renderPrismaModel(
    schema,
    modelName,
    schemaPath,
    relations,
    inboundBlocks,
  );
  prismaSource = upsertPrismaModel(prismaSource, modelName, prismaModel);
  for (const relation of relations) {
    prismaSource = upsertInverseRelation(prismaSource, relation, modelName);
  }

  mkdirSync(dtoDir, { recursive: true });
  writeFileSync(join(dtoDir, `create-${entityName}.dto.ts`), createDto);
  writeFileSync(join(dtoDir, `update-${entityName}.dto.ts`), updateDto);
  writeFileSync(join(dtoDir, `${entityName}-response.dto.ts`), responseDto);
  writeFileSync(prismaSchemaPath, prismaSource);

  if (!options.skipPrismaGenerate) {
    execFileSync('pnpm', ['exec', 'prettier', '--write', dtoDir], {
      cwd: apiRoot,
      stdio: 'inherit',
    });
    execFileSync('pnpm', ['exec', 'prisma', 'format'], {
      cwd: apiRoot,
      stdio: 'inherit',
    });
    execFileSync('pnpm', ['exec', 'prisma', 'generate'], {
      cwd: apiRoot,
      stdio: 'inherit',
    });
  }

  return { schemaPath, dtoDir, modelName, prismaSchemaPath };
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
