'use server';

import { redirect } from 'next/navigation';
import { after } from 'next/server';
import { db } from '@/lib/db/client';
import { adminUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword } from './password';
import { createSession, setSessionCookie, clearSessionCookie } from './session';
import { warmAdminCache } from '@/lib/db/warm-cache';

export async function login(formData: FormData): Promise<{ error: string } | never> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email.toLowerCase().trim()))
    .limit(1);

  if (!user) {
    return { error: 'Invalid email or password.' };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: 'Invalid email or password.' };
  }

  // Update last login timestamp
  await db
    .update(adminUsers)
    .set({ lastLoginAt: new Date() })
    .where(eq(adminUsers.id, user.id));

  const token = await createSession({
    adminUserId: user.id,
    email: user.email,
    name: user.name,
  });

  await setSessionCookie(token);

  // Pre-load every admin page's data so offline snapshots exist immediately
  // after login. Runs in the background so it never delays the redirect; the
  // DB is reachable here (we just authenticated against it).
  after(() => warmAdminCache());

  redirect('/admin/dashboard');
}

export async function logout(): Promise<never> {
  await clearSessionCookie();
  redirect('/admin/login');
}
