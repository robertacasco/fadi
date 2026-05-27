import type { APIContext } from 'astro';
import { applyRealtimeCacheHeaders, withRealtimeFetchOptions } from '../../../modules/necrologi-fiori-cordogli/api/cache-control';
import { getCasperApiKey } from '../../../modules/necrologi-fiori-cordogli/config';

export const prerender = false;

const CASPER_PUBLIC_API_BASE = 'https://api.cas-per.it/api/public/v1';

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });
  applyRealtimeCacheHeaders(headers);

  return new Response(JSON.stringify(body), {
    status,
    headers,
  });
}

function normalizePath(path: string | undefined): string {
  return String(path || '').replace(/^\/+|\/+$/g, '');
}

function isAllowedCasperRequest(method: string, path: string): boolean {
  const normalizedMethod = method.toUpperCase();

  if (normalizedMethod === 'POST') {
    return path === 'cordogli'
      || path === 'fotocordogli/albums/create'
      || /^fotocordogli\/albums\/\d+\/add-photo$/.test(path)
      || /^fotocordogli\/albums\/\d+\/finalize$/.test(path)
      || path === 'fotocordogli/verify';
  }

  if (normalizedMethod === 'GET') {
    return /^annunci\/\d+\/cordogli$/.test(path)
      || /^annunci\/\d+\/fotocordogli$/.test(path);
  }

  return false;
}

async function getForwardBody(request: Request): Promise<BodyInit | undefined> {
  if (request.method === 'GET' || request.method === 'HEAD') {
    return undefined;
  }

  const contentType = request.headers.get('Content-Type') || '';
  if (contentType.toLowerCase().startsWith('multipart/form-data')) {
    return request.formData();
  }

  return request.text();
}

export async function ALL(context: APIContext): Promise<Response> {
  const path = normalizePath(context.params.path);

  if (!isAllowedCasperRequest(context.request.method, path)) {
    return jsonResponse({ success: false, error: 'Endpoint non consentito.' }, 404);
  }

  const targetUrl = new URL(`${CASPER_PUBLIC_API_BASE}/${path}`);
  targetUrl.search = context.url.search;

  const requestContentType = context.request.headers.get('Content-Type') || '';
  const forwardHeaders = new Headers({
    'X-API-Key': getCasperApiKey(),
    'Accept': 'application/json',
  });

  if (requestContentType && !requestContentType.toLowerCase().startsWith('multipart/form-data')) {
    forwardHeaders.set('Content-Type', requestContentType);
  }

  try {
    const upstream = await fetch(targetUrl, withRealtimeFetchOptions({
      method: context.request.method,
      headers: forwardHeaders,
      body: await getForwardBody(context.request),
    }));

    const responseHeaders = new Headers({
      'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
    });
    applyRealtimeCacheHeaders(responseHeaders);

    return new Response(await upstream.arrayBuffer(), {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch {
    return jsonResponse({
      success: false,
      error: 'Servizio temporaneamente non disponibile.',
    }, 502);
  }
}
