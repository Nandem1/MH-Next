// src/hooks/useFacturas.ts
import { useQuery } from "@tanstack/react-query";
import { getFacturas } from "@/services/facturaService";
import { Factura } from "@/types/factura";

interface FacturasQueryResult {
  facturas: Factura[];
  total: number;
}

export const useFacturas = (
  page: number,
  limit: number,
  local?: string
) => {
  return useQuery<FacturasQueryResult, Error>({
    queryKey: ["facturas", page, limit, local],
    queryFn: () => getFacturas(page, limit, local),
    retry: 1, // Solo reintentar una vez
    retryDelay: 1000, // Esperar 1 segundo entre reintentos
    staleTime: 0, // Considerar los datos obsoletos inmediatamente
    gcTime: 5 * 60 * 1000, // Mantener en caché por 5 minutos
    refetchOnWindowFocus: true, // Recargar cuando la ventana obtiene el foco
    refetchOnMount: true, // Recargar cuando el componente se monta
  });
};
