import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFacturaEstado } from "@/services/facturaService";

interface UpdateEstadoParams {
  facturaId: string;
  nuevoEstado: "BODEGA" | "SALA";
}

export const useUpdateEstado = (idUsuario: number | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ facturaId, nuevoEstado }: UpdateEstadoParams) => {
      if (!idUsuario) throw new Error("No hay usuario autenticado");
      await updateFacturaEstado(facturaId, nuevoEstado, idUsuario);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      queryClient.refetchQueries({ queryKey: ["facturas"] });
    }
  });
};
