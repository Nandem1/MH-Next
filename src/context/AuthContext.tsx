// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { login as loginService, logout as logoutService } from "@/services/authService";
import { AxiosError } from "axios";

interface UsuarioAuth {
  id_auth_user: number;
  email: string;
  usuario_id: number | null;
  rol_id: number;
  nombre: string | null;
  whatsapp_id: string | null;
  id_local: number | null;
}

interface AuthContextType {
  usuario: UsuarioAuth | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  loading: boolean;
}

interface LoginResult {
  success: boolean;
  message: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [usuario, setUsuario] = useState<UsuarioAuth | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    setLoading(true);
    try {
      const { user } = await loginService(email, password);
      setUsuario(user);

      localStorage.setItem("showLoginMessage", "true");
      router.push("/dashboard/inicio");

      return { success: true, message: "Inicio de sesión exitoso." };
    } catch (error) {
      let message = "Error desconocido";

      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
      }

      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      setUsuario(null);
      localStorage.setItem("showLogoutMessage", "true");
      router.push("/login");
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};