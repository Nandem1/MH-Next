"use client";

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
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { PageTitle } from "@/components/shared/PageTitle";

export default function LoginPage() {
  const { status } = useSession();
  const { open, message, severity, showSnackbar, handleClose } = useSnackbar();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Verificar si hay una sesión válida al cargar la página
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard/inicio");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await signIn("credentials", {
        username: email,
        password,
        redirect: false,
      });

      if (result?.error) {
        showSnackbar("Credenciales inválidas", "error");
      } else {
        router.push("/dashboard/inicio");
      }
    } catch {
      showSnackbar("Error al iniciar sesión", "error");
    } finally {
      setLoading(false);
    }
  };

  /* mensaje post‑logout --------------------------------------------------- */
  useEffect(() => {
    if (localStorage.getItem("showLogoutMessage") === "true") {
      showSnackbar("Sesión cerrada exitosamente", "success");
      localStorage.removeItem("showLogoutMessage");
    }
  }, [showSnackbar]);

  // Si la sesión está cargando, mostrar loading
  if (status === "loading") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Si ya está autenticado, no mostrar nada (será redirigido)
  if (status === "authenticated") {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PageTitle 
        title="Iniciar Sesión" 
        description="Accede a tu cuenta de Mercado House"
      />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Iniciar Sesión
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Link href="/register" underline="hover">
              ¿No tienes cuenta? Regístrate
            </Link>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
