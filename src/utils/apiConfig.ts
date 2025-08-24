import axios, { AxiosInstance, AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Configuración centralizada para APIs con autenticación
 */
export const createAuthenticatedApi = (baseURL?: string): AxiosInstance => {
  const api = axios.create({
    baseURL: baseURL || `${API_URL}/api-beta`,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 segundos
  });

  // Interceptor para agregar token automáticamente
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Interceptor para manejar errores de autenticación
  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem('authToken');
        
        // Solo redirigir si no estamos ya en login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
};

/**
 * Función helper para manejar errores de API de forma consistente
 */
export const handleApiError = (error: AxiosError): never => {
  console.error('API Error:', error);

  if (error.response?.status === 401) {
    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
  }
  
  if (error.response?.status === 403) {
    throw new Error('No tienes permisos para realizar esta acción.');
  }
  
  if (error.response?.status === 404) {
    throw new Error('Recurso no encontrado.');
  }
  
  if (error.response && error.response.status >= 500) {
    throw new Error('Error interno del servidor. Por favor, intenta más tarde.');
  }
  
  // Errores de validación o negocio
  if (error.response?.data && typeof error.response.data === 'object') {
    const responseData = error.response.data as { error?: { code?: string; message?: string; details?: unknown } };
    
    if (responseData.error) {
      const apiError = responseData.error;
      
      // Error de saldo insuficiente
      if (apiError.code === 'INSUFFICIENT_BALANCE') {
        const details = apiError.details as { saldo_disponible?: number };
        throw new Error(
          `Saldo insuficiente. Disponible: $${details?.saldo_disponible?.toLocaleString() || 0}`
        );
      }
      
      // Error de validación
      if (apiError.code === 'VALIDATION_ERROR') {
        const details = apiError.details;
        if (details && typeof details === 'object') {
          const errores = Object.entries(details)
            .map(([campo, mensaje]) => `${campo}: ${mensaje}`)
            .join(', ');
          throw new Error(`Errores de validación: ${errores}`);
        }
      }
      
      throw new Error(apiError.message || 'Error en la solicitud');
    }
  }
  
  // Error de red
  if (error.code === 'NETWORK_ERROR' || !error.response) {
    throw new Error('Error de conexión. Verifica tu conexión a internet.');
  }
  
  throw new Error('Error desconocido. Por favor, intenta nuevamente.');
};

/**
 * Función helper para verificar autenticación
 */
export const checkAuthentication = (): void => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Usuario no autenticado. Por favor, inicia sesión.');
  }
};

/**
 * Función helper para obtener headers de autenticación manualmente
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Verificar si el usuario está autenticado
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

/**
 * Limpiar datos de autenticación
 */
export const clearAuthData = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('usuario');
};

/**
 * Constantes de configuración
 */
export const API_CONFIG = {
  BASE_URL: API_URL,
  ENDPOINTS: {
    GASTOS: '/gastos',
    CAJA_CHICA: '/caja-chica',
    CUENTAS_CONTABLES: '/cuentas-contables',
    ESTADISTICAS: '/estadisticas',
  },
  TIMEOUTS: {
    DEFAULT: 30000,
    UPLOAD: 60000,
    DOWNLOAD: 120000,
  },
  RETRY: {
    ATTEMPTS: 3,
    DELAY: 1000,
  }
} as const;
