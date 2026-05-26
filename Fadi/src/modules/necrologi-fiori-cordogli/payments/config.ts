export type FioriPaymentMethod = 'consegna' | 'online';

export interface PaymentRuntimeConfig {
  onlineEnabled: boolean;
  provider: string;
  webhookSecret: string;
  casperPaymentStatusEndpoint: string;
}

function readEnv(name: string): string {
  return import.meta.env[name] || '';
}

export function getPaymentRuntimeConfig(): PaymentRuntimeConfig {
  return {
    onlineEnabled: readEnv('FIORI_ONLINE_PAYMENTS_ENABLED') === 'true',
    provider: readEnv('FIORI_PAYMENT_PROVIDER'),
    webhookSecret: readEnv('FIORI_PAYMENT_WEBHOOK_SECRET'),
    casperPaymentStatusEndpoint: readEnv('CASPER_PAYMENT_STATUS_ENDPOINT'),
  };
}

export function isPublicOnlinePaymentEnabled(): boolean {
  return import.meta.env.PUBLIC_FIORI_ONLINE_PAYMENTS_ENABLED === 'true';
}
