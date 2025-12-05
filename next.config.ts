import type { NextConfig } from "next";

// Obtener la URL del backend desde variables de entorno
// En desarrollo, usa la variable de entorno o el valor por defecto
// En producción, debe estar configurada en Vercel
const API_BACKEND_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  process.env.API_BACKEND_URL || 
  'https://mh-backend-production.up.railway.app';

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
    // Solo aplicar rewrites si no estamos usando la URL completa en NEXT_PUBLIC_API_URL
    // Si NEXT_PUBLIC_API_URL ya incluye la ruta completa, los rewrites pueden no ser necesarios
    const shouldUseRewrites = !process.env.NEXT_PUBLIC_API_URL?.includes('/api-beta');
    
    if (shouldUseRewrites) {
      return [
        {
          source: "/api-beta/:path*",
          destination: `${API_BACKEND_URL}/api-beta/:path*`,
        },
      ];
    }
    
    return [];
  },
};

export default nextConfig; 