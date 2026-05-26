const casperApiKey = import.meta.env.CASPER_API_KEY || import.meta.env.PUBLIC_CASPER_API_KEY;

export function getCasperApiKey(): string {
  if (!casperApiKey) {
    throw new Error(
      'Configura CASPER_API_KEY oppure PUBLIC_CASPER_API_KEY nelle variabili ambiente.'
    );
  }

  return casperApiKey;
}
