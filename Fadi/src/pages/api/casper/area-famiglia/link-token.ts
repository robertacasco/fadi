import type { APIContext } from 'astro';

export const prerender = false;

const LINK_TOKEN_ENDPOINT = 'https://api.cas-per.it/api/v1/area-famiglia/auth/link-token';

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export async function POST(context: APIContext): Promise<Response> {
  let body: string;

  try {
    body = await context.request.text();
  } catch {
    return jsonResponse({ success: false, error: 'Richiesta non valida.' }, 400);
  }

  try {
    const upstream = await fetch(LINK_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': context.request.headers.get('Content-Type') || 'application/json',
      },
      body,
    });

    return new Response(await upstream.arrayBuffer(), {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return jsonResponse({
      success: false,
      error: 'Servizio temporaneamente non disponibile.',
    }, 502);
  }
}
