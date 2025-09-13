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
