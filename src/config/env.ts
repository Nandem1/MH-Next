/**
 * Configuración centralizada de variables de entorno
 * 
 * Este archivo centraliza todas las variables de entorno del proyecto
 * y proporciona valores por defecto seguros para desarrollo.
 * 
 * IMPORTANTE: Las variables NEXT_PUBLIC_* están disponibles en el cliente
 * Las variables sin NEXT_PUBLIC_ solo están disponibles en el servidor
 */

/**
 * Entorno actual de la aplicación
 */
export const ENV = {
  // Entorno de ejecución
  NODE_ENV: process.env.NODE_ENV || 'development',
  NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV || 'development',
  
  // URLs
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  
  // APIs
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  GO_API_URL: process.env.NEXT_PUBLIC_GO_API_URL || 'http://localhost:8080/api/v1',
  
  // SEO
  GOOGLE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
  
  // Feature Flags
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',
} as const;

/**
 * Verifica si estamos en producción
 */
export const isProduction = (): boolean => {
  return ENV.NODE_ENV === 'production' || ENV.NEXT_PUBLIC_ENV === 'production';
};

/**
 * Verifica si estamos en desarrollo
 */
export const isDevelopment = (): boolean => {
  return ENV.NODE_ENV === 'development' || ENV.NEXT_PUBLIC_ENV === 'development';
};

/**
 * Obtiene la URL base de la API según el entorno
 */
export const getApiUrl = (): string => {
  return ENV.API_URL;
};

/**
 * Obtiene la URL base del backend Go según el entorno
 */
export const getGoApiUrl = (): string => {
  return ENV.GO_API_URL;
};

/**
 * Obtiene la URL base del sitio según el entorno
 */
export const getSiteUrl = (): string => {
  return ENV.SITE_URL;
};

/**
 * Valida que las variables de entorno críticas estén configuradas
 * Útil para verificar en tiempo de build
 */
export const validateEnv = (): void => {
  const required = [
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_API_URL',
  ];

  const missing: string[] = [];

  required.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0 && isProduction()) {
    console.warn(
      `⚠️  Variables de entorno faltantes en producción: ${missing.join(', ')}`
    );
  }
};

// Validar en tiempo de importación (solo en servidor)
if (typeof window === 'undefined') {
  validateEnv();
}

