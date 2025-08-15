import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only check auth for admin routes (excluding login, API routes, and auth check)
  if (pathname.startsWith('/admin') && 
      pathname !== '/admin/login' && 
      !pathname.startsWith('/api/admin/')) {
    
    const authCookie = request.cookies.get('admin_auth');
    
    // Check if cookie exists and has valid value
    if (!authCookie?.value || authCookie.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Add cache headers for better performance
  const response = NextResponse.next();
  
  // Prevent caching of admin pages to ensure fresh auth checks
  if (pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
  ]
};
