import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const tokensPenPath = path.join(rootDir, 'design', 'design-system.lib.pen');
const indexCssPath = path.join(rootDir, 'src', 'index.css');

const cssHeader = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap');
@import 'tailwindcss';

`;

const cssFooter = `

@import './custom.css';
`;

interface DesignToken {
  type: string;
  value: unknown;
}

interface TokenDocument {
  variables?: Record<string, DesignToken>;
}

function formatTokenValue(name: string, token: DesignToken) {
  if (token.type === 'number') {
    // Match CSS units to the token category while keeping the token names unchanged.
    if (/^duration-/.test(name)) return `${token.value}ms`;
    if (/^(font-weight|line-height)-/.test(name)) return String(token.value);
    if (
      /^(spacing-|radius-|font-size-|border-width-|button-.*-padding-|card-padding$|input-padding$|layout-max-width$)/.test(
        name
      )
    ) {
      return `${token.value}px`;
    }

    return String(token.value);
  }

  return String(token.value);
}

function buildThemeBlock(variables: Record<string, DesignToken>) {
  const lines = Object.entries(variables)
    .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
    .map(([name, token]) => `  --${name}: ${formatTokenValue(name, token)};`);

  return `@theme {\n${lines.join('\n')}\n}`;
}

async function main() {
  const tokensPenContent = await readFile(tokensPenPath, 'utf8');
  const { variables } = JSON.parse(tokensPenContent) as TokenDocument;

  if (!variables || typeof variables !== 'object') {
    throw new Error('No variables found in design/design-system.lib.pen');
  }

  const cssOutput = `${cssHeader}${buildThemeBlock(variables)}${cssFooter}`;
  await writeFile(indexCssPath, cssOutput, 'utf8');

  process.stdout.write(
    `Generated ${path.relative(rootDir, indexCssPath)} from ${path.relative(rootDir, tokensPenPath)}\n`
  );
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
