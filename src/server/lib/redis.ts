/**
 * In-memory cache utility (replaces Redis).
 * Data resets on server restart — intentional for the DB-free demo.
 */

const store = new Map<string, { value: string; expiresAt: number }>();

/** Cache helper with TTL */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { store.delete(key); return null; }
  return JSON.parse(entry.value) as T;
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  store.set(key, {
    value: JSON.stringify(value),
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export async function cacheDelete(key: string): Promise<void> {
  store.delete(key);
}
