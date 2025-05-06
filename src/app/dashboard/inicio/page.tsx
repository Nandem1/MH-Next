"use client";

import { Box, Typography, Snackbar, Alert } from "@mui/material";
import { useEffect } from "react";
import { useSnackbar } from "@/hooks/useSnackbar";
import Footer from "@/components/shared/Footer";

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
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: "100%",
      }}
    >
      {/* Contenido principal centrado */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 2,
          px: { xs: 2, md: 3 },
          mt: 8, // ✅ deja espacio para el Topbar fijo
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          Bienvenido al Panel de Control
        </Typography>

        <Typography variant="subtitle1" color="text.secondary">
          Aquí podrás gestionar tus facturas, usuarios y configuración.
        </Typography>
      </Box>

      <Footer />

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