// /services/cajaChicaService.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Interfaces basadas en la documentación de endpoints
export interface UsuarioCajaChica {
  authUserId: number;
  email: string;
  rolId: number;
  tieneCajaChica: boolean;
  montoFijo: number | null;
  montoActual: number | null;
  limiteMinimo: number | null;
  fechaUltimoReembolso: string | null;
  usuarioId: number;
  nombre: string;
  whatsappId: string;
  localId: number;
  nombreLocal: string;
  estadoAutorizacion: "autorizado" | "no_autorizado";
  estadoOperacional: "activo" | "requiere_reembolso" | "inactivo";
  rendicionActivaId: string | null;
  rendicionFechaInicio: string | null;
  rendicionGastosRegistrados: number | null;
  rendicionMontoTotalGastos: number | null;
}

export interface HabilitarCajaChicaRequest {
  authUserId: number;
  montoFijo?: number;
}

export interface EditarCajaChicaRequest {
  authUserId: number;
  montoFijo?: number;
  montoActual?: number;
}

export interface DeshabilitarCajaChicaRequest {
  authUserId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string;
  };
}

// 🚀 Servicio para obtener usuarios con estado de caja chica
export const getUsuariosCajaChica = async (): Promise<UsuarioCajaChica[]> => {
  try {
    const response = await axios.get<ApiResponse<UsuarioCajaChica[]>>(
      `${API_URL}/api-beta/usuario-caja-chica/usuarios`,
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error obteniendo usuarios con caja chica:", error);
    throw new Error("No se pudieron cargar los usuarios con estado de caja chica");
  }
};

// 🚀 Servicio para habilitar caja chica a un usuario
export const habilitarCajaChica = async (
  request: HabilitarCajaChicaRequest
): Promise<ApiResponse<unknown>> => {
  try {
    const response = await axios.post<ApiResponse<unknown>>(
      `${API_URL}/api-beta/usuario-caja-chica/habilitar`,
      request,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error habilitando caja chica:", error);
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as ErrorResponse;
      throw new Error(errorData.error.message);
    }
    throw new Error("Error al habilitar caja chica");
  }
};

// 🚀 Servicio para editar caja chica de un usuario
export const editarCajaChica = async (
  request: EditarCajaChicaRequest
): Promise<ApiResponse<unknown>> => {
  try {
    const response = await axios.put<ApiResponse<unknown>>(
      `${API_URL}/api-beta/usuario-caja-chica/editar`,
      request,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error editando caja chica:", error);
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as ErrorResponse;
      throw new Error(errorData.error.message);
    }
    throw new Error("Error al editar caja chica");
  }
};

// 🚀 Servicio para deshabilitar caja chica de un usuario
export const deshabilitarCajaChica = async (
  request: DeshabilitarCajaChicaRequest
): Promise<ApiResponse<unknown>> => {
  try {
    const response = await axios.delete<ApiResponse<unknown>>(
      `${API_URL}/api-beta/usuario-caja-chica/deshabilitar`,
      {
        data: request,
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deshabilitando caja chica:", error);
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as ErrorResponse;
      throw new Error(errorData.error.message);
    }
    throw new Error("Error al deshabilitar caja chica");
  }
};
