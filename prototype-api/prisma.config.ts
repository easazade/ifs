import { defineConfig } from 'prisma/config';
import { getDatabaseUrl } from './src/prisma/database.config.js';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});
