import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateCsrfToken, getCsrfFromCookie, setCookie } from './utils/csrf';
import httpMethods from './constants/httpMethods';
import { csrfCookieToken, csrfHeader } from './constants/csrf';

const allowedMethods = [
  httpMethods.post,
  httpMethods.put,
  httpMethods.patch,
  httpMethods.delete,
];

export async function middleware(request: NextRequest) {
  const cookieToken = getCsrfFromCookie(request.cookies.toString()) || generateCsrfToken();

  if (allowedMethods.includes(request.method)) {
    if (cookieToken !== request.headers.get(csrfHeader)) {
      return NextResponse.json({ data: 'Invalid CSRF token' }, { status: 403 });
    }
  }

  request.cookies.set(csrfCookieToken, cookieToken);
  const response = NextResponse.rewrite(request.url, { request });
  response.headers.set('Set-Cookie', setCookie(cookieToken));
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
