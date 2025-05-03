"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Link,
  Paper,
} from "@mui/material";
import axios, { AxiosError } from "axios";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje("");

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

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setMensaje(err.response?.data?.message || "❌ Error al registrar.");
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled =
    loading || !email || !password || emailError || passwordError;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        px: 2,
        pt: 30,
      }}
    >
      {/* Main form */}
      <Paper sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          Crear nuevo usuario
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Correo electrónico"
            fullWidth
            margin="normal"
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
            variant="contained"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isSubmitDisabled}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Crear usuario"
            )}
          </Button>
        </form>

        {mensaje && (
          <Typography sx={{ mt: 2 }} color="error">
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

      {/* Footer */}
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