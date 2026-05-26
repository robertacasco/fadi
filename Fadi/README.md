# FADI

Sito Astro definitivo per Onoranze Funebri FADI.

## Struttura

```text
Fadi/
├── public/                         # asset statici pubblici
├── src/
│   ├── components/                 # componenti del sito FADI
│   ├── layouts/                    # layout condivisi
│   ├── modules/
│   │   └── necrologi-fiori-cordogli/
│   │       ├── api/                # client CasPer
│   │       ├── components/         # lista, dettaglio, cordogli, fiori
│   │       ├── types/              # tipi TypeScript del modulo
│   │       ├── utils/              # formattatori e helper immagini
│   │       └── config.ts           # lettura variabili ambiente CasPer
│   └── pages/                      # rotte Astro
├── tools/casper-research/          # script di analisi usati durante il test
├── .env.example                    # template variabili ambiente
├── astro.config.mjs
├── package.json
└── vercel.json
```

Il modulo `src/modules/necrologi-fiori-cordogli/` è la parte copiabile per il prossimo sito: contiene integrazione CasPer, necrologi, cordogli, foto-cordogli e form fiori.

## Setup

Richiede Node.js `>=22.12.0`.

```sh
cd Fadi
npm install
cp .env.example .env
npm run dev
```

Imposta le variabili:

```env
CASPER_API_KEY=...
PUBLIC_CASPER_API_KEY=...
```

`CASPER_API_KEY` viene usata lato server. `PUBLIC_CASPER_API_KEY` serve finché alcuni form client-side inviano direttamente a CasPer; per nascondere del tutto la chiave, il prossimo passo è creare endpoint server Astro che facciano da proxy ai POST dei form.

## Build

```sh
npm run build
npm run preview
```
