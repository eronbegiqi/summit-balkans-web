import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth/session';

const COOKIE_NAME = 'summit_admin_session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let the login page through
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const session = await verifySession(token);
  if (!session) {
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }

  // Forward session info to server components via request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-admin-user-id', String(session.adminUserId));
  requestHeaders.set('x-admin-email', session.email);
  requestHeaders.set('x-admin-name', session.name);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/admin/:path*'],
};
