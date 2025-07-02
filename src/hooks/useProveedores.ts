import { useQuery } from "@tanstack/react-query";
import { getProveedores, Proveedor } from "@/services/usuarioService";

export const useProveedores = () => {
  return useQuery<Proveedor[], Error>({
    queryKey: ["proveedores"],
    queryFn: getProveedores,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}; 