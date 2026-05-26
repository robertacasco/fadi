import type { APIContext } from 'astro';
import { parsePaymentWebhookEvent } from '../../../modules/necrologi-fiori-cordogli/payments/provider';
import { syncPaymentStatusWithCasper } from '../../../modules/necrologi-fiori-cordogli/payments/casper-sync';

export const prerender = false;

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
  const rawBody = await context.request.text();

  try {
    const update = parsePaymentWebhookEvent(rawBody, context.request.headers);
    await syncPaymentStatusWithCasper(update);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook pagamento non valido.';
    return jsonResponse({ success: false, error: message }, 400);
  }

  return jsonResponse({ success: true });
}
