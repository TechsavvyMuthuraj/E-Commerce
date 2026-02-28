import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * EXE TOOL Auth Middleware
 * Handles session persistence and route protection.
 * Note: A full implementation with @supabase/auth-helpers-nextjs or @supabase/ssr
 * is recommended for production. This middleware serves as a foundation
 * for protecting dashboard and checkout routes.
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Redirect logic for protected routes if needed in the future
    // For now, we allow the client-side handlers to manage the initial state,
    // but the middleware ensures we have a standard Next.js entry point.

    const isDashboard = pathname.startsWith('/dashboard');
    const isCheckout = pathname.startsWith('/checkout');
    const isAdmin = pathname.startsWith('/admin');

    // Admin panel uses its own session-based auth in layout.tsx,
    // but we can add secondary protection here if required.

    // Standard response
    const response = NextResponse.next();

    // Security Headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
}

// Ensure middleware runs on relevant paths
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/checkout/:path*',
        '/admin/:path*',
    ],
};
