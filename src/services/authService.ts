// /services/authService.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (email: string, password: string): Promise<void> => {
  await axios.post(
    `${API_URL}/api-beta/login`,
    { email, password },
    {
      withCredentials: true,
    }
  );
};

export const logout = async (): Promise<void> => {
  await axios.post(`${API_URL}/api-beta/logout`, {}, { withCredentials: true });
};