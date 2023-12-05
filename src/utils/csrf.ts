import { csrfCookieToken, csrfCookieAge } from '@/constants/csrf';
import { serialize, parse } from 'cookie';

const LEN = 32;

export function generateCsrfToken(): string {
  if (!crypto) {
    console.error('Web Crypto API not supported.');
    return generateCsrfTokenFallback();
  }

  const array = new Uint8Array(LEN);
  crypto.getRandomValues(array);
  return Array
    .from(array, (byte: number) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function getCsrfFromCookie(cookie: string = ''): string {
  return parse(cookie)[csrfCookieToken] || '';
}

export function setCookie(token: string): string {
  return serialize(csrfCookieToken, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: csrfCookieAge,
  });
}

export function generateCsrfTokenFallback(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token: string = '';
  for (let i = 0; i < LEN; i += 1) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}
