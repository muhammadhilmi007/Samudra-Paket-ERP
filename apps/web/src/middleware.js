/**
 * Next.js Middleware
 * Handles authentication and route protection
 */

import { NextResponse } from 'next/server';

/**
 * Middleware function that runs before requests
 * Handles authentication and route protection
 * 
 * @param {Object} request - Next.js request object
 * @returns {NextResponse} - Next.js response object
 */
export function middleware(request) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;
  
  // Get the token from the cookies
  const token = request.cookies.get('token')?.value;
  
  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/track',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
  ];
  
  // Define API routes that don't require authentication
  const publicApiRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/track',
  ];
  
  // Check if the current route is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Check if the current route is a public API route
  const isPublicApiRoute = publicApiRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Check if the current route is an API route
  const isApiRoute = pathname.startsWith('/api/');
  
  // Allow access to public routes and public API routes
  if (isPublicRoute || isPublicApiRoute) {
    return NextResponse.next();
  }
  
  // Check if user is authenticated for protected routes
  if (!token) {
    // For API routes, return unauthorized response
    if (isApiRoute) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // For page routes, redirect to login page
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }
  
  // If authenticated, allow access to protected routes
  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  // Match all routes except for static files, images, and other assets
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|logo.svg|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
};
