import type { APIContext } from 'astro';
import { verifyGenericWebhookSignature } from '../../../modules/necrologi-fiori-cordogli/payments/provider';
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
  const signature = context.request.headers.get('x-fadi-payment-signature') || '';

  if (!verifyGenericWebhookSignature(rawBody, signature)) {
    return jsonResponse({ success: false, error: 'Firma webhook non valida.' }, 401);
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ success: false, error: 'Payload webhook non valido.' }, 400);
  }

  const casperOrderId = String(event?.metadata?.casper_order_id || event?.casper_order_id || '');
  if (!casperOrderId) {
    return jsonResponse({ success: false, error: 'Ordine Cas-Per mancante.' }, 400);
  }

  await syncPaymentStatusWithCasper({
    casperOrderId,
    status: event?.status || 'pending',
    provider: event?.provider || 'generic',
    providerPaymentId: event?.payment_id,
    providerSessionId: event?.session_id,
    amount: event?.amount,
    paidAt: event?.paid_at,
    rawEventId: event?.id,
  });

  return jsonResponse({ success: true });
}
