import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { setupSwagger } from './openapi.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
    routeConflictPolicy: { duplicate: 'error', shadow: 'warn' },
    // routeResolutionStrategy: 'specificity',
  });
  app.enableShutdownHooks();
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
