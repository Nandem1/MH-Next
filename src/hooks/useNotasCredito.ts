import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotasCredito, actualizarMontoNotaCredito } from "@/services/notaCreditoService";
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
) => {
  return useQuery({
    queryKey: ["notasCredito", page, limit, local ?? "", usuario ?? "", proveedor ?? ""],
    queryFn: () => getNotasCredito(page, limit, local, usuario, proveedor),
    // Usar configuración global del QueryClient
    // staleTime, retry, refetchOnWindowFocus, etc. se manejan globalmente
  });
};

// Hook para actualizar montos de notas de crédito con optimistic update
export const useActualizarMontoNotaCredito = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, monto }: { id: string; monto: number }) => 
      actualizarMontoNotaCredito(id, monto),
    onMutate: async ({ id, monto }) => {
      // Cancelar queries en curso para evitar que sobrescriban nuestro optimistic update
      await queryClient.cancelQueries({ queryKey: ["notasCredito"] });

      // Guardar el estado anterior para poder revertir si es necesario
      const previousNotasCredito = queryClient.getQueriesData({ queryKey: ["notasCredito"] });

      // Optimistic update: marcar la nota de crédito como "updating" en lugar de cambiar el monto
      queryClient.setQueriesData({ queryKey: ["notasCredito"] }, (old: NotasCreditoQueryResult | undefined) => {
        if (!old) return old;
        
        // Si es un array de notas de crédito, marcar la nota específica como updating
        if (old.notasCredito && Array.isArray(old.notasCredito)) {
          return {
            ...old,
            notasCredito: old.notasCredito.map((notaCredito: NotaCredito) => 
              notaCredito.id === id ? { ...notaCredito, isUpdating: true, pendingMonto: monto } : notaCredito
            )
          };
        }
        
        return old;
      });

      // Retornar el contexto para poder revertir si es necesario
      return { previousNotasCredito };
    },
    onError: (err, _variables, context) => {
      // Si hay error, revertir al estado anterior
      if (context?.previousNotasCredito) {
        context.previousNotasCredito.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error("Error en mutación de monto de nota de crédito:", err);
    },
    onSuccess: (_, variables) => {
      // Actualizar el monto real y quitar el estado de updating
      const { id, monto } = variables;
      queryClient.setQueriesData({ queryKey: ["notasCredito"] }, (old: NotasCreditoQueryResult | undefined) => {
        if (!old) return old;
        
        if (old.notasCredito && Array.isArray(old.notasCredito)) {
          return {
            ...old,
            notasCredito: old.notasCredito.map((notaCredito: NotaCredito) => 
              notaCredito.id === id ? { ...notaCredito, monto, isUpdating: false, pendingMonto: undefined } : notaCredito
            )
          };
        }
        
        return old;
      });
    },
  });
}; 