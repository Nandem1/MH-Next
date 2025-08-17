import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

  async rewrites() {
    return [
      {
        source: "/api-beta/:path*",
        destination: "https://mh-backend-production.up.railway.app/api-beta/:path*",
      },
    ];
  },
};

export default nextConfig; 