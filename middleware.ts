import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

/**
 * Middleware for locale routing, account route protection, and transparent auth token refresh.
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Skip RSC flight requests — these are internal Next.js fetches for client-side
  // navigation. Redirecting them breaks client-side nav with "Failed to fetch RSC payload".
  const isRscRequest = request.headers.get('RSC') === '1'
    || request.headers.get('Next-Router-State-Tree') !== null
    || request.headers.get('Next-Router-Prefetch') !== null
    || searchParams.has('_rsc');

  if (isRscRequest) {
    return NextResponse.next();
  }

  // Strip locale prefix for account auth checks: /en/account → /account, /ar/account → /account
  const pathnameWithoutLocale = pathname.replace(/^\/(en|ar)(?=\/|$)/, '') || '/';

  // --- ACCOUNT ROUTES PROTECTION ---
  if (pathnameWithoutLocale.startsWith('/account')) {
    const accessToken = request.cookies.get('customer_access_token')?.value;
    const refreshToken = request.cookies.get('customer_refresh_token')?.value;
    const loggedInIndicator = request.cookies.get('customer_logged_in')?.value;

    if (searchParams.has('error') || searchParams.has('auth')) {
      return intlMiddleware(request);
    }

    if (accessToken) {
      return intlMiddleware(request);
    }

    if (refreshToken) {
      const refreshUrl = new URL('/api/auth/refresh', request.url);
      refreshUrl.searchParams.set('returnTo', pathname + request.nextUrl.search);
      return NextResponse.redirect(refreshUrl);
    }

    if (loggedInIndicator) {
      const loginUrl = new URL('/api/auth/login', request.url);
      loginUrl.searchParams.set('reason', 'token_missing');
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.cookies.delete('customer_logged_in');
      return redirectResponse;
    }

    const loginUrl = new URL('/api/auth/login', request.url);
    loginUrl.searchParams.set('reason', 'unauthenticated');
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except api, _next internals, and static files
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
