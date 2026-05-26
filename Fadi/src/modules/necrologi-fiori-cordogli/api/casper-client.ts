import type { AnnuncioData, ApiResponse, FioreData, FioriApiResponse } from '../types';
import { applyCeremonyOverrides } from '../data/ceremony-overrides';

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
    return (json.data || []).map(applyCeremonyOverrides);
  }

  /**
   * Recupera un singolo annuncio basato sullo slug.
   * @param slug Lo slug dell'annuncio
   */
  async getAnnuncioBySlug(slug: string): Promise<AnnuncioData | null> {
    const annunci = await this.getAnnunci();
    return annunci.find(item => item.slug === slug) || null;
  }

  /**
   * Recupera il catalogo fiori pubblico dell'impresa.
   */
  async getFiori(): Promise<FioreData[]> {
    const res = await fetch(`${this.baseUrl}/fiori`, {
      headers: {
        'X-API-Key': this.apiKey,
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`Errore API fiori: ${res.status} ${res.statusText}`);
    }

    const json: FioriApiResponse = await res.json();
    const data = json.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.fiori)) return data.fiori;
    if (Array.isArray(json.fiori)) return json.fiori;

    return [];
  }
}
