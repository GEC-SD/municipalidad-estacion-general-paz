import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Proxy de seguridad (Next.js 16):
 * - Protege rutas /admin/* verificando cookie de sesión Supabase
 * - Redirige a /login si no hay sesión válida
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger rutas admin
  if (pathname.startsWith('/admin')) {
    // Supabase almacena la sesión en cookies con prefijo sb-
    const hasSession = request.cookies.getAll().some(
      (cookie) => cookie.name.startsWith('sb-') && cookie.name.includes('auth-token')
    );

    if (!hasSession) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
