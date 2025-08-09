// src/hooks/useFacturas.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFacturas, actualizarMontoFactura, actualizarMetodoPagoFactura } from "@/services/facturaService";
import { Factura, ActualizarMetodoPagoRequest } from "@/types/factura";

interface FacturasQueryResult {
  facturas: Factura[];
  total: number;
}

export const useFacturas = (
  page: number,
  limit: number,
  local?: string,
  usuario?: string,
  proveedor?: string,
  folio?: string
) => {
  const queryClient = useQueryClient();
  const result = useQuery<{ facturas: Factura[]; total: number }>({
    queryKey: ["facturas", page, limit, local ?? "", usuario ?? "", proveedor ?? "", folio ?? ""],
    queryFn: () => getFacturas(page, limit, local, usuario, proveedor, folio),
    // Usar configuración global del QueryClient
    // staleTime, retry, refetchOnWindowFocus, etc. se manejan globalmente
  });

  // Normalizar por id cuando lleguen datos
  if (result.data?.facturas) {
    result.data.facturas.forEach((f: Factura) => {
      queryClient.setQueryData(["factura", f.id], f);
    });
  }

  return result;
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
      previousFacturas.forEach(([queryKey, old]) => {
        const current = old as FacturasQueryResult | undefined;
        if (!current?.facturas) return;
        queryClient.setQueryData(queryKey, {
          ...current,
          facturas: current.facturas.map((factura: Factura) =>
            factura.id === id ? { ...factura, isUpdating: true, pendingMonto: monto } : factura
          ),
        });
      });

      // Optimistic también para la entidad individual
      const currentEntity = queryClient.getQueryData<Factura>(["factura", id]);
      if (currentEntity) {
        queryClient.setQueryData(["factura", id], { ...currentEntity, isUpdating: true, pendingMonto: monto });
      }

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
      const all = queryClient.getQueriesData({ queryKey: ["facturas"] });
      all.forEach(([queryKey, old]) => {
        const current = old as FacturasQueryResult | undefined;
        if (!current?.facturas) return;
        queryClient.setQueryData(queryKey, {
          ...current,
          facturas: current.facturas.map((factura: Factura) =>
            factura.id === id ? { ...factura, monto, isUpdating: false, pendingMonto: undefined } : factura
          ),
        });
      });
      // Actualizar entidad individual
      const currentEntity = queryClient.getQueryData<Factura>(["factura", id]);
      if (currentEntity) {
        queryClient.setQueryData(["factura", id], { ...currentEntity, monto, isUpdating: false, pendingMonto: undefined });
      }
      // Evitar refetch que borre el cambio optimista
      // queryClient.invalidateQueries({ queryKey: ["facturas"] });
    },
  });
};

// Hook para actualizar método de pago de facturas con optimistic update
export const useActualizarMetodoPagoFactura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ActualizarMetodoPagoRequest) => 
      actualizarMetodoPagoFactura(data),
    onMutate: async (data) => {
      // Cancelar queries en curso para evitar que sobrescriban nuestro optimistic update
      await queryClient.cancelQueries({ queryKey: ["facturas"] });

      // Guardar el estado anterior para poder revertir si es necesario
      const previousFacturas = queryClient.getQueriesData({ queryKey: ["facturas"] });

      // Optimistic update: marcar la factura como "updating"
      previousFacturas.forEach(([queryKey, old]) => {
        const current = old as FacturasQueryResult | undefined;
        if (!current?.facturas) return;
        queryClient.setQueryData(queryKey, {
          ...current,
          facturas: current.facturas.map((factura: Factura) =>
            factura.id === data.id
              ? { ...factura, isUpdating: true, pendingMetodoPago: data.metodo_pago }
              : factura
          ),
        });
      });

      // Optimistic también para la entidad individual
      const currentEntity = queryClient.getQueryData<Factura>(["factura", data.id]);
      if (currentEntity) {
        queryClient.setQueryData(["factura", data.id], { ...currentEntity, isUpdating: true, pendingMetodoPago: data.metodo_pago });
      }

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
      console.error("Error en mutación de método de pago de factura:", err);
    },
    onSuccess: (_, variables) => {
      // Actualizar el método de pago real y quitar el estado de updating
      const { id, metodo_pago, monto_pagado, cheque } = variables;
      const all = queryClient.getQueriesData({ queryKey: ["facturas"] });
      all.forEach(([queryKey, old]) => {
        const current = old as FacturasQueryResult | undefined;
        if (!current?.facturas) return;
        queryClient.setQueryData(queryKey, {
          ...current,
          facturas: current.facturas.map((factura: Factura) =>
            factura.id === id
              ? {
                  ...factura,
                  metodo_pago,
                  monto_pagado,
                  cheque_correlativo: cheque?.correlativo,
                  isUpdating: false,
                  pendingMetodoPago: undefined,
                }
              : factura
          ),
        });
      });
      // Actualizar entidad individual
      const currentEntity = queryClient.getQueryData<Factura>(["factura", id]);
      if (currentEntity) {
        queryClient.setQueryData(["factura", id], {
          ...currentEntity,
          metodo_pago,
          monto_pagado,
          cheque_correlativo: cheque?.correlativo,
          isUpdating: false,
          pendingMetodoPago: undefined,
        });
      }
      // Evitar refetch que borre el cambio optimista
      // queryClient.invalidateQueries({ queryKey: ["facturas"] });
    },
  });
};
