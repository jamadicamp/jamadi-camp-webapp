import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  // Redirect /es routes back to home
  if (request.nextUrl.pathname === '/es') {
    const response = NextResponse.redirect(new URL('/', request.url));
    // Add cache-busting headers to prevent Chrome from caching the redirect
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

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

  // Allow all other routes to pass through
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    // Skip all api routes
    // Skip all static files
    '/((?!api|_next|.*\\..*).*)',
  ],
}; 