// src/hooks/useFacturas.ts
import { useQuery } from '@tanstack/react-query';
import { getFacturas } from '@/services/facturaService';

export const useFacturas = () => {
  return useQuery({
    queryKey: ['facturas'],
    queryFn: getFacturas,
  });
};
