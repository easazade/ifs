#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const apiRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const workspaceRoot = resolve(apiRoot, '..');
const generationOrderPath = join(
  workspaceRoot,
  'ifs-standards',
  'scripts',
  'generate-order.json',
);
const generatorPath = join(apiRoot, 'scripts', 'generate-entity.mjs');

function readGenerationOrder() {
  let generationOrder;

  try {
    generationOrder = JSON.parse(readFileSync(generationOrderPath, 'utf8'));
  } catch (error) {
    throw new Error(
      `Could not read ${generationOrderPath}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (
    !Array.isArray(generationOrder) ||
    generationOrder.length === 0 ||
    generationOrder.some(
      (entity) => typeof entity !== 'string' || entity.trim() === '',
    )
  ) {
    throw new Error(
      'Generation order must be a non-empty array of entity names.',
    );
  }

  const duplicate = generationOrder.find(
    (entity, index) => generationOrder.indexOf(entity) !== index,
  );
  if (duplicate) {
    throw new Error(`Generation order contains duplicate entity: ${duplicate}`);
  }

  return generationOrder;
}

try {
  const generationOrder = readGenerationOrder();

  for (const [index, entity] of generationOrder.entries()) {
    console.log(
      `\n[${index + 1}/${generationOrder.length}] Generating ${entity}...`,
    );
    execFileSync(process.execPath, [generatorPath, entity], {
      cwd: apiRoot,
      stdio: 'inherit',
    });
  }

  console.log(`\nGenerated ${generationOrder.length} entities in order.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
