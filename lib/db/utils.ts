export function parseJsonField<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') {
    try { return JSON.parse(value) as T; } catch { return fallback; }
  }
  return value as T;
}

/**
 * Format a DB date value (a `Date` object from drizzle, or a string) as
 * `YYYY-MM-DD` — suitable for `<input type="date">` and for display.
 *
 * Returns `''` for empty/invalid values (so callers can detect "no date").
 * Uses LOCAL date components for `Date` objects: mysql2 returns DATE columns as
 * a `Date` at local midnight, so `getFullYear/Month/Date` give the right
 * calendar day. (`toISOString()` would shift the day back in positive UTC
 * offsets — exactly the bug we're avoiding.)
 */
export function toDateInputValue(value: unknown): string {
  if (value == null || value === '') return '';
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return '';
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  // String form: take just the date portion before any 'T' or space.
  const s = String(value).split('T')[0].split(' ')[0];
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
}
