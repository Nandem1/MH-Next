// /services/usuarioService.ts
import axios from "axios";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const isMobile = () => {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent || navigator.vendor;
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  return mobileRegex.test(userAgent.toLowerCase());
};

const getAuthToken = async () => {
  if (isMobile()) {
    return localStorage.getItem('authToken') || localStorage.getItem('auth_token');
  }
  const session = await getSession();
  return session?.user?.id;
};

export interface UsuarioFull {
  id_auth_user: number;
  email: string;
  rol_id: number;
  id_usuario: number | null;
  nombre: string | null;
  whatsapp_id: string | null;
}

// 🚀 Servicio para obtener todos los usuarios combinados
export const getUsuariosFull = async (): Promise<UsuarioFull[]> => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token available');
  }

  const response = await axios.get<UsuarioFull[]>(`${API_URL}/api-beta/usuarios/full`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return response.data;
};
