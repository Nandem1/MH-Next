// src/hooks/useFacturas.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFacturas, actualizarMontoFactura } from "@/services/facturaService";
import { Factura } from "@/types/factura";

interface FacturasQueryResult {
  facturas: Factura[];
  total: number;
}

export const useFacturas = (
  page: number,
  limit: number,
  local?: string,
  usuario?: string,
  proveedor?: string
) => {
  return useQuery({
    queryKey: ["facturas", page, limit, local ?? "", usuario ?? "", proveedor ?? ""],
    queryFn: () => getFacturas(page, limit, local, usuario, proveedor),
    // Usar configuración global del QueryClient
    // staleTime, retry, refetchOnWindowFocus, etc. se manejan globalmente
  });
};

// Hook para actualizar montos de facturas con optimistic update
export const useActualizarMontoFactura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, monto }: { id: string; monto: number }) => 
      actualizarMontoFactura(id, monto),
    onMutate: async ({ id, monto }) => {
      // Cancelar queries en curso para evitar que sobrescriban nuestro optimistic update
      await queryClient.cancelQueries({ queryKey: ["facturas"] });

      // Guardar el estado anterior para poder revertir si es necesario
      const previousFacturas = queryClient.getQueriesData({ queryKey: ["facturas"] });

      // Optimistic update: marcar la factura como "updating" en lugar de cambiar el monto
      queryClient.setQueriesData({ queryKey: ["facturas"] }, (old: FacturasQueryResult | undefined) => {
        if (!old) return old;
        
        // Si es un array de facturas, marcar la factura específica como updating
        if (old.facturas && Array.isArray(old.facturas)) {
          return {
            ...old,
            facturas: old.facturas.map((factura: Factura) => 
              factura.id === id ? { ...factura, isUpdating: true, pendingMonto: monto } : factura
            )
          };
        }
        
        return old;
      });

      // Retornar el contexto para poder revertir si es necesario
      return { previousFacturas };
    },
    onError: (err, _variables, context) => {
      // Si hay error, revertir al estado anterior
      if (context?.previousFacturas) {
        context.previousFacturas.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error("Error en mutación de monto de factura:", err);
    },
    onSuccess: (_, variables) => {
      // Actualizar el monto real y quitar el estado de updating
      const { id, monto } = variables;
      queryClient.setQueriesData({ queryKey: ["facturas"] }, (old: FacturasQueryResult | undefined) => {
        if (!old) return old;
        
        if (old.facturas && Array.isArray(old.facturas)) {
          return {
            ...old,
            facturas: old.facturas.map((factura: Factura) => 
              factura.id === id ? { ...factura, monto, isUpdating: false, pendingMonto: undefined } : factura
            )
          };
        }
        
        return old;
      });
    },
  });
};
