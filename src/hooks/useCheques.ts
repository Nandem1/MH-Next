// src/hooks/useCheques.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getCheques, 
  getChequeById, 
  getChequeByCorrelativo, 
  createCheque, 
  updateCheque, 
  deleteCheque,
  getChequeByFactura,
  getChequesByProveedor,
  getEstadisticasChequesByProveedor,
  getFacturasByCheque,
  getChequesDisponibles,
} from "@/services/chequeService";
import { getNotasCreditoByFactura } from "@/services/notaCreditoService";
import { CrearChequeRequest, ActualizarChequeRequest } from "@/types/factura";

// Hook para obtener todos los cheques
export const useCheques = (limit: number = 50, offset: number = 0) => {
  return useQuery({
    queryKey: ["cheques", limit, offset],
    queryFn: async () => {
  
      const result = await getCheques(limit, offset);
      
      return result;
    },
  });
};

// Hook para obtener cheques disponibles (nuevo sistema binario)
export const useChequesDisponibles = (limit: number = 50, offset: number = 0) => {
  return useQuery({
    queryKey: ["cheques", "disponibles", limit, offset],
    queryFn: async () => {
  
      const result = await getChequesDisponibles(limit, offset);
      
      return result;
    },
  });
};

// Hook para obtener un cheque por ID
export const useChequeById = (id: number) => {
  return useQuery({
    queryKey: ["cheque", id],
    queryFn: () => getChequeById(id),
    enabled: !!id, // Solo ejecutar si hay un ID válido
  });
};

// Hook para obtener un cheque por correlativo
export const useChequeByCorrelativo = (correlativo: string) => {
  return useQuery({
    queryKey: ["cheque", "correlativo", correlativo],
    queryFn: () => getChequeByCorrelativo(correlativo),
    enabled: !!correlativo, // Solo ejecutar si hay un correlativo válido
  });
};

// Hook para obtener el cheque de una factura
export const useChequeByFactura = (facturaId: number) => {
  return useQuery({
    queryKey: ["cheque", "factura", facturaId],
    queryFn: () => getChequeByFactura(facturaId),
    enabled: !!facturaId, // Solo ejecutar si hay un ID de factura válido
  });
};

// Hook para obtener cheques por proveedor
export const useChequesByProveedor = (idProveedor: number, limit: number = 50, offset: number = 0) => {
  return useQuery({
    queryKey: ["cheques", "proveedor", idProveedor, limit, offset],
    queryFn: () => getChequesByProveedor(idProveedor, limit, offset),
    enabled: !!idProveedor, // Solo ejecutar si hay un ID de proveedor válido
  });
};

// Hook para obtener estadísticas de cheques por proveedor
export const useEstadisticasChequesByProveedor = (idProveedor: number) => {
  return useQuery({
    queryKey: ["cheques", "estadisticas", "proveedor", idProveedor],
    queryFn: () => getEstadisticasChequesByProveedor(idProveedor),
    enabled: !!idProveedor, // Solo ejecutar si hay un ID de proveedor válido
  });
};

// Hook para obtener facturas de un cheque específico
export const useFacturasByCheque = (idCheque: number) => {
  return useQuery({
    queryKey: ["cheques", "facturas", idCheque],
    queryFn: () => getFacturasByCheque(idCheque),
    enabled: !!idCheque, // Solo ejecutar si hay un ID de cheque válido
  });
};

// Hook para obtener notas de crédito de una factura
export function useNotasCreditoByFactura(facturaId: number) {
  return useQuery({
    queryKey: ['notas-credito', 'factura', facturaId],
    queryFn: () => getNotasCreditoByFactura(facturaId),
    enabled: facturaId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para obtener notas de crédito de múltiples facturas de un cheque
export function useNotasCreditoByCheque(facturas: { id_factura: number; folio: string; monto_asignado: number; monto_factura: number; id_proveedor: number; proveedor: string; rut_proveedor: string }[]) {
  // Filtrar facturas con IDs válidos
  const facturasValidas = facturas.filter(f => f.id_factura && f.id_factura > 0);
  
  return useQuery({
    queryKey: ['notas-credito', 'cheque', facturasValidas.map(f => f.id_factura)],
    queryFn: async () => {
      const todasLasNotasCredito: Array<{ 
        monto: number; 
        facturaId: number; 
        facturaFolio: string;
        id?: number;
        folio_nc?: string;
      }> = [];
      let totalNotasCredito = 0;

      // Si no hay facturas válidas, retornar valores por defecto
      if (facturasValidas.length === 0) {
        return {
          totalNotasCredito: 0,
          notasCredito: [],
          detalles: []
        };
      }

      // Obtener notas de crédito de todas las facturas en paralelo
      const promises = facturasValidas.map(async (factura) => {
        try {
  
          const response = await getNotasCreditoByFactura(factura.id_factura);
          const notasCredito = response.data?.notas_credito || [];
          const montoNotasCredito = notasCredito.reduce((sum: number, nc: { monto: number }) => sum + Math.round(nc.monto || 0), 0);
          
          
          
          return {
            facturaId: factura.id_factura,
            facturaFolio: factura.folio,
            notasCredito,
            montoNotasCredito
          };
        } catch (error) {
          console.error(`❌ Error obteniendo notas de crédito de factura ${factura.id_factura}:`, error);
          return {
            facturaId: factura.id_factura,
            facturaFolio: factura.folio,
            notasCredito: [],
            montoNotasCredito: 0
          };
        }
      });

      const results = await Promise.all(promises);
      
      results.forEach(result => {
        totalNotasCredito += result.montoNotasCredito;
        todasLasNotasCredito.push(...result.notasCredito.map((nc: { monto: number; id?: number; folio_nc?: string }) => ({
          ...nc,
          facturaId: result.facturaId,
          facturaFolio: result.facturaFolio
        })));
      });

      

      return {
        totalNotasCredito,
        notasCredito: todasLasNotasCredito,
        detalles: results
      };
    },
    enabled: facturasValidas.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para crear un nuevo cheque
export const useCreateCheque = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CrearChequeRequest) => createCheque(data),
    onSuccess: () => {
      // Invalidar queries de cheques para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["cheques"] });
    },
  });
};

// Hook para actualizar un cheque
export const useUpdateCheque = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ActualizarChequeRequest }) => 
      updateCheque(id, data),
    onSuccess: (_, variables) => {
      // Invalidar queries específicas
      queryClient.invalidateQueries({ queryKey: ["cheques"] });
      queryClient.invalidateQueries({ queryKey: ["cheque", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["cheque", "correlativo"] });
    },
  });
};

// Hook para eliminar un cheque
export const useDeleteCheque = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCheque(id),
    onSuccess: () => {
      // Invalidar queries de cheques para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["cheques"] });
    },
  });
}; 