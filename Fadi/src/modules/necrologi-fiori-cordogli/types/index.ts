export interface Defunto {
  nome?: string;
  cognome?: string;
  data_nascita?: string; // YYYY-MM-DD
  data_morte?: string;   // YYYY-MM-DD
  foto_url?: string;
}

export interface Annuncio {
  paese?: string;
  epigrafe_url?: string;
}

export interface Funerale {
  data_ora?: string;
  luogo?: string;
  indirizzo?: string;
  comune?: string;
  link_maps?: string;
}

export interface Rosario {
  data_ora?: string;
  luogo?: string;
  indirizzo?: string;
  comune?: string;
  link_maps?: string;
}

export interface Sepoltura {
  data_ora?: string;
  luogo?: string;
  indirizzo?: string;
  comune?: string;
  link_maps?: string;
}

export interface LuogoRiposo {
  data_ora_da?: string;
  data_ora_a?: string;
  luogo?: string;
  indirizzo?: string;
  comune?: string;
  link_maps?: string;
}

export interface Streaming {
  url?: string;
  url_video?: string;
}

export interface Messaggio {
  id: number;
  mittente: string;
  testo: string;
  data_creazione: string;
  stato?: string;
}

export interface AnnuncioData {
  id: number;
  slug: string;
  nominativo: string;
  defunto: Defunto;
  annuncio: Annuncio;
  funerale: Funerale;
  rosario: Rosario;
  sepoltura: Sepoltura;
  luogo_riposo: LuogoRiposo;
  streaming: Streaming;
  messaggi?: Messaggio[];
  updated_at?: string;
}

export interface ApiResponse {
  data: AnnuncioData[];
}
