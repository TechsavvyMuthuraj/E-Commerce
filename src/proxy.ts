import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    // In a real application with Supabase, you would use createMiddlewareClient:
    // const res = NextResponse.next();
    // const supabase = createMiddlewareClient({ req: request, res });
    // const { data: { session } } = await supabase.auth.getSession();
    // if (!session) return NextResponse.redirect(new URL('/login', request.url));

    // For this mock implementation, we'll just allow passing through or simulate 
    // protection based on a cookie if you added one during login.
    // We will assume the user easily clicked 'Login' and bypass strict check for the static demo.

    // Protect /dashboard and /checkout routes
    // This is a minimal structure for demonstrating where auth protection goes.

    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');

    if (isDashboard) {
        // If we had a strict mock, and cookies were missing:
        // return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/checkout'],
};
