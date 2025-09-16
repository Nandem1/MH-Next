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

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    email: string;
    rol_id: number;
    usuario_id: number | null;
    created_at: string;
  };
}

export const register = async (
  email: string,
  password: string
): Promise<RegisterResponse> => {
  const { data } = await axios.post<RegisterResponse>(
    `${API_URL}/api-beta/register`,
    { email, password }
  );
  return data;
};

export interface RelacionarUsuarioRequest {
  authUserId: number;
  usuarioId: number;
}

export interface RelacionarUsuarioResponse {
  success: boolean;
  message: string;
  data: {
    auth_user: {
      id: number;
      email: string;
      usuario_id: number;
      rol_id: number;
      created_at: string;
      updated_at: string;
    };
    usuario: {
      id: number;
      nombre: string;
      whatsapp_id: string;
      id_local: number;
    };
    mensaje: string;
  };
}

export const relacionarUsuario = async (
  request: RelacionarUsuarioRequest
): Promise<RelacionarUsuarioResponse> => {
  const { data } = await axios.post<RelacionarUsuarioResponse>(
    `${API_URL}/api-beta/auth/relacionar-usuario`,
    request,
    { withCredentials: true }
  );
  return data;
};

// Password Reset Interfaces
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerifyResetTokenResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
  };
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// Password Reset Services
export const forgotPassword = async (
  email: string
): Promise<ForgotPasswordResponse> => {
  const { data } = await axios.post<ForgotPasswordResponse>(
    `${API_URL}/api-beta/auth/forgot-password`,
    { email }
  );
  return data;
};

export const verifyResetToken = async (
  token: string
): Promise<VerifyResetTokenResponse> => {
  const { data } = await axios.get<VerifyResetTokenResponse>(
    `${API_URL}/api-beta/auth/verify-reset-token/${token}`
  );
  return data;
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<ResetPasswordResponse> => {
  const { data } = await axios.post<ResetPasswordResponse>(
    `${API_URL}/api-beta/auth/reset-password`,
    { token, newPassword }
  );
  return data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResponse> => {
  const { data } = await axios.post<ChangePasswordResponse>(
    `${API_URL}/api-beta/auth/change-password`,
    { currentPassword, newPassword },
    { withCredentials: true }
  );
  return data;
};