import { promises as fs } from 'fs';
import path from 'path';

/**
 * Offline-resilient query cache.
 *
 * Every successful DB query is persisted to disk as a JSON snapshot. When the
 * database is unreachable (e.g. the admin's internet drops), queries return the
 * last saved snapshot instead of throwing — so the admin panel stays viewable
 * with the most recent data it ever loaded.
 *
 * A short-lived circuit breaker means that once one query detects the DB is
 * down, the rest of the queries on the same page skip the (slow) connection
 * attempt and read straight from cache — keeping offline page loads fast.
 */

const CACHE_DIR = path.join(process.cwd(), '.cache', 'db-snapshots');

// After a connection failure, treat the DB as down for this long and serve
// snapshots directly without re-attempting a connection on every query.
const BREAKER_MS = 5_000;

// mysql2 / network error codes that indicate the DB is unreachable (vs. a
// genuine SQL error, which shouldn't trip the breaker for every other query).
const CONNECTION_ERROR_CODES = new Set([
  'ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN',
  'ECONNRESET', 'EPIPE', 'PROTOCOL_CONNECTION_LOST', 'ER_CON_COUNT_ERROR',
  'PROTOCOL_SEQUENCE_TIMEOUT',
]);

let lastConnectionFailureAt = 0;

type Snapshot<T> = { data: T; cachedAt: number };

function isConnectionError(err: unknown): boolean {
  const code = (err as { code?: string } | null)?.code;
  return code ? CONNECTION_ERROR_CODES.has(code) : false;
}

function fileFor(key: string): string {
  const safe = key.replace(/[^a-z0-9_-]/gi, '_');
  return path.join(CACHE_DIR, `${safe}.json`);
}

// Revive full ISO timestamps (e.g. created_at) back into Date objects so
// downstream code that expects a Date keeps working offline. Date-only values
// like '2026-06-28' are intentionally left as strings.
const ISO_DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
function reviver(_key: string, value: unknown): unknown {
  if (typeof value === 'string' && ISO_DATETIME.test(value)) {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return value;
}

async function readSnapshot<T>(key: string): Promise<Snapshot<T> | null> {
  try {
    const raw = await fs.readFile(fileFor(key), 'utf8');
    return JSON.parse(raw, reviver) as Snapshot<T>;
  } catch {
    return null;
  }
}

async function writeSnapshot<T>(key: string, data: T): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const payload: Snapshot<T> = { data, cachedAt: Date.now() };
    await fs.writeFile(fileFor(key), JSON.stringify(payload), 'utf8');
  } catch (err) {
    console.error('[db/cache] failed to write snapshot for', key, err);
  }
}

/** True if a connection failure was seen within the breaker window. */
export function isDbOffline(): boolean {
  return lastConnectionFailureAt > 0 && Date.now() - lastConnectionFailureAt < BREAKER_MS;
}

/** Timestamp (ms) of the last persisted snapshot for a key, or null. */
export async function snapshotAge(key: string): Promise<number | null> {
  const snap = await readSnapshot<unknown>(key);
  return snap?.cachedAt ?? null;
}

/**
 * Run a DB query with offline-resilient snapshot caching.
 *
 * @param key      Stable cache key. Include any params that change the result
 *                 (filters, pagination, ids) so views don't overwrite each other.
 * @param fn       The query to run.
 * @param fallback Returned only when the DB is down AND no snapshot exists yet.
 */
export async function cachedQuery<T>(key: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  // DB recently failed — don't pay the connection timeout again, serve cache.
  if (isDbOffline()) {
    const snap = await readSnapshot<T>(key);
    return snap ? snap.data : fallback;
  }

  try {
    const data = await fn();
    lastConnectionFailureAt = 0; // healthy again
    await writeSnapshot(key, data);
    return data;
  } catch (err) {
    if (isConnectionError(err)) lastConnectionFailureAt = Date.now();
    console.error('[db/cache] query failed, serving last snapshot for', key, err);
    const snap = await readSnapshot<T>(key);
    return snap ? snap.data : fallback;
  }
}
