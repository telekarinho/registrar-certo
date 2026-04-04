// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FeatureFlag {
  id: string;
  key: string;
  enabled: boolean;
  description: string | null;
  allowedRoles: string[];
  allowedUserIds: string[];
  rolloutPercentage: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// In-memory cache (replaces Redis)
// ---------------------------------------------------------------------------

const cache = new Map<string, { value: string; expiresAt: number }>();

function cacheGet(key: string): string | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { cache.delete(key); return null; }
  return entry.value;
}

function cacheSet(key: string, value: string, ttlSeconds: number): void {
  cache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

const FLAG_CACHE_TTL = 300;
const CACHE_PREFIX = 'ff:';

// ---------------------------------------------------------------------------
// In-memory default flags
// ---------------------------------------------------------------------------

const defaultFlags: FeatureFlag[] = [
  {
    id: 'flag-1',
    key: 'inpi_search_enabled',
    enabled: false,
    description: 'Habilita busca INPI via microservico',
    allowedRoles: [],
    allowedUserIds: [],
    rolloutPercentage: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const flagStore = [...defaultFlags];

// ---------------------------------------------------------------------------
// Feature flag utility
// ---------------------------------------------------------------------------

export async function isEnabled(flagKey: string, _userId?: string): Promise<boolean> {
  try {
    const flag = await getFlag(flagKey);
    if (!flag) return false;
    return flag.enabled;
  } catch {
    return false;
  }
}

export async function getAllFlags(): Promise<FeatureFlag[]> {
  return [...flagStore];
}

export async function toggleFlag(flagId: string, enabled: boolean): Promise<FeatureFlag> {
  const flag = flagStore.find((f) => f.id === flagId);
  if (!flag) throw new Error('Flag not found');
  flag.enabled = enabled;
  flag.updatedAt = new Date();
  cache.delete(`${CACHE_PREFIX}${flag.key}`);
  return { ...flag };
}

export async function updateFlag(
  flagId: string,
  updates: {
    enabled?: boolean;
    allowedRoles?: string[];
    allowedUserIds?: string[];
    rolloutPercentage?: number | null;
    description?: string;
  },
): Promise<FeatureFlag> {
  const flag = flagStore.find((f) => f.id === flagId);
  if (!flag) throw new Error('Flag not found');
  Object.assign(flag, updates, { updatedAt: new Date() });
  cache.delete(`${CACHE_PREFIX}${flag.key}`);
  return { ...flag };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function getFlag(flagKey: string): Promise<FeatureFlag | null> {
  const cacheKey = `${CACHE_PREFIX}${flagKey}`;
  const cached = cacheGet(cacheKey);
  if (cached) return JSON.parse(cached) as FeatureFlag;

  const flag = flagStore.find((f) => f.key === flagKey) ?? null;
  if (flag) {
    cacheSet(cacheKey, JSON.stringify(flag), FLAG_CACHE_TTL);
  }
  return flag;
}
