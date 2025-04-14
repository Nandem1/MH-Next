// src/hooks/useFacturas.ts
import { useQuery } from "@tanstack/react-query";
import { getFacturas } from "@/services/facturaService";

export const useFacturas = () => {
  return useQuery({
    queryKey: ["facturas"],
    queryFn: getFacturas,
    refetchOnWindowFocus: false, // 👈 No refetchear cuando cambias de ventana
    refetchOnReconnect: false,   // 👈 No refetchear al reconectar internet
    retry: 1,                    // 👈 Reintentar solo 1 vez si falla
    staleTime: 1000 * 60 * 5,    // 👈 5 minutos "fresco" (no volver a pedir)
  });
};
