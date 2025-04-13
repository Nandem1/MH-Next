"use client";

import { useAuth } from "@/hooks/useAuth";
import { useSnackbar } from "@/hooks/useSnackbar"; // 👈 Nuevo hook
import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Paper, Snackbar, Alert } from "@mui/material";

export default function LoginPage() {
  const { login } = useAuth();
  const { open, message, severity, showSnackbar, handleClose } = useSnackbar();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  useEffect(() => {
    const showLogoutMessage = localStorage.getItem("showLogoutMessage");
    if (showLogoutMessage === "true") {
      showSnackbar("Sesión cerrada exitosamente", "success");
      localStorage.removeItem("showLogoutMessage"); // ✅ Limpiamos la marca después
    }
  }, [showSnackbar]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" mb={2} fontWeight="bold" textAlign="center">
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Correo electrónico"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Iniciar Sesión
          </Button>
        </form>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
