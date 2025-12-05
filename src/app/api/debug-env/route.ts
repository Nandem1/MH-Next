import { ENV, isProduction, isDevelopment } from '@/config/env';
import { NextResponse } from 'next/server';

/**
 * Endpoint de debug para verificar variables de entorno
 * 
 * Útil para verificar qué variables se están cargando en cada entorno
 * 
 * Acceso: GET /api/debug-env
 */
export async function GET() {
  // Solo permitir en desarrollo o si está explícitamente habilitado
  if (isProduction() && ENV.ENABLE_DEBUG !== true) {
    return NextResponse.json(
      { error: 'Debug endpoint disabled in production' },
      { status: 403 }
    );
  }

  return NextResponse.json({
    // Información del entorno
    environment: {
      nodeEnv: ENV.NODE_ENV,
      publicEnv: ENV.NEXT_PUBLIC_ENV,
      isProduction: isProduction(),
      isDevelopment: isDevelopment(),
    },
    
    // URLs configuradas
    urls: {
      siteUrl: ENV.SITE_URL,
      apiUrl: ENV.API_URL,
      goApiUrl: ENV.GO_API_URL,
    },
    
    // Feature flags
    features: {
      enableDebug: ENV.ENABLE_DEBUG,
      enableAnalytics: ENV.ENABLE_ANALYTICS,
    },
    
    // Variables raw (solo para debug)
    raw: {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_GO_API_URL: process.env.NEXT_PUBLIC_GO_API_URL,
      NODE_ENV: process.env.NODE_ENV,
    },
  });
}

