import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { carteleriaService } from "@/services/carteleriaService";
import { Carteleria, CarteleriaAuditResult } from "@/types/carteleria";

export const useCarteleria = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("");
  const [filterDiscrepancia, setFilterDiscrepancia] = useState<string>("");

  const {
    data: carteleriaDataRaw,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["auditoria-carteleria"],
    queryFn: carteleriaService.getAuditoriaCarteleria,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Deduplicar datos por carteleria_id (solución temporal para el problema del backend)
  const carteleriaData = carteleriaDataRaw ? (() => {
    const seen = new Set();
    return carteleriaDataRaw.filter(item => {
      if (seen.has(item.carteleria_id)) {
        return false;
      }
      seen.add(item.carteleria_id);
      return true;
    });
  })() : undefined;

  // Función para procesar los datos y calcular discrepancias
  const processAuditData = (data: Carteleria[]): CarteleriaAuditResult[] => {
    return data.map((item) => {
      // Casos especiales donde los precios se consideran iguales
      const isPalletUnico = item.tipo_carteleria === "PALLET UNICO";
      const isUnico = item.tipo_carteleria === "UNICO";
      
      // Si es PALLET UNICO o UNICO, los precios se consideran iguales
      if (isPalletUnico || isUnico) {
        return {
          carteleria: item,
          precioDetalleCoincide: true,
          precioMayoristaCoincide: true,
          diferenciaDetalle: 0,
          diferenciaMayorista: 0,
        };
      }
      
      // Obtener precios de lista con manejo de null
      const listaPrecioDetalle = item.lista_precio_detalle ?? 0;
      const listaPrecioMayorista = item.lista_precio_mayorista ?? 0;
      
      // Si no hay precio configurado en la lista (0), se considera correcto
      const precioDetalleCoincide = listaPrecioDetalle === 0 || item.carteleria_precio_detalle === listaPrecioDetalle;
      const precioMayoristaCoincide = listaPrecioMayorista === 0 || item.carteleria_precio_mayorista === listaPrecioMayorista;
      
      return {
        carteleria: item,
        precioDetalleCoincide,
        precioMayoristaCoincide,
        diferenciaDetalle: item.carteleria_precio_detalle - listaPrecioDetalle,
        diferenciaMayorista: item.carteleria_precio_mayorista - listaPrecioMayorista,
      };
    });
  };

  // Filtrar datos procesados
  const processedData = carteleriaData ? processAuditData(carteleriaData) : [];
  
  const filteredData = processedData.filter((item) => {
    
    const searchTermLower = searchTerm.toLowerCase();
    
    const matchesSearch = 
      (item.carteleria.nombre?.toLowerCase().includes(searchTermLower) ?? false) ||
      (item.carteleria.codigo?.toLowerCase().includes(searchTermLower) ?? false) ||
      (item.carteleria.codigo_barras?.toString().toLowerCase().includes(searchTermLower) ?? false) ||
      (item.carteleria.nombre_producto?.toLowerCase().includes(searchTermLower) ?? false) ||
      (item.carteleria.codigo_producto?.toLowerCase().includes(searchTermLower) ?? false) ||
      (item.carteleria.nombre_pack?.toLowerCase().includes(searchTermLower) ?? false) ||
      (item.carteleria.codigo_pack?.toLowerCase().includes(searchTermLower) ?? false) ||
      (item.carteleria.codigo_articulo?.toLowerCase().includes(searchTermLower) ?? false) ||
      (item.carteleria.nombre_articulo?.toLowerCase().includes(searchTermLower) ?? false);

    const matchesTipo = filterTipo === "" || item.carteleria.tipo_carteleria === filterTipo;

    const matchesDiscrepancia = (() => {
      switch (filterDiscrepancia) {
        case "discrepancia":
          return !item.precioDetalleCoincide || !item.precioMayoristaCoincide;
        case "coincide":
          return item.precioDetalleCoincide && item.precioMayoristaCoincide;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesTipo && matchesDiscrepancia;
  });

  // Obtener tipos únicos para el filtro
  const tiposUnicos = carteleriaData 
    ? [...new Set(carteleriaData.map(item => item.tipo_carteleria))]
    : [];

  // Estadísticas
  const estadisticas = carteleriaData ? (() => {
    const total = processedData.length;
    const conDiscrepancia = processedData.filter(item => 
      !item.precioDetalleCoincide || !item.precioMayoristaCoincide
    ).length;
    const coinciden = total - conDiscrepancia;

    return {
      total,
      conDiscrepancia,
      coinciden,
      porcentajeDiscrepancia: total > 0 ? ((conDiscrepancia / total) * 100).toFixed(1) : "0",
    };
  })() : { total: 0, conDiscrepancia: 0, coinciden: 0, porcentajeDiscrepancia: "0" };

  return {
    data: filteredData,
    isLoading,
    error,
    refetch,
    isRefetching,
    searchTerm,
    setSearchTerm,
    filterTipo,
    setFilterTipo,
    filterDiscrepancia,
    setFilterDiscrepancia,
    tiposUnicos,
    estadisticas,
  };
}; 