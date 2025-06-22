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
  local?: string
): UseQueryResult<NotasCreditoQueryResult, Error> => {
  return useQuery<NotasCreditoQueryResult, Error>({
    queryKey: ["notasCredito", page, limit, local ?? ""],
    queryFn: () => getNotasCredito(page, limit, local),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}; 