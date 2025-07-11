import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,      // (opcional) buena práctica en prod

  // Configuración para manejar módulos del lado del cliente
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
        source: "/api-beta/:path*",                 // todo lo que empiece con /api-beta
        destination:
          "https://mh-backend-production.up.railway.app/api-beta/:path*", // tu backend
      },
    ];
  },
};

export default nextConfig;