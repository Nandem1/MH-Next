"use client";

import { Box, Typography, TextField, Button, CircularProgress, Snackbar, Alert, Modal } from "@mui/material";



import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { register } from "@/services/authService";

export interface NuevoUsuarioModalProps {
  open: boolean;
  onClose: () => void;
  onUsuarioCreado?: () => void;
}

export default function NuevoUsuarioModal({
  open,
  onClose,
  onUsuarioCreado,
}: NuevoUsuarioModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (email && !isEmailValid(email)) {
      setErrorEmail("El correo electrónico no es válido.");
    } else {
      setErrorEmail("");
    }
  }, [email]);

  useEffect(() => {
    if (password && password.length < 6) {
      setErrorPassword("La contraseña debe tener al menos 6 caracteres.");
    } else {
      setErrorPassword("");
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (errorEmail || errorPassword || !email || !password) return;

    try {
      setLoading(true);
      await register(email, password);

      setSnackbarOpen(true);
      setEmail("");
      setPassword("");
      onClose();
      onUsuarioCreado?.();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data?.message || "❌ Error al registrar.";

      if (message?.toLowerCase().includes("correo")) setErrorEmail(message);
      else if (message?.toLowerCase().includes("contraseña")) setErrorPassword(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} keepMounted>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 360,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Crear nuevo usuario
        </Typography>

        <TextField
          label="Correo electrónico"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errorEmail}
          helperText={errorEmail}
        />

        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errorPassword}
          helperText={errorPassword}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading || !!errorEmail || !!errorPassword}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Crear usuario"}
        </Button>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Cuenta registrada exitosamente
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
}