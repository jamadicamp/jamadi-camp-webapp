import { createI18nMiddleware } from 'next-international/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  urlMappingStrategy: 'rewrite',
});

export async function middleware(request: NextRequest) {
  // Handle CMS routes separately
  if (request.nextUrl.pathname.startsWith('/cms')) {
    // Skip auth check for login page
    if (request.nextUrl.pathname === '/cms/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/cms/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'your-secret-key'
      );
      
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      console.error('Auth error:', error);
      return NextResponse.redirect(new URL('/cms/login', request.url));
    }
  }

  // Handle internationalization for non-CMS routes
  return I18nMiddleware(request);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    // Skip all api routes
    // Skip all static files
    '/((?!api|_next|.*\\..*).*)',
    // Optional: Only run on specific paths
    // '/',
    // '/(en|es)/:path*'
  ],
}; 