import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getNotasCredito } from "@/services/notaCreditoService";
import { NotaCredito } from "@/types/notaCredito";

interface NotasCreditoQueryResult {
  notasCredito: NotaCredito[];
  total: number;
}

export const useNotasCredito = (
  page: number,
  limit: number,
  local?: string,
  usuario?: string,
  proveedor?: string
): UseQueryResult<NotasCreditoQueryResult, Error> => {
  return useQuery<NotasCreditoQueryResult, Error>({
    queryKey: ["notasCredito", page, limit, local ?? "", usuario ?? "", proveedor ?? ""],
    queryFn: () => getNotasCredito(page, limit, local, usuario, proveedor),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}; 