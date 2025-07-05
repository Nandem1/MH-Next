import { useState } from "react";
import { crearControlVencimiento } from "../services/vencimientosService";
import { VencimientoFormData } from "../types/vencimientos";

export const useVencimientosForm = () => {
  const [formData, setFormData] = useState<VencimientoFormData>({
    codigo_barras: "",
    fecha_vencimiento: "",
    cantidad: "1",
    lote: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        codigo_barras: formData.codigo_barras.trim(),
        fecha_vencimiento: formData.fecha_vencimiento,
        cantidad: parseInt(formData.cantidad) || 1,
        lote: formData.lote.trim() || undefined,
      };

      const response = await crearControlVencimiento(payload);

      if (!response.success) {
        throw new Error(response.error || response.message || "Error al registrar vencimiento");
      }

      setSuccess(true);
      
      // Limpiar el formulario pero mantener el mensaje de éxito por 3 segundos
      setFormData({
        codigo_barras: "",
        fecha_vencimiento: "",
        cantidad: "1",
        lote: "",
      });
      
      // Ocultar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      codigo_barras: "",
      fecha_vencimiento: "",
      cantidad: "1",
      lote: "",
    });
    setError(null);
    setSuccess(false);
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    success,
    resetForm,
  };
}; 