declare const process: {
  env?: {
    CASPER_API_KEY?: string;
  };
} | undefined;

export function getCasperApiKey(): string {
  const casperApiKey = typeof process !== 'undefined'
    ? process.env?.CASPER_API_KEY
    : undefined;

  if (!casperApiKey) {
    throw new Error(
      'Configura CASPER_API_KEY nelle variabili ambiente.'
    );
  }

  return casperApiKey;
}
