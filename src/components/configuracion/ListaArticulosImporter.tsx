"use client";

import { Box, Button, Typography, IconButton, Grid, Snackbar, Alert, Card } from "@mui/material";
import { useState, ChangeEvent } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CancelIcon from '@mui/icons-material/Cancel';
import axios, { AxiosError } from "axios";
import { useSnackbar } from "@/hooks/useSnackbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function ListaArticulosImporter() {
  const { open, message, severity, showSnackbar, handleClose } = useSnackbar();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validar tipo de archivo
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      showSnackbar("Por favor selecciona un archivo Excel (.xls, .xlsx) o CSV", "error");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleClear = () => {
    setFile(null);
    setFileName(null);
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!file) {
      showSnackbar("Por favor selecciona un archivo", "error");
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${API_URL}/api-beta/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            }
          },
        }
      );

      // Procesar la respuesta del servidor
      const responseData = response.data;
      let successMessage = "✅ Carga completada";
      
      // Agregar información de registros si está disponible
      if (responseData.registros) {
        successMessage += `, ${responseData.registros} registros actualizados`;
      } else if (responseData.registros_procesados) {
        successMessage += `, ${responseData.registros_procesados} registros procesados`;
      } else if (responseData.registros_actualizados) {
        successMessage += `, ${responseData.registros_actualizados} registros actualizados`;
      } else if (responseData.message) {
        successMessage = responseData.message;
      } else {
        successMessage += ", lista de artículos actualizada";
      }

      showSnackbar(successMessage, "success");
      handleClear();
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string; error?: string }>;
      const errorMessage = axiosError.response?.data?.message || 
                          axiosError.response?.data?.error || 
                          "Error al cargar la lista de artículos";
      showSnackbar(errorMessage, "error");
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Box>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Importador de Lista de Artículos
      </Typography>

      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Configuración de Importación
        </Typography>
        
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              disabled={isLoading}
              fullWidth
              sx={{ height: 56, justifyContent: 'flex-start', px: 2 }}
            >
              {fileName || "Seleccionar Archivo"}
              <input
                type="file"
                accept=".xls,.xlsx,.csv"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
          </Grid>
        </Grid>

        {fileName && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Archivo seleccionado:
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {fileName}
            </Typography>
            <IconButton onClick={handleClear} size="small">
              <CancelIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {isLoading && uploadProgress > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Progreso de carga: {uploadProgress}%
            </Typography>
            <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1 }}>
              <Box
                sx={{
                  width: `${uploadProgress}%`,
                  height: 8,
                  bgcolor: 'primary.main',
                  borderRadius: 1,
                  transition: 'width 0.3s ease'
                }}
              />
            </Box>
          </Box>
        )}

        {file && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={isLoading}
              fullWidth
              startIcon={isLoading ? <Box sx={{ width: 16, height: 16, border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : undefined}
            >
              {isLoading ? "Cargando..." : "Cargar Lista de Artículos"}
            </Button>
          </Box>
        )}
      </Card>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Información de Importación
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          <strong>Formatos soportados:</strong> Excel (.xls, .xlsx) o CSV
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          <strong>Nota:</strong> Asegúrate de que el archivo contenga la estructura correcta de artículos antes de importar.
        </Typography>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

