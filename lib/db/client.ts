import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

type AppDb = MySql2Database<typeof schema>;

// Lazy initialization — pool is only created when the first query runs,
// not at module evaluation time. This prevents build crashes when
// DATABASE_URL is missing or malformed during Next.js static analysis.
let _db: AppDb | null = null;

function getDb(): AppDb {
  if (_db) return _db;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');

  const pool = mysql.createPool({
    uri: url,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    // mysql2 prepared statements return JSON columns as raw strings.
    // This typeCast ensures JSON is always parsed into JS objects.
    typeCast: (field, next) => {
      if (field.type === 'JSON') {
        const val = field.string();
        if (val == null) return null;
        try { return JSON.parse(val); } catch { return val; }
      }
      return next();
    },
  });

  _db = drizzle(pool, { schema, mode: 'default' }) as AppDb;
  return _db;
}

// Proxy preserves the full `db.select()` / `db.insert()` / `db.query` API
// at every call site without requiring any import changes.
export const db = new Proxy({} as AppDb, {
  get(_target, prop) {
    return Reflect.get(getDb(), prop);
  },
});

export type DB = typeof db;
