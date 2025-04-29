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

// 🚀 Servicio para obtener todos los usuarios combinados
export const getUsuariosFull = async (): Promise<UsuarioFull[]> => {
  const response = await axios.get<UsuarioFull[]>(`${API_URL}/api-beta/usuarios/full`, {
    withCredentials: true, // 👈 No olvidar para enviar cookie
  });
  return response.data;
};
