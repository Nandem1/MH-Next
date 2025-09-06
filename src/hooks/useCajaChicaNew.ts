"use client";

import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { gastosService, UsuarioCajaChica, RendicionUsuario } from '../services/gastosService';

interface EstadoCajaChica {
  usuario: UsuarioCajaChica;
  rendicion_activa: RendicionUsuario;
  alertas: {
    saldo_bajo: boolean;
    requiere_nomina: boolean;
    proximo_limite: number;
  };
}

export const useCajaChicaNew = () => {
  const { usuario } = useAuth();

  // Query para obtener estado de caja chica
  const {
    data: estado,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['usuario-caja-chica', usuario?.usuario_id],
    queryFn: async () => {
      const usuarioCajaChica = await gastosService.obtenerEstadoCajaChica();
      console.log('🔍 DEBUG useCajaChicaNew - fetchEstado:', { usuarioCajaChica });
      
      // Construir el estado con la estructura esperada
      const estadoCajaChica: EstadoCajaChica = {
        usuario: usuarioCajaChica,
        rendicion_activa: {
          id: usuarioCajaChica.rendicionId,
          usuario_id: usuarioCajaChica.usuarioId,
          monto_inicial: parseFloat(usuarioCajaChica.montoFijo),
          monto_final: parseFloat(usuarioCajaChica.montoActual),
          cantidad_gastos: usuarioCajaChica.rendicionGastosRegistrados,
          estado: 'activa',
          fecha_inicio: usuarioCajaChica.rendicionFechaInicio,
          created_at: new Date().toISOString()
        },
        alertas: {
          saldo_bajo: parseFloat(usuarioCajaChica.montoActual) < parseFloat(usuarioCajaChica.limiteMinimo),
          requiere_nomina: usuarioCajaChica.requiereReembolso,
          proximo_limite: parseFloat(usuarioCajaChica.limiteMinimo)
        }
      };
      
      return estadoCajaChica;
    },
    enabled: !!usuario?.usuario_id,
    staleTime: 30000, // 30 segundos
  });

  return {
    estado,
    loading,
    error,
    refetch,
  };
};
