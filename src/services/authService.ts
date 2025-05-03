// /services/authService.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface UsuarioAuth {
  id_auth_user: number;
  email: string;
  usuario_id: number | null;
  rol_id: number;
  nombre: string | null;
  whatsapp_id: string | null;
  id_local: number | null;
}

interface LoginResponse {
  message: string;
  user: UsuarioAuth;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    `${API_URL}/api-beta/login`,
    { email, password },
    { withCredentials: true }
  );

  return response.data; // 👈 aquí es donde retorna los datos
};

export const logout = async (): Promise<void> => {
  await axios.post(`${API_URL}/api-beta/logout`, {}, { withCredentials: true });
};

export const getUsuarioAutenticado = async (): Promise<{ user: UsuarioAuth }> => {
  const response = await axios.get(`${API_URL}/api-beta/me`, {
    withCredentials: true,
  });
  return response.data;
};