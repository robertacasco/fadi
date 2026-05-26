import { createHmac, timingSafeEqual } from 'node:crypto';
import { getPaymentRuntimeConfig } from './config';

export interface CheckoutSessionRequest {
  casperOrderId?: string;
  amount: number;
  currency: 'EUR';
  description: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  metadata: Record<string, string>;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResponse {
  provider: string;
  checkoutUrl: string;
  sessionId: string;
}

export function onlinePaymentsAreConfigured(): boolean {
  const config = getPaymentRuntimeConfig();
  return config.onlineEnabled && Boolean(config.provider);
}

export async function createCheckoutSession(_request: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
  const config = getPaymentRuntimeConfig();

  if (!onlinePaymentsAreConfigured()) {
    throw new Error('Il pagamento online non e ancora configurato.');
  }

  throw new Error(`Provider pagamento "${config.provider}" non implementato in questa installazione.`);
}

export function verifyGenericWebhookSignature(rawBody: string, signature: string): boolean {
  const { webhookSecret } = getPaymentRuntimeConfig();
  if (!webhookSecret || !signature) return false;

  const digest = createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
  const expected = Buffer.from(digest, 'utf8');
  const received = Buffer.from(signature, 'utf8');

  return expected.length === received.length && timingSafeEqual(expected, received);
}
