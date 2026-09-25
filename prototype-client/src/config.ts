// The prototype's Vite dev server proxies /api to the Nest backend.
let apiBaseUrl = '/api';

/** Configure once at application startup; use an absolute URL in Node.js. */
export function setApiBaseUrl(baseUrl: string): void {
  apiBaseUrl = baseUrl.replace(/\/+$/, '');
}

export function getApiBaseUrl(): string {
  return apiBaseUrl;
}
