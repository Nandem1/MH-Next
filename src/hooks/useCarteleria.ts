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
      // Obtener precios de lista con manejo de null y convertir a números
      const listaPrecioDetalle = Number(item.lista_precio_detalle ?? 0);
      const listaPrecioMayorista = Number(item.lista_precio_mayorista ?? 0);
      const carteleriaPrecioDetalle = Number(item.carteleria_precio_detalle ?? 0);
      let carteleriaPrecioMayorista = Number(item.carteleria_precio_mayorista ?? 0);
      
      // Para UNICO y PALLET UNICO, el mayorista debe ser igual al detalle
      if (item.tipo_carteleria === "UNICO" || item.tipo_carteleria === "PALLET UNICO") {
        carteleriaPrecioMayorista = carteleriaPrecioDetalle;
      }
      
      // Debug: Log para ver qué está pasando
      if (item.tipo_carteleria === "UNICO" || item.tipo_carteleria === "PALLET UNICO") {
        console.log("Debug UNICO/PALLET:", {
          tipo: item.tipo_carteleria,
          carteleria_detalle: carteleriaPrecioDetalle,
          lista_detalle: listaPrecioDetalle,
          carteleria_mayorista_original: Number(item.carteleria_precio_mayorista ?? 0),
          carteleria_mayorista_ajustado: carteleriaPrecioMayorista,
          lista_mayorista: listaPrecioMayorista,
          detalle_igual: carteleriaPrecioDetalle === listaPrecioDetalle,
          mayorista_igual: carteleriaPrecioMayorista === listaPrecioMayorista
        });
      }
      
      // Calcular discrepancias - si no hay precio en lista (0), no es discrepancia
      const precioDetalleCoincide = 
        listaPrecioDetalle === 0 || // Si no hay precio en lista, no es discrepancia
        (carteleriaPrecioDetalle === 0 && listaPrecioDetalle === 0) || // Ambos 0 = coincidencia
        carteleriaPrecioDetalle === listaPrecioDetalle; // Mismo precio = coincidencia
      
      const precioMayoristaCoincide = 
        listaPrecioMayorista === 0 || // Si no hay precio en lista, no es discrepancia
        (carteleriaPrecioMayorista === 0 && listaPrecioMayorista === 0) || // Ambos 0 = coincidencia
        carteleriaPrecioMayorista === listaPrecioMayorista; // Mismo precio = coincidencia
      
      return {
        carteleria: item,
        precioDetalleCoincide,
        precioMayoristaCoincide,
        diferenciaDetalle: carteleriaPrecioDetalle - listaPrecioDetalle,
        diferenciaMayorista: carteleriaPrecioMayorista - listaPrecioMayorista,
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