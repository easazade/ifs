import { defineConfig } from 'orval';

export default defineConfig({
  prototype: {
    input: { target: '../prototype-api/openapi.json' },
    output: {
      target: './src/generated/api.ts',
      client: 'fetch',
      mode: 'single',
      formatter: 'prettier',
      baseUrl: {
        runtime: 'getApiBaseUrl()',
        imports: [{ name: 'getApiBaseUrl', importPath: '../config.js' }],
      },
      override: {
        fetch: { includeHttpResponseReturnType: true },
      },
    },
  },
});
