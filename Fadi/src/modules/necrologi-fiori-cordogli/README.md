# Modulo necrologi, fiori e cordogli

Modulo Astro copiabile per integrare CasPer in un sito di onoranze funebri.

## Cosa contiene

- `api/casper-client.ts`: client per gli annunci CasPer.
- `config.ts`: lettura di `CASPER_API_KEY` e `PUBLIC_CASPER_API_KEY`.
- `types/`: tipi TypeScript per annunci, defunti, cerimonie e messaggi.
- `utils/formatters.ts`: formattazione date/orari e URL foto con cache-buster.
- `components/CasperNecrologiList.astro`: lista annunci con ricerca, filtri e paginazione.
- `components/CasperAnnuncioCard.astro`: card annuncio.
- `components/CasperMemorialPage.astro`: wrapper pagina dettaglio con messaggi, foto, cordogli e fiori.
- `components/CasperMemorialDetails.astro`: dettaglio manifesto/cerimonie.
- `components/CasperMessagesList.astro`: area messaggi e foto ricevuti.
- `components/CasperCondolenceForms.astro`: form cordoglio, foto-cordoglio e ordine fiori.

## Come riusarlo

1. Copia `src/modules/necrologi-fiori-cordogli/` nel nuovo progetto Astro.
2. Definisci le variabili ambiente:

```env
CASPER_API_KEY=...
PUBLIC_CASPER_API_KEY=...
```

3. Crea le rotte `/necrologi/` e `/necrologi/[slug]/` importando client e componenti dal modulo.

Pagina lista:

```astro
---
import { CasperClient } from '../../modules/necrologi-fiori-cordogli/api/casper-client';
import { getCasperApiKey } from '../../modules/necrologi-fiori-cordogli/config';
import CasperNecrologiList from '../../modules/necrologi-fiori-cordogli/components/CasperNecrologiList.astro';

export const prerender = false;

const client = new CasperClient(getCasperApiKey());
const annunci = await client.getAnnunci(200);
---

<CasperNecrologiList annunci={annunci} />
```

Pagina dettaglio:

```astro
---
import { CasperClient } from '../../modules/necrologi-fiori-cordogli/api/casper-client';
import { getCasperApiKey } from '../../modules/necrologi-fiori-cordogli/config';
import CasperMemorialPage from '../../modules/necrologi-fiori-cordogli/components/CasperMemorialPage.astro';

export const prerender = false;

const slug = Astro.params.slug;
const apiKey = getCasperApiKey();
const client = new CasperClient(apiKey);
const item = slug ? await client.getAnnuncioBySlug(slug) : null;

if (!item || !slug) return Astro.redirect('/404');
---

<CasperMemorialPage item={item} apiKey={apiKey} slug={slug} />
```

## Nota sicurezza

Le chiamate SSR usano `CASPER_API_KEY`. Alcuni form browser-side usano ancora `PUBLIC_CASPER_API_KEY`, quindi la chiave è visibile nel bundle. Per una versione più riservata, crea endpoint server Astro per cordogli, foto-cordogli e verifica OTP e rimuovi la chiave dal client.
