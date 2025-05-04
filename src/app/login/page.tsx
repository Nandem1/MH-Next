"use client";

import { useAuth } from "@/hooks/useAuth";
import { useSnackbar } from "@/hooks/useSnackbar";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Link,
} from "@mui/material";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const { open, message, severity, showSnackbar, handleClose } = useSnackbar();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.success) showSnackbar(result.message, "error");
  };

  /* mensaje post‑logout --------------------------------------------------- */
  useEffect(() => {
    if (localStorage.getItem("showLogoutMessage") === "true") {
      showSnackbar("Sesión cerrada exitosamente", "success");
      localStorage.removeItem("showLogoutMessage");
    }
  }, [showSnackbar]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
      }}
    >
      {/* ---------- main (centro) ---------- */}
      <Box
        sx={{
          flexGrow: 1, // ocupa todo lo disponible
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
            width: { xs: "100%", sm: "420px", md: "380px" }, // ancho máx. responsive
            maxWidth: "100%",
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" fontWeight={700} textAlign="center" mb={3}>
            Iniciar Sesión
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Correo electrónico"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, py: 1.25, fontWeight: 600 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Entrar"
              )}
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* ---------- footer ---------- */}
      <Box
        component="footer"
        sx={{
          py: 2,
          textAlign: "center",
          fontSize: "0.8rem",
          color: "text.secondary",
        }}
      >
        © 2025 Mercado House SPA · Desarrollado por{" "}
        <Link
          href="https://github.com/Nandem1"
          target="_blank"
          underline="hover"
        >
          Nandev
        </Link>
      </Box>

      {/* ---------- snackbar ---------- */}
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
