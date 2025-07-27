import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración optimizada para producción
  reactStrictMode: true,
  
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
    // Optimizaciones avanzadas para producción
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
    // Tamaños optimizados para mobile
    deviceSizes: [320, 375, 414, 768, 1024, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Optimización de carga
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
          images: {
            test: /[\\/]node_modules[\\/]next[\\/]dist[\\/]client[\\/]image/,
            name: 'images',
            chunks: 'all',
            priority: 5,
          },
        },
      };
    }
    
    return config;
  },

  // Headers para optimización de caché
  async headers() {
    return [
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
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