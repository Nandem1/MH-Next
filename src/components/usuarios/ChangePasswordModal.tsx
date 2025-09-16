"use client";

import React, { useState } from "react";
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
import { changePassword } from "@/services/authService";
import { AxiosError } from "axios";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorCurrentPassword, setErrorCurrentPassword] = useState("");
  const [errorNewPassword, setErrorNewPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  // Validación en tiempo real
  React.useEffect(() => {
    if (newPassword && newPassword.length < 8) {
      setErrorNewPassword("La contraseña debe tener al menos 8 caracteres.");
    } else {
      setErrorNewPassword("");
    }
  }, [newPassword]);

  React.useEffect(() => {
    if (confirmPassword && newPassword && confirmPassword !== newPassword) {
      setErrorConfirmPassword("Las contraseñas no coinciden.");
    } else {
      setErrorConfirmPassword("");
    }
  }, [confirmPassword, newPassword]);

  // Resetear estado cuando se cierra el modal
  React.useEffect(() => {
    if (!open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrorCurrentPassword("");
      setErrorNewPassword("");
      setErrorConfirmPassword("");
      setSnackbarOpen(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (errorNewPassword || errorConfirmPassword || !currentPassword || !newPassword || !confirmPassword) {
      return;
    }

    try {
      setLoading(true);
      const response = await changePassword(currentPassword, newPassword);

      if (response.success) {
        setSnackbarMessage(response.message);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        
        // Limpiar formulario
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        
        // Cerrar modal después de mostrar éxito
        setTimeout(() => {
          onClose();
          onSuccess?.();
        }, 1500);
      } else {
        setSnackbarMessage(response.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data?.message || "Error al cambiar la contraseña";
      
      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const disabled = loading || !currentPassword || !newPassword || !confirmPassword || !!errorNewPassword || !!errorConfirmPassword;

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
                maxWidth: 400,
                p: 4,
                borderRadius: 2,
                backgroundColor: "background.paper",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Grow in={open} timeout={600}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3, textAlign: "center", fontWeight: 600, color: "text.primary" }}>
                  🔒 Cambiar Contraseña
                </Typography>
              </Grow>

              <Grow in={open} timeout={700}>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                  Cambia tu contraseña actual por una nueva
                </Typography>
              </Grow>

              <Box component="form" onSubmit={handleSubmit}>
                <Grow in={open} timeout={800}>
                  <TextField
                    fullWidth
                    label="Contraseña Actual"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    error={!!errorCurrentPassword}
                    helperText={errorCurrentPassword}
                    required
                    disabled={loading}
                    sx={{ mb: 2 }}
                  />
                </Grow>

                <Grow in={open} timeout={900}>
                  <TextField
                    fullWidth
                    label="Nueva Contraseña"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    error={!!errorNewPassword}
                    helperText={errorNewPassword || "Mínimo 8 caracteres"}
                    required
                    disabled={loading}
                    sx={{ mb: 2 }}
                  />
                </Grow>

                <Grow in={open} timeout={1000}>
                  <TextField
                    fullWidth
                    label="Confirmar Nueva Contraseña"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={!!errorConfirmPassword}
                    helperText={errorConfirmPassword}
                    required
                    disabled={loading}
                    sx={{ mb: 3 }}
                  />
                </Grow>

                <Grow in={open} timeout={1100}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={disabled}
                    sx={{ mb: 2, py: 1.25, fontWeight: 600 }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Cambiar Contraseña"
                    )}
                  </Button>
                </Grow>

                <Grow in={open} timeout={1200}>
                  <Button
                    fullWidth
                    variant="text"
                    onClick={handleClose}
                    disabled={loading}
                    sx={{ color: "text.secondary" }}
                  >
                    Cancelar
                  </Button>
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
