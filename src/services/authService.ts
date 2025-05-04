import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface UsuarioAuth {
  id_auth_user: number;
  email: string;
  usuario_id: number | null;
  rol_id: number;
  nombre: string | null;
  whatsapp_id: string | null;
  id_local: number | null;
}

export interface LoginResponse {
  message: string;
  token: string; // ← ahora llega el token
  user: UsuarioAuth;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const { data } = await axios.post<LoginResponse>(
    `${API_URL}/api-beta/login`,
    { email, password },
    { withCredentials: true }
  );
  return data;
};

export const logout = async (): Promise<void> => {
  await axios.post(`${API_URL}/api-beta/logout`, {}, { withCredentials: true });
};

export const getUsuarioAutenticado = async () => {
  const { data } = await axios.get<{ user: UsuarioAuth }>(
    `${API_URL}/api-beta/me`,
    { withCredentials: true }
  );
  return data;
};
