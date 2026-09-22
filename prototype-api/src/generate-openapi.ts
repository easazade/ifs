import { writeFile } from 'node:fs/promises';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { createOpenApiDocument } from './openapi.js';

// Run the Nest-compiled entry point so the Swagger CLI plugin metadata is present.
const app = await NestFactory.create(AppModule, { logger: false });
try {
  // Do not call init/listen: schema export needs neither a port nor a DB connection.
  const document = createOpenApiDocument(app);
  const target = new URL('../openapi.json', import.meta.url);
  await writeFile(target, `${JSON.stringify(document, null, 2)}\n`);
  console.log(`OpenAPI written to ${target.pathname}`);
} finally {
  await app.close();
}
