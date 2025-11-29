// /services/usuarioService.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface UsuarioFull {
  id_auth_user: number;
  email: string;
  rol_id: number;
  id_usuario: number | null;
  nombre: string | null;
  whatsapp_id: string | null;
}

export interface Usuario {
  id: number;
  nombre: string;
  whatsapp_id: string;
  nombre_local: string;
}

export interface UsuarioDisponible {
  id: number;
  nombre: string;
  whatsapp_id: string;
  nombre_local: string;
}

export interface UsuariosDisponiblesResponse {
  success: boolean;
  data: UsuarioDisponible[];
}

export interface Proveedor {
  id: number;
  nombre: string;
  rut?: string;
}

// 🚀 Servicio para obtener todos los usuarios combinados
export const getUsuariosFull = async (): Promise<UsuarioFull[]> => {
  const response = await axios.get<UsuarioFull[]>(`${API_URL}/api-beta/usuarios/full`, {
    withCredentials: true, // 👈 No olvidar para enviar cookie
  });
  return response.data;
};

export const getUsuarios = async (): Promise<Usuario[]> => {
  try {
    const response = await axios.get<Usuario[]>(`${API_URL}/api-beta/usuarios`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    throw new Error("No se pudieron cargar los usuarios");
  }
};

export const getProveedores = async (): Promise<Proveedor[]> => {
  try {
    const response = await axios.get<Proveedor[]>(`${API_URL}/api-beta/proveedores`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo proveedores:", error);
    throw new Error("No se pudieron cargar los proveedores");
  }
};

export const getUsuariosDisponibles = async (): Promise<UsuarioDisponible[]> => {
  try {
    const response = await axios.get<UsuariosDisponiblesResponse>(`${API_URL}/api-beta/usuarios/disponibles`, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error obteniendo usuarios disponibles:", error);
    throw new Error("No se pudieron cargar los usuarios disponibles");
  }
};

// 🎯 Interfaces para usuarios autorizados para cartelería
export interface UsuarioAutorizado {
  id: number;
  nombre: string;
  rut: string;
  id_local: number;
  local: {
    id: number;
    nombre_local: string;
  };
}

export interface UsuarioAutorizadoResponse {
  success: boolean;
  data: UsuarioAutorizado[];
}

export interface CreateUsuarioAutorizadoRequest {
  nombre: string;
  rut: string;
  local: {
    id: number;
  };
}

export interface UpdateUsuarioAutorizadoRequest {
  nombre?: string;
  rut?: string;
  local?: {
    id: number;
  };
}

// 🚀 Servicio para obtener usuarios autorizados
export const getUsuariosAutorizados = async (): Promise<UsuarioAutorizado[]> => {
  try {
    const response = await axios.get<UsuarioAutorizadoResponse>(`${API_URL}/api-beta/usuariosCarteleria`, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error obteniendo usuarios autorizados:", error);
    throw new Error("No se pudieron cargar los usuarios autorizados");
  }
};

// 🚀 Servicio para crear usuario autorizado
export const createUsuarioAutorizado = async (
  data: CreateUsuarioAutorizadoRequest
): Promise<UsuarioAutorizado> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const response = await axios.post<UsuarioAutorizadoResponse>(
      `${API_URL}/api-beta/usuariosCarteleria`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    return response.data.data[0];
  } catch (error) {
    console.error("Error creando usuario autorizado:", error);
    if (axios.isAxiosError(error) && error.response?.data) {
      const errorMessage = error.response.data.error?.message || error.response.data.message;
      throw new Error(errorMessage || "No se pudo crear el usuario autorizado");
    }
    throw new Error("No se pudo crear el usuario autorizado");
  }
};

// 🚀 Servicio para actualizar usuario autorizado
export const updateUsuarioAutorizado = async (
  id: number,
  data: UpdateUsuarioAutorizadoRequest
): Promise<UsuarioAutorizado> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const response = await axios.put<UsuarioAutorizadoResponse>(
      `${API_URL}/api-beta/usuariosCarteleria/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    return response.data.data[0];
  } catch (error) {
    console.error("Error actualizando usuario autorizado:", error);
    if (axios.isAxiosError(error) && error.response?.data) {
      const errorMessage = error.response.data.error?.message || error.response.data.message;
      throw new Error(errorMessage || "No se pudo actualizar el usuario autorizado");
    }
    throw new Error("No se pudo actualizar el usuario autorizado");
  }
};