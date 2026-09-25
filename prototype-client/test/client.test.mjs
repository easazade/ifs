import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { after, before, test } from 'node:test';
import {
  getApiBaseUrl,
  getGetHelloUrl,
  getHello,
  setApiBaseUrl,
} from '../dist/index.js';

let server;
let baseUrl;
let lastRequest;

before(async () => {
  server = createServer((request, response) => {
    lastRequest = {
      url: request.url,
      method: request.method,
      headers: request.headers,
    };
    response.writeHead(200, { 'content-type': 'text/plain' });
    response.end('Hello World!');
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  setApiBaseUrl('/api');
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});

test('defaults to the browser /api proxy', () => {
  assert.equal(getApiBaseUrl(), '/api');
  assert.equal(getGetHelloUrl(), '/api/');
});

test('imports as ESM and fetches plain text with runtime configuration', async () => {
  setApiBaseUrl(`${baseUrl}/`);
  assert.equal(getGetHelloUrl(), `${baseUrl}/`);
  const response = await getHello({ headers: { 'x-client-test': 'yes' } });
  assert.equal(response.status, 200);
  assert.equal(response.data, 'Hello World!');
  assert.equal(response.headers.get('content-type'), 'text/plain');
  assert.equal(lastRequest.method, 'GET');
  assert.equal(lastRequest.url, '/');
  assert.equal(lastRequest.headers['x-client-test'], 'yes');
});

test('passes AbortSignal through to fetch', async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(getHello({ signal: controller.signal }), {
    name: 'AbortError',
  });
});
