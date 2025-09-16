// src/hooks/useFacturas.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFacturas, actualizarMontoFactura, actualizarMetodoPagoFactura, actualizarFechaPagoFactura, actualizarCamposBasicosFactura, deleteFactura } from "@/services/facturaService";
import { Factura, ActualizarMetodoPagoRequest, ActualizarFechaPagoRequest, ActualizarCamposBasicosRequest } from "@/types/factura";
import { adaptFactura } from "@/utils/adaptFactura";

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
  folio?: string,
  chequeCorrelativo?: string,
  fechaDesde?: string,
  fechaHasta?: string,
  prontasAPagar?: boolean
) => {
  const queryClient = useQueryClient();
  const result = useQuery<{ facturas: Factura[]; total: number }>({
    queryKey: ["facturas", page, limit, local ?? "", usuario ?? "", proveedor ?? "", folio ?? "", chequeCorrelativo ?? "", fechaDesde ?? "", fechaHasta ?? "", prontasAPagar ?? false],
    queryFn: () => getFacturas(page, limit, local, usuario, proveedor, folio, chequeCorrelativo, fechaDesde, fechaHasta, prontasAPagar),
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

      // Optimistic update: actualizar todos los campos relevantes
      previousFacturas.forEach(([queryKey, old]) => {
        const current = old as FacturasQueryResult | undefined;
        if (!current?.facturas) return;
        queryClient.setQueryData(queryKey, {
          ...current,
          facturas: current.facturas.map((factura: Factura) =>
            factura.id === data.id
              ? {
                  ...factura,
                  metodo_pago: data.metodo_pago,
                  monto_pagado: data.monto_pagado,
                  cheque_correlativo: data.metodo_pago === "CHEQUE" ? data.cheque?.correlativo : undefined,
                  isUpdating: true,
                  pendingMetodoPago: data.metodo_pago,
                }
              : factura
          ),
        });
      });

      // Optimistic también para la entidad individual
      const currentEntity = queryClient.getQueryData<Factura>(["factura", data.id]);
      if (currentEntity) {
        queryClient.setQueryData(["factura", data.id], {
          ...currentEntity,
          metodo_pago: data.metodo_pago,
          monto_pagado: data.monto_pagado,
          cheque_correlativo: data.metodo_pago === "CHEQUE" ? data.cheque?.correlativo : undefined,
          isUpdating: true,
          pendingMetodoPago: data.metodo_pago,
        });
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
      // Invalidar queries para asegurar que los datos estén sincronizados
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      console.error("Error en mutación de método de pago de factura:", err);
    },
    onSuccess: (response, variables) => {
      // Usar la respuesta del backend para actualizar todos los campos
      const facturaActualizada = adaptFactura(response);
      const { id } = variables;
      
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
                  ...facturaActualizada,
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
          ...facturaActualizada,
          isUpdating: false,
          pendingMetodoPago: undefined,
        });
      }
      
      // Invalidar queries para asegurar que los datos estén sincronizados
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      
      // Si es cheque, invalidar también las queries de cheques para mantener sincronización
      if (variables.metodo_pago === "CHEQUE") {
        queryClient.invalidateQueries({ queryKey: ["cheques", "proveedor"] });
      }
    },
  });
};

// Hook para actualizar fecha de pago de facturas con optimistic update
export const useActualizarFechaPagoFactura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ActualizarFechaPagoRequest) => 
      actualizarFechaPagoFactura(data),
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
              ? { ...factura, isUpdating: true, pendingFechaPago: data.fecha_pago }
              : factura
          ),
        });
      });

      // Optimistic también para la entidad individual
      const currentEntity = queryClient.getQueryData<Factura>(["factura", data.id]);
      if (currentEntity) {
        queryClient.setQueryData(["factura", data.id], { ...currentEntity, isUpdating: true, pendingFechaPago: data.fecha_pago });
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
      console.error("Error en mutación de fecha de pago de factura:", err);
    },
    onSuccess: (response, variables) => {
      // Usar la respuesta del backend para actualizar todos los campos
      const facturaActualizada = adaptFactura(response);
      const { id } = variables;
      
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
                  ...facturaActualizada,
                  isUpdating: false,
                  pendingFechaPago: undefined,
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
          ...facturaActualizada,
          isUpdating: false,
          pendingFechaPago: undefined,
        });
      }
      
      // Evitar refetch que borre el cambio optimista
      // queryClient.invalidateQueries({ queryKey: ["facturas"] });
    },
  });
};

// Hook para actualizar campos básicos de facturas con optimistic update
export const useActualizarCamposBasicosFactura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ActualizarCamposBasicosRequest) => 
      actualizarCamposBasicosFactura(data.id, {
        folio: data.folio,
        id_local: data.id_local,
        id_usuario: data.id_usuario,
        id_proveedor: data.id_proveedor,
      }),
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
              ? { ...factura, isUpdating: true }
              : factura
          ),
        });
      });

      // Optimistic también para la entidad individual
      const currentEntity = queryClient.getQueryData<Factura>(["factura", data.id]);
      if (currentEntity) {
        queryClient.setQueryData(["factura", data.id], { ...currentEntity, isUpdating: true });
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
      console.error("Error en mutación de campos básicos de factura:", err);
    },
    onSuccess: (response, variables) => {
      // Usar la respuesta del backend para actualizar todos los campos
      const facturaActualizada = adaptFactura(response);
      const { id } = variables;
      
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
                  ...facturaActualizada,
                  isUpdating: false,
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
          ...facturaActualizada,
          isUpdating: false,
        });
      }
      
      // Invalidar queries para asegurar que los datos estén sincronizados
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
    },
  });
};

// Hook para eliminar facturas con optimistic update
export const useDeleteFactura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFactura(id),
    onMutate: async (id) => {
      // Cancelar queries en curso para evitar que sobrescriban nuestro optimistic update
      await queryClient.cancelQueries({ queryKey: ["facturas"] });

      // Guardar el estado anterior para poder revertir si es necesario
      const previousFacturas = queryClient.getQueriesData({ queryKey: ["facturas"] });

      // Optimistic update: remover la factura de todas las listas
      previousFacturas.forEach(([queryKey, old]) => {
        const current = old as FacturasQueryResult | undefined;
        if (!current?.facturas) return;
        queryClient.setQueryData(queryKey, {
          ...current,
          facturas: current.facturas.filter((factura: Factura) => factura.id !== id),
          total: current.total - 1,
        });
      });

      // Remover entidad individual del cache
      queryClient.removeQueries({ queryKey: ["factura", id] });

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
      console.error("Error en mutación de eliminación de factura:", err);
    },
    onSuccess: () => {
      // Invalidar todas las queries de facturas para asegurar sincronización
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
    },
  });
};
