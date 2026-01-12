import { type NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from '@/lib/supabase/middleware';

// Create the next-intl middleware
const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // First, handle i18n routing
  const intlResponse = intlMiddleware(request);

  // If the intl middleware returns a redirect or rewrite, use that
  if (intlResponse.headers.get('x-middleware-rewrite') || intlResponse.status !== 200) {
    return intlResponse;
  }

  // Then handle Supabase session
  const sessionResponse = await updateSession(request);

  // Merge headers from intl middleware into session response
  intlResponse.headers.forEach((value, key) => {
    sessionResponse.headers.set(key, value);
  });

  return sessionResponse;
}

export const config = {
  // Match all pathnames except for API routes and static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
