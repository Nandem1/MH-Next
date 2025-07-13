// @ts-nocheck
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dibcf0lnb/image/upload/**',
      },
    ],
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  async rewrites() {
    return [
      {
        source: "/api-beta/:path*",
        destination:
          "https://mh-backend-production.up.railway.app/api-beta/:path*",
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig); 