import { readFile, writeFile } from 'node:fs/promises';
import { defineConfig } from 'orval';

export default defineConfig({
  prototype: {
    hooks: {
      afterAllFilesWrite: async (paths: unknown) => {
        if (!Array.isArray(paths))
          throw new Error('Expected generated file paths.');
        // Orval 8.35 encodes every interpolation, including the runtime base URL.
        // Keep path-parameter encoding but restore the base URL expression.
        for (const path of paths.filter(
          (path: unknown): path is string =>
            typeof path === 'string' && path.endsWith('.ts'),
        )) {
          const source = await readFile(path, 'utf8');
          await writeFile(
            path,
            source.replaceAll(
              'encodeURIComponent(String(getApiBaseUrl()))',
              'getApiBaseUrl()',
            ),
          );
        }
      },
    },
    input: { target: '../prototype-api/openapi.json' },
    output: {
      target: './src/generated/api.ts',
      client: 'fetch',
      mode: 'single',
      urlEncodeParameters: true,
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
