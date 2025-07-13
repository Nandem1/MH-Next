import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración optimizada para producción
  reactStrictMode: true,
  swcMinify: true, // Usar SWC para minificación (más rápido que Terser)
  
  // Configuración de compresión
  compress: true,
  
  // Configuración de imágenes optimizadas
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dibcf0lnb/image/upload/**',
      },
    ],
    // Optimizaciones adicionales para producción
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
  },

  // Configuración para manejar módulos del lado del cliente
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Optimizaciones adicionales para producción
    if (!dev) {
      // Optimizar chunks
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          mui: {
            test: /[\\/]node_modules[\\/]@mui[\\/]/,
            name: 'mui',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }
    
    return config;
  },

  // Headers de seguridad para producción
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Rewrites para API
  async rewrites() {
    return [
      {
        source: "/api-beta/:path*",
        destination: "https://mh-backend-production.up.railway.app/api-beta/:path*",
      },
    ];
  },

  // Configuración de output
  output: 'standalone', // Para Docker deployments
};

export default nextConfig; 