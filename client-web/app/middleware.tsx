import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const session = JSON.parse(localStorage.getItem('session') || 'null');
    const url = request.nextUrl;

    if (!session) {
        return NextResponse.redirect(new URL('/auth/login', url));
    }

    const now = new Date().getTime();
    const sessionExpiry = session.loginTime + 10 * 60 * 1000;

    if (now > sessionExpiry) {
        localStorage.removeItem('session');
        return NextResponse.redirect(new URL('/auth/login', url));
    }

    return NextResponse.next();
}