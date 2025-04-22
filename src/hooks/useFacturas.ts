// src/hooks/useFacturas.ts
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getFacturas } from "@/services/facturaService";
import { Factura } from "@/types/factura";

interface FacturasQueryResult {
  facturas: Factura[];
  total: number;
}

export const useFacturas = (
  page: number,
  limit: number,
  local?: string // ✅ Nuevo argumento opcional
): UseQueryResult<FacturasQueryResult, Error> => {
  return useQuery<FacturasQueryResult, Error>({
    queryKey: ["facturas", page, limit, local ?? ""], // ✅ clave única
    queryFn: () => getFacturas(page, limit, local),   // ✅ nuevo uso
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};
