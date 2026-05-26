import { getCasperApiKey } from '../config';
import { getPaymentRuntimeConfig } from './config';

export interface CasperPaymentStatusUpdate {
  casperOrderId: string;
  status: 'paid' | 'failed' | 'cancelled' | 'refunded' | 'pending';
  provider: string;
  providerPaymentId?: string;
  providerSessionId?: string;
  amount?: number;
  paidAt?: string;
  rawEventId?: string;
}

export async function syncPaymentStatusWithCasper(update: CasperPaymentStatusUpdate): Promise<void> {
  const { casperPaymentStatusEndpoint } = getPaymentRuntimeConfig();

  if (!casperPaymentStatusEndpoint) {
    console.info('CASPER_PAYMENT_STATUS_ENDPOINT non configurato; aggiornamento pagamento non inviato.', update);
    return;
  }

  const endpoint = casperPaymentStatusEndpoint.replace('{orderId}', encodeURIComponent(update.casperOrderId));
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'X-API-Key': getCasperApiKey(),
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(update),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Errore sync pagamento Cas-Per: ${response.status} ${body}`);
  }
}
