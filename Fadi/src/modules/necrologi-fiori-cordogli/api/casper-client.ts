import type { AnnuncioData, ApiResponse } from '../types';

export class CasperClient {
  private apiKey: string;
  private baseUrl = 'https://api.cas-per.it/api/public/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Recupera tutti gli annunci.
   * @param limit Limite massimo di risultati (default: 200)
   */
  async getAnnunci(limit: number = 200): Promise<AnnuncioData[]> {
    try {
      const res = await fetch(`${this.baseUrl}/annunci?limit=${limit}`, {
        headers: {
          'X-API-Key': this.apiKey,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) {
        throw new Error(`Errore API: ${res.status} ${res.statusText}`);
      }
      const json: ApiResponse = await res.json();
      return json.data || [];
    } catch (err) {
      console.error('Error fetching annunci:', err);
      return [];
    }
  }

  /**
   * Recupera un singolo annuncio basato sullo slug.
   * @param slug Lo slug dell'annuncio
   */
  async getAnnuncioBySlug(slug: string): Promise<AnnuncioData | null> {
    const annunci = await this.getAnnunci();
    return annunci.find(item => item.slug === slug) || null;
  }
}
