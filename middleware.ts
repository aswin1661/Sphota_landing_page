import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname
  const pathname = request.nextUrl.pathname;

  // Check if this is an admin route (but not login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check for auth cookie
    const authCookie = request.cookies.get('admin_auth');
    
    if (!authCookie?.value) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*'
};
