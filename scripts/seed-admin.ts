/**
 * Creates the first admin user.
 * Run from the project root: npx tsx scripts/seed-admin.ts
 * Requires DATABASE_URL to be set in .env.local
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { adminUsers } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const EMAIL    = 'eronbegiqi8@gmail.com';
const PASSWORD = 'SummitAdmin20266';
const NAME     = 'Eron Begiqi';

async function main() {
  const pool = mysql.createPool({ uri: process.env.DATABASE_URL!, connectionLimit: 1 });
  const db   = drizzle(pool, { mode: 'default' });

  // Delete any existing user with this email (clean slate)
  await db.delete(adminUsers).where(eq(adminUsers.email, EMAIL));

  const hash = await bcrypt.hash(PASSWORD, 12);

  await db.insert(adminUsers).values({ email: EMAIL, passwordHash: hash, name: NAME });

  console.log(`✓ Admin user created`);
  console.log(`  Email:    ${EMAIL}`);
  console.log(`  Password: ${PASSWORD}`);

  await pool.end();
}

main().catch((err) => { console.error(err); process.exit(1); });
