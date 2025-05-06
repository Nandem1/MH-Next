/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  async rewrites() {
    return [
      {
        source: '/api-beta/:path*',
        destination: 'https://mh-backend-production.up.railway.app/api-beta/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 