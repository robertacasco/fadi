import type { AnnuncioData, Funerale, LuogoRiposo, Rosario, Sepoltura } from '../types';

type CeremonyOverride = {
  funerale?: Partial<Funerale>;
  rosario?: Partial<Rosario>;
  sepoltura?: Partial<Sepoltura>;
  luogo_riposo?: Partial<LuogoRiposo>;
};

const ceremonyOverrides: Record<string, CeremonyOverride> = {
  'salvatore-raffaele': {
    funerale: {
      data_ora: '2026-01-02T15:30:00+01:00',
      luogo: 'Chiesa di Santa Maria dei Latini',
      comune: 'Acquaro'
    }
  }
};

function fillMissingFields<T extends Record<string, unknown>>(
  current: T | undefined,
  override: Partial<T> | undefined
): T {
  const merged = { ...(current || {}) } as T;

  if (!override) return merged;

  for (const [key, value] of Object.entries(override)) {
    if (value === undefined || value === null || value === '') continue;
    const currentValue = merged[key as keyof T];
    if (currentValue === undefined || currentValue === null || currentValue === '') {
      merged[key as keyof T] = value as T[keyof T];
    }
  }

  return merged;
}

export function applyCeremonyOverrides(item: AnnuncioData): AnnuncioData {
  const override = ceremonyOverrides[item.slug];
  if (!override) return item;

  return {
    ...item,
    funerale: fillMissingFields(item.funerale, override.funerale),
    rosario: fillMissingFields(item.rosario, override.rosario),
    sepoltura: fillMissingFields(item.sepoltura, override.sepoltura),
    luogo_riposo: fillMissingFields(item.luogo_riposo, override.luogo_riposo)
  };
}
