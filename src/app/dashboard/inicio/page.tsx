"use client";

import { Box, Typography, Snackbar, Alert } from "@mui/material";
import { useEffect } from "react";
import { useSnackbar } from "@/hooks/useSnackbar";

export default function InicioPage() {
  const { open, message, severity, showSnackbar, handleClose } = useSnackbar();

  useEffect(() => {
    const showLoginMessage = localStorage.getItem("showLoginMessage");
    if (showLoginMessage === "true") {
      showSnackbar("Sesión iniciada exitosamente", "success");
      localStorage.removeItem("showLoginMessage");
    }
  }, [showSnackbar]);

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        ml: { xs: 0, md: "120px" },
      }}
    >
      {/* Contenido principal */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 2,
          padding: 2,
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          Bienvenido al Panel de Control
        </Typography>

        <Typography variant="subtitle1" color="textSecondary">
          Aquí podrás gestionar tus facturas, usuarios y configuración.
        </Typography>
      </Box>

      {/* Footer fijo al fondo */}
      <Box
        component="footer"
        sx={{
          py: 2,
          textAlign: "center",
          fontSize: "0.8rem",
          color: "text.secondary",
          borderTop: "1px solid",
          borderColor: "divider",
          mt: 2,
        }}
      >
        © {new Date().getFullYear()} Mercado House SPA · Todos los derechos
        reservados
      </Box>

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
