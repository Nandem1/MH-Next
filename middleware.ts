import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value
  const user = request.cookies.get('usuario')?.value
  const isLoginPage = request.nextUrl.pathname === '/login'
  const isRootPage = request.nextUrl.pathname === '/'

  // Si es la página raíz, redirigir a login
  if (isRootPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si el usuario está autenticado y está en la página de login, redirigir al dashboard
  if (isLoginPage && token && user) {
    return NextResponse.redirect(new URL('/dashboard/inicio', request.url))
  }

  // Si el usuario no está autenticado y está intentando acceder al dashboard, redirigir al login
  if (!isLoginPage && !token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*']
} 