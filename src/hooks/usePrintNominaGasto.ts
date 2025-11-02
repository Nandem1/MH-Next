import { useCallback, useState } from 'react';
import { NominaGasto } from '@/types/nominasGastos';

interface PrintOptions {
  formato?: 'A4' | 'A3' | 'Letter';
  orientacion?: 'portrait' | 'landscape';
  incluirLogo?: boolean;
  incluirFirma?: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const usePrintNominaGasto = () => {
  const [loading, setLoading] = useState(false);

  const printNominaGasto = useCallback(async (nomina: NominaGasto, options: PrintOptions = {}) => {
    setLoading(true);
    
    try {
      // Obtener token de autenticación
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticación no encontrado. Por favor, inicia sesión nuevamente.');
      }

      // Configuración por defecto
      const defaultOptions: PrintOptions = {
        formato: 'A4',
        orientacion: 'portrait',
        incluirLogo: true,
        incluirFirma: false,
        ...options
      };

      // Construir URL con parámetros
      const baseUrl = `${BASE_URL}/api-beta/nominas-gastos`;
      const params = new URLSearchParams({
        formato: defaultOptions.formato!,
        orientacion: defaultOptions.orientacion!,
        incluirLogo: defaultOptions.incluirLogo!.toString(),
        incluirFirma: defaultOptions.incluirFirma!.toString(),
      });

      const pdfUrl = `${baseUrl}/${nomina.id}/pdf?${params.toString()}`;

      // Hacer petición con autenticación usando fetch
      const response = await fetch(pdfUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/pdf',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token de autenticación inválido o expirado. Por favor, inicia sesión nuevamente.');
        }
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }

      // Obtener el PDF como blob
      const pdfBlob = await response.blob();
      const pdfUrlBlob = URL.createObjectURL(pdfBlob);

      // Crear un iframe oculto para imprimir
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = pdfUrlBlob;
      
      document.body.appendChild(iframe);
      
      // Esperar a que se cargue el PDF y luego imprimir
      iframe.onload = () => {
        // Primero terminar el loading
        setLoading(false);
        
        // Esperar a que el Backdrop se elimine completamente del DOM
        setTimeout(() => {
          // Configurar eventos de impresión ANTES de abrir el modal
          const printWindow = iframe.contentWindow;
          
          if (printWindow) {
            // Limpiar cuando el usuario termine de imprimir o cancele
            const cleanup = () => {
              try {
                document.body.removeChild(iframe);
                URL.revokeObjectURL(pdfUrlBlob);
              } catch (e) {
                // Iframe ya eliminado
                console.error('Error al eliminar el iframe:', e);
              }
            };
            
            // Eventos para detectar cuando se cierra el modal de impresión
            printWindow.addEventListener('afterprint', cleanup);
            printWindow.addEventListener('beforeunload', cleanup);
            
            // Backup: limpiar después de 30 segundos si no se detecta el evento
            setTimeout(cleanup, 30000);
            
            // Ahora sí abrir el modal de impresión
            printWindow.print();
          }
        }, 500);
      };

    } catch (error) {
      console.error('Error al generar PDF:', error);
      setLoading(false);
      throw new Error('Error al generar el PDF para impresión');
    }
  }, []);

  return {
    printNominaGasto,
    loading,
  };
};
