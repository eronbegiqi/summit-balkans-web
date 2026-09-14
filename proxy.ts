import { NextRequest, NextResponse } from 'next/server';
import { createSession, verifySession, SESSION_COOKIE_NAME, SESSION_TTL_SECONDS } from '@/lib/auth/session';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let the login page through
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const session = await verifySession(token);
  if (!session) {
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  // Forward session info to server components via request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-admin-user-id', String(session.adminUserId));
  requestHeaders.set('x-admin-email', session.email);
  requestHeaders.set('x-admin-name', session.name);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Sliding session — every active request renews the cookie's expiration,
  // so an admin who uses the panel at least once every 30 days never gets
  // signed out mid-use (previously a fixed 7-day expiry from login time).
  const freshToken = await createSession(session);
  response.cookies.set(SESSION_COOKIE_NAME, freshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_TTL_SECONDS,
    path: '/',
  });

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
