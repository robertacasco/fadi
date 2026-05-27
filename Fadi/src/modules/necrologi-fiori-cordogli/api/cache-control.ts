export const REALTIME_CACHE_CONTROL = 'private, no-store, max-age=0, must-revalidate';
export const REALTIME_EDGE_CACHE_CONTROL = 'no-store';

export function applyRealtimeCacheHeaders(headers: Headers): void {
  headers.set('Cache-Control', REALTIME_CACHE_CONTROL);
  headers.set('CDN-Cache-Control', REALTIME_EDGE_CACHE_CONTROL);
  headers.set('Vercel-CDN-Cache-Control', REALTIME_EDGE_CACHE_CONTROL);
}

export function withRealtimeFetchOptions(init: RequestInit = {}): RequestInit {
  const headers = new Headers(init.headers);
  headers.set('Cache-Control', 'no-cache');
  headers.set('Pragma', 'no-cache');

  return {
    ...init,
    cache: 'no-store',
    headers,
  };
}
