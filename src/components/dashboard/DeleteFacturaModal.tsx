"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Fade,
  Slide,
  Grow,
} from "@mui/material";
import { Factura } from "@/types/factura";
import { AxiosError } from "axios";

interface DeleteFacturaModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (factura: Factura) => Promise<void>;
  factura: Factura | null;
  loading?: boolean;
}

export const DeleteFacturaModal: React.FC<DeleteFacturaModalProps> = ({
  open,
  onClose,
  onConfirm,
  factura,
  loading = false,
}) => {
  const [confirmationText, setConfirmationText] = useState("");
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("error");

  const requiredText = "BORRAR";
  const isConfirmationValid = confirmationText.toUpperCase() === requiredText;

  // Resetear estado cuando se cierra el modal
  useEffect(() => {
    if (!open) {
      setConfirmationText("");
      setError("");
      setSnackbarOpen(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConfirmationValid) {
      setError("Debe escribir exactamente 'BORRAR' para confirmar");
      return;
    }

    if (!factura) {
      setError("No se ha seleccionado una factura");
      return;
    }

    try {
      setError("");
      await onConfirm(factura);
      
      setSnackbarMessage("Factura eliminada exitosamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      
      // Cerrar modal después de mostrar éxito
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data?.message || "Error al eliminar la factura";
      
      setError(message);
      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleConfirmationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmationText(value);
    
    if (value && value.toUpperCase() !== requiredText) {
      setError(`Debe escribir exactamente '${requiredText}' para confirmar`);
    } else {
      setError("");
    }
  };

  if (!factura) return null;

  return (
    <Modal 
      open={open} 
      onClose={handleClose}
      keepMounted
      closeAfterTransition
    >
      <Fade in={open} timeout={300}>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1300,
            p: 2,
          }}
        >
          <Slide direction="up" in={open} timeout={400}>
            <Paper
              sx={{
                width: "100%",
                maxWidth: 500,
                p: 4,
                borderRadius: 2,
                backgroundColor: "background.paper",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Grow in={open} timeout={600}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3, textAlign: "center", fontWeight: 600, color: "error.main" }}>
                  Eliminar Factura
                </Typography>
              </Grow>

              <Grow in={open} timeout={700}>
                <Alert severity="warning" sx={{ mb: 3 }}>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                    Esta acción no se puede deshacer
                  </Typography>
                  <Typography variant="body2">
                    La factura será eliminada permanentemente de la base de datos.
                  </Typography>
                </Alert>
              </Grow>

              <Grow in={open} timeout={800}>
                <Box sx={{ 
                  mb: 3, 
                  p: 2, 
                  backgroundColor: "info.light",
                  background: "linear-gradient(135deg, rgba(2, 136, 209, 0.08) 0%, rgba(2, 136, 209, 0.12) 100%)",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "info.main",
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Factura a eliminar:
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="text.primary">
                    #{factura.folio} - {factura.proveedor}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monto: {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(factura.monto || 0)}
                  </Typography>
                </Box>
              </Grow>

              <Box component="form" onSubmit={handleSubmit}>
                <Grow in={open} timeout={900}>
                  <TextField
                    fullWidth
                    label={`Escriba "${requiredText}" para confirmar`}
                    value={confirmationText}
                    onChange={handleConfirmationChange}
                    error={!!error}
                    helperText={error}
                    disabled={loading}
                    sx={{ mb: 3 }}
                    autoComplete="off"
                    inputProps={{
                      style: { textTransform: 'uppercase' }
                    }}
                  />
                </Grow>

                <Grow in={open} timeout={1000}>
                  <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                    <Button
                      variant="outlined"
                      onClick={handleClose}
                      disabled={loading}
                      sx={{ minWidth: 100 }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="error"
                      disabled={!isConfirmationValid || loading}
                      sx={{ minWidth: 100 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Eliminar"
                      )}
                    </Button>
                  </Box>
                </Grow>
              </Box>

              <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                TransitionComponent={Slide}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                TransitionProps={{ direction: "down" } as any}
              >
                <Alert 
                  severity={snackbarSeverity} 
                  sx={{ width: "100%" }}
                  onClose={() => setSnackbarOpen(false)}
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar>
            </Paper>
          </Slide>
        </Box>
      </Fade>
    </Modal>
  );
};
