"use client";

import { useAuth } from "@/hooks/useAuth";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useState, useEffect } from "react";
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

export default function LoginPage() {
  const { login, loading } = useAuth();
  const { open, message, severity, showSnackbar, handleClose } = useSnackbar();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.success) {
      showSnackbar(result.message, "error");
    }
  };

  useEffect(() => {
    const showLogoutMessage = localStorage.getItem("showLogoutMessage");
    if (showLogoutMessage === "true") {
      showSnackbar("Sesión cerrada exitosamente", "success");
      localStorage.removeItem("showLogoutMessage");
    }
  }, [showSnackbar]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Main content (centro) */}
      <Box
        sx={{
          flex: 1,
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
              disabled={loading}
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>
        </Paper>
      </Box>

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
