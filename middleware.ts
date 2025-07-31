import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// 보호된 라우트와 권한 매핑
const PROTECTED_ROUTES = {
  '/customers': 'customers',
  '/products': 'products',
  '/messages': 'messages',
  '/statistics': 'statistics',
  '/settings': 'settings',
} as const;

// 공개 경로 (인증 불필요) - 임시로 모든 경로 허용
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/api/auth',
  '/customers', // 임시로 추가
  '/products',  // 임시로 추가
  '/messages',  // 임시로 추가
  '/statistics', // 임시로 추가
  '/settings',  // 임시로 추가
  '/',          // 루트 경로도 추가
];

// API 경로별 권한 체크
const API_PERMISSIONS = {
  '/api/customers': 'customers',
  '/api/products': 'products',
  '/api/messages': 'messages',
  '/api/statistics': 'statistics',
} as const;

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(path => pathname.startsWith(path));
}

function getRequiredPermission(pathname: string): string | null {
  // API 경로 체크
  for (const [apiPath, permission] of Object.entries(API_PERMISSIONS)) {
    if (pathname.startsWith(apiPath)) {
      return permission;
    }
  }

  // 일반 경로 체크
  for (const [routePath, permission] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(routePath)) {
      return permission;
    }
  }

  return null;
}

function hasPermission(permissions: any, resource: string, action: string = 'view'): boolean {
  return permissions?.[resource]?.[action] === true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 루트 경로는 완전히 공개 - 토큰 체크 없이 바로 통과
  if (pathname === '/') {
    return NextResponse.next();
  }
  
  // 공개 경로는 그대로 통과
  if (isPublicPath(pathname)) {
    const token = await getToken({ req: request });
    
    // 이미 로그인된 사용자가 로그인 페이지에 접근하면 홈으로 리다이렉트
    if (token && pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    return NextResponse.next();
  }

  // 토큰 확인
  const token = await getToken({ req: request });
  
  if (!token) {
    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 권한 체크
  const requiredPermission = getRequiredPermission(pathname);
  
  if (requiredPermission) {
    const permissions = token.permissions as any;
    
    // API 경로의 경우 HTTP 메서드에 따른 세부 권한 체크
    if (pathname.startsWith('/api/')) {
      const method = request.method.toLowerCase();
      let action = 'view';
      
      switch (method) {
        case 'post':
          action = 'create';
          break;
        case 'put':
        case 'patch':
          action = 'edit';
          break;
        case 'delete':
          action = 'delete';
          break;
        default:
          action = 'view';
      }
      
      if (!hasPermission(permissions, requiredPermission, action)) {
        return NextResponse.json(
          { success: false, error: '권한이 없습니다' },
          { status: 403 }
        );
      }
    } else {
      // 일반 페이지의 경우 view 권한만 체크
      if (!hasPermission(permissions, requiredPermission, 'view')) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }

  // 보안 헤더 추가
  const response = NextResponse.next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // HTTPS 강제 (프로덕션에서만)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 