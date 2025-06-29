import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { carteleriaService } from "@/services/carteleriaService";
import { Carteleria, CarteleriaAuditResult } from "@/types/carteleria";

export const useCarteleria = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("");
  const [filterDiscrepancia, setFilterDiscrepancia] = useState<string>("");

  const {
    data: carteleriaData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["auditoria-carteleria"],
    queryFn: carteleriaService.getAuditoriaCarteleria,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Función para procesar los datos y calcular discrepancias
  const processAuditData = (data: Carteleria[]): CarteleriaAuditResult[] => {
    return data.map((item) => {
      const precioDetalleCoincide = item.carteleria_precio_detalle === item.lista_precio_detalle;
      const precioMayoristaCoincide = item.carteleria_precio_mayorista === item.lista_precio_mayorista;
      
      return {
        carteleria: item,
        precioDetalleCoincide,
        precioMayoristaCoincide,
        diferenciaDetalle: item.carteleria_precio_detalle - item.lista_precio_detalle,
        diferenciaMayorista: item.carteleria_precio_mayorista - item.lista_precio_mayorista,
      };
    });
  };

  // Filtrar datos procesados
  const filteredData = carteleriaData ? processAuditData(carteleriaData).filter((item) => {
    const matchesSearch = 
      item.carteleria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.carteleria.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.carteleria.codigo_barras.includes(searchTerm);

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
  }) : [];

  // Obtener tipos únicos para el filtro
  const tiposUnicos = carteleriaData 
    ? [...new Set(carteleriaData.map(item => item.tipo_carteleria))]
    : [];

  // Estadísticas
  const estadisticas = carteleriaData ? (() => {
    const procesados = processAuditData(carteleriaData);
    const total = procesados.length;
    const conDiscrepancia = procesados.filter(item => 
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