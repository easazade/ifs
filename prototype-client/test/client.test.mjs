import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { after, before, test } from 'node:test';
import {
  createRelationship,
  updateRelationship,
  listMemberRelations,
  getApiBaseUrl,
  getGetHelloUrl,
  getHello,
  setApiBaseUrl,
} from '../dist/index.js';

let server;
let baseUrl;
let lastRequest;

before(async () => {
  server = createServer(async (request, response) => {
    lastRequest = {
      url: request.url,
      method: request.method,
      headers: request.headers,
    };
    if (request.url.startsWith('/members/')) {
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end(
        JSON.stringify([
          {
            id: 'Relationship/client',
            sourceId: 'Organization/1',
            targetId: 'Member/1',
          },
        ]),
      );
      return;
    }
    if (request.url.startsWith('/relationships')) {
      let body = '';
      for await (const chunk of request) body += chunk;
      lastRequest.body = JSON.parse(body);
      response.writeHead(request.method === 'POST' ? 201 : 200, {
        'content-type': 'application/json',
      });
      response.end(body);
      return;
    }
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

test('relationship client keeps public endpoints and encodes canonical IDs', async () => {
  setApiBaseUrl(baseUrl);
  const edge = {
    id: 'Relationship/client',
    sourceId: 'Organization/1',
    targetId: 'Member/1',
    relationshipTypeId: 'RelationshipType/1',
    type: 'has member',
    inverseType: 'member of',
  };
  const created = await createRelationship(edge);
  assert.equal(created.status, 201);
  assert.deepEqual(created.data, edge);
  assert.deepEqual(lastRequest.body, edge);
  assert.ok(!Object.hasOwn(lastRequest.body, 'in'));
  assert.ok(!Object.hasOwn(lastRequest.body, 'out'));
  const updated = await updateRelationship(edge.id, { endedAt: '2026-02-01' });
  assert.equal(updated.status, 200);
  assert.equal(lastRequest.method, 'PATCH');
  assert.equal(lastRequest.url, '/relationships/Relationship%2Fclient');
  assert.deepEqual(lastRequest.body, { endedAt: '2026-02-01' });
});

test('queries associated relationships through the public module with encoded filters', async () => {
  setApiBaseUrl(baseUrl);
  const filter = JSON.stringify({
    type: 'has member',
    'in.name': 'A & B',
    'out.id': 'Member/1',
  });
  const result = await listMemberRelations('Member/1', {
    direction: 'incoming',
    filter,
  });
  assert.equal(result.status, 200);
  assert.equal(result.data[0].id, 'Relationship/client');
  assert.equal(lastRequest.method, 'GET');
  const url = new URL(lastRequest.url, baseUrl);
  assert.equal(url.pathname, '/members/Member%2F1/relations');
  assert.equal(url.searchParams.get('direction'), 'incoming');
  assert.equal(url.searchParams.get('filter'), filter);
});

test('passes AbortSignal through to fetch', async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(getHello({ signal: controller.signal }), {
    name: 'AbortError',
  });
});
