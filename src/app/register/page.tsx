"use client";

import { TextField, Button, Typography, Box, Snackbar, Alert, CircularProgress, Paper, Link } from "@mui/material";


import { useState } from "react";
import { useRouter } from "next/navigation";

import axios, { AxiosError } from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /* helpers */
  const isEmailValid = (em: string) =>
    /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(em);

  /* change handlers */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(!isEmailValid(value));
    setMensaje("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(value.length < 6);
    setMensaje("");
  };

  /* submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid(email)) {
      setEmailError(true);
      setMensaje("El correo electrónico no es válido.");
      return;
    }
    if (password.length < 6) {
      setPasswordError(true);
      setMensaje("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api-beta/register`, {
        email,
        password,
      });
      setSnackbarOpen(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setMensaje(error.response?.data?.message ?? "❌ Error al registrar.");
    } finally {
      setLoading(false);
    }
  };

  const disabled =
    loading || !email || !password || emailError || passwordError;

  /* layout */
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
      }}
    >
      {/* centro ---------------------------------------------------------- */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 4,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: { xs: "100%", sm: "420px", md: "380px" },
            maxWidth: "100%",
            p: { xs: 3, sm: 4 }, // igual que login
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" fontWeight={700} textAlign="center" mb={3}>
            Crear nuevo usuario
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Correo electrónico"
              fullWidth
              margin="normal" // mismo espaciado login
              value={email}
              onChange={handleEmailChange}
              error={emailError}
              helperText={
                emailError ? "El correo electrónico no es válido." : " "
              }
            />

            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={handlePasswordChange}
              error={passwordError}
              helperText={passwordError ? "Mínimo 6 caracteres." : " "}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, py: 1.25, fontWeight: 600 }}
              disabled={disabled}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Crear usuario"
              )}
            </Button>
          </Box>

          {mensaje && (
            <Typography color="error" sx={{ mt: 2 }}>
              {mensaje}
            </Typography>
          )}

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity="success" sx={{ width: "100%" }}>
              Cuenta registrada exitosamente
            </Alert>
          </Snackbar>
        </Paper>
      </Box>

      {/* footer ---------------------------------------------------------- */}
      <Box
        component="footer"
        sx={{
          py: 2,
          textAlign: "center",
          fontSize: "0.8rem",
          color: "text.secondary",
        }}
      >
        © 2025 Mercado House SPA · Desarrollado por{" "}
        <Link
          href="https://github.com/Nandem1"
          target="_blank"
          underline="hover"
        >
          Nandev
        </Link>
      </Box>
    </Box>
  );
}
