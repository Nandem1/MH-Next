import { useQuery } from "@tanstack/react-query";
import { getUsuarios, Usuario } from "@/services/usuarioService";

export const useUsuarios = () => {
  return useQuery<Usuario[], Error>({
    queryKey: ["usuarios"],
    queryFn: getUsuarios,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}; 