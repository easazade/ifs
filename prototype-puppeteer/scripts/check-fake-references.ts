// Checks fixture module exports for references that do not point to known canonical identities.
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// References use the IFS format EntityType/id (not URLs or filesystem paths).
const referencePattern = /^[A-Z][A-Za-z0-9]*\/[^/\s]+$/;

type FixtureModule = { file: string; exports: Record<string, unknown> };
type Reference = { value: string; location: string };

export function checkReferences(modules: FixtureModule[]): {
  identities: Set<string>;
  references: Reference[];
  missing: Reference[];
} {
  const identities = new Set<string>();
  const references: Reference[] = [];

  function visit(value: unknown, location: string, ancestors: Set<object>): void {
    if (typeof value === 'string') {
      if (referencePattern.test(value)) references.push({ value, location });
      return;
    }
    if (value === null || typeof value !== 'object' || ancestors.has(value)) return;
    const nextAncestors = new Set(ancestors).add(value);
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, `${location}[${index}]`, nextAncestors));
      return;
    }

    const object = value as Record<string, unknown>;
    const hasIdentity =
      typeof object.entityType === 'string' && typeof object.id === 'string' && referencePattern.test(object.id);
    if (hasIdentity) identities.add(object.id as string);
    for (const [key, item] of Object.entries(object)) {
      // A canonical entity id declares identity; id fields on other objects may be references.
      if (key !== 'id' || !hasIdentity) visit(item, `${location}.${key}`, nextAncestors);
    }
  }

  for (const module of modules) {
    for (const [name, value] of Object.entries(module.exports)) {
      visit(value, `${module.file}:${name}`, new Set());
    }
  }
  return {
    identities,
    references,
    missing: references.filter((reference) => !identities.has(reference.value)),
  };
}

async function findModules(directory: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await findModules(file)));
    else if (entry.isFile() && /\.(?:ts|js|mts|mjs)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      files.push(file);
    }
  }
  return files.sort();
}

async function main(): Promise<void> {
  const projectDirectory = fileURLToPath(new URL('../', import.meta.url));
  const fakeDirectory = path.join(projectDirectory, 'src/fake');
  const modules: FixtureModule[] = [];
  for (const file of await findModules(fakeDirectory)) {
    modules.push({
      file: path.relative(projectDirectory, file),
      exports: (await import(pathToFileURL(file).href)) as Record<string, unknown>,
    });
  }
  const result = checkReferences(modules);
  for (const reference of result.missing) {
    console.error(`${reference.location}: missing ${reference.value}`);
  }
  console.log(
    `Checked ${modules.length} fake modules, ${result.identities.size} identities, ` +
      `${result.references.length} references: ${result.missing.length} missing.`
  );
  if (result.missing.length > 0) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
