/* eslint-disable max-len */
/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const genHeaders = (env) => [
  {
    key: 'Content-Security-Policy',
    value: `script-src 'self' ${env === 'development' ? "'unsafe-eval'" : ''}; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' secure.gravatar.com i.ytimg.com data:;`,
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=15768000; includeSubDomains; preload',
  },
  {
    key: 'Access-Control-Allow-Origin',
    value: `${process.env.NEXT_PUBLIC_DOMAIN}`,
  },
  {
    key: 'Access-Control-Allow-Headers',
    value: 'CSRF-Token, Content-Type, Authorization',
  },
  {
    key: 'Access-Control-Allow-Credentials',
    value: 'true',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
];

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  experimental: {
    largePageDataBytes: 128 * 1000 * 5,
  },
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        port: '',
        pathname: '/avatar/**',
      },
    ],
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: genHeaders(process.env.NODE_ENV),
    }];
  },
});
