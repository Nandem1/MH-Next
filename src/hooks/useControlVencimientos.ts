import { useQuery } from "@tanstack/react-query";
import { controlVencimientosService } from "@/services/controlVencimientosService";

export function useControlVencimientos() {
  return useQuery({
    queryKey: ["control-vencimientos"],
    queryFn: controlVencimientosService.getControlVencimientos,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
} 