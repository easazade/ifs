import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "../..");
const entitiesDirectory = path.join(repositoryRoot, "ifs-standards/src/entities");
const outputFile = path.join(repositoryRoot, "prototype-puppeteer/src/game/api.ts");

const entityDirectories = await readdir(entitiesDirectory, { withFileTypes: true });
const entities = await Promise.all(
  entityDirectories
    .filter((entry) => entry.isDirectory())
    .map(async (entry) => {
      const schemaPath = path.join(entitiesDirectory, entry.name, `${entry.name}.schema.json`);
      const schema = JSON.parse(await readFile(schemaPath, "utf8")) as { title?: string };
      if (!schema.title || !/^[A-Z][A-Za-z0-9]*$/.test(schema.title)) {
        throw new Error(`Invalid or missing entity title in ${schemaPath}`);
      }
      return schema.title;
    }),
);
entities.sort((left, right) => left.localeCompare(right));

const imports = entities.flatMap((entity) => {
  return [
    `  create${entity},`,
    `  delete${entity},`,
    `  get${entity},`,
    `  list${entity}s,`,
    `  update${entity},`,
    `  type Create${entity}Dto,`,
    `  type Update${entity}Dto,`,
    `  type ${entity}ResponseDto,`,
  ];
});

const methods = entities.flatMap((entity) => {
  return [
    `  async create${entity}(input: Create${entity}Dto): Promise<${entity}ResponseDto | void> {\n    const response = await create${entity}(input);\n    return response.data;\n  }`,
    `  async list${entity}s(): Promise<${entity}ResponseDto[]> {\n    const response = await list${entity}s();\n    return response.data;\n  }`,
    `  async get${entity}(id: string): Promise<${entity}ResponseDto | void> {\n    const response = await get${entity}(id);\n    return response.data;\n  }`,
    `  async update${entity}(id: string, input: Update${entity}Dto): Promise<${entity}ResponseDto | void> {\n    const response = await update${entity}(id, input);\n    return response.data;\n  }`,
    `  async delete${entity}(id: string): Promise<void> {\n    await delete${entity}(id);\n  }`,
  ];
});

const source = `import {\n${imports.join("\n")}\n} from "prototype-client";\n\nexport class Api {\n${methods.join("\n\n")}\n}\n`;
await writeFile(outputFile, source);
console.log(`Generated ${path.relative(repositoryRoot, outputFile)} for ${entities.length} entities.`);
