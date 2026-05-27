import type {
  AnnuncioData,
  ApiResponse,
  CordogliApiResponse,
  CordoglioData,
  FioreData,
  FioriApiResponse,
  FotoCordogliApiResponse,
  FotoCordoglioAlbum
} from '../types';
import { applyCeremonyOverrides } from '../data/ceremony-overrides';
import { withRealtimeFetchOptions } from './cache-control';

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
    const res = await fetch(`${this.baseUrl}/annunci?limit=${limit}`, withRealtimeFetchOptions({
      headers: {
        'X-API-Key': this.apiKey,
        'Accept': 'application/json'
      }
    }));

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
    const res = await fetch(`${this.baseUrl}/fiori`, withRealtimeFetchOptions({
      headers: {
        'X-API-Key': this.apiKey,
        'Accept': 'application/json'
      }
    }));

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

  /**
   * Recupera i cordogli pubblici legati a un annuncio.
   */
  async getCordogli(annuncioId: number): Promise<CordoglioData[]> {
    const res = await fetch(`${this.baseUrl}/annunci/${annuncioId}/cordogli/`, withRealtimeFetchOptions({
      headers: {
        'X-API-Key': this.apiKey,
        'Accept': 'application/json'
      }
    }));

    if (!res.ok) {
      throw new Error(`Errore API cordogli: ${res.status} ${res.statusText}`);
    }

    const json: CordogliApiResponse = await res.json();
    const data = json.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.cordogli)) return data.cordogli;
    if (Array.isArray(json.cordogli)) return json.cordogli;

    return [];
  }

  /**
   * Recupera gli album di foto-cordogli pubblici legati a un annuncio.
   */
  async getFotocordogli(annuncioId: number): Promise<FotoCordoglioAlbum[]> {
    const res = await fetch(`${this.baseUrl}/annunci/${annuncioId}/fotocordogli/`, withRealtimeFetchOptions({
      headers: {
        'X-API-Key': this.apiKey,
        'Accept': 'application/json'
      }
    }));

    if (!res.ok) {
      throw new Error(`Errore API foto-cordogli: ${res.status} ${res.statusText}`);
    }

    const json: FotoCordogliApiResponse = await res.json();
    const data = json.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.albums)) return data.albums;
    if (Array.isArray(json.albums)) return json.albums;

    return [];
  }
}
