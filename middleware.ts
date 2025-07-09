import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')

  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 권한 체크
  const pathname = request.nextUrl.pathname
  const permissions = token.permissions as any

  // 권한별 접근 제어
  if (pathname.startsWith('/settings') && !permissions?.settings) {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  if (pathname.startsWith('/products') && !permissions?.products) {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 