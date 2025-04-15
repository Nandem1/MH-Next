"use client";

import { Box, Typography, Snackbar, Alert } from "@mui/material";
import { useEffect } from "react";
import { useSnackbar } from "@/hooks/useSnackbar";

export default function InicioPage() {
  const { open, message, severity, showSnackbar, handleClose } = useSnackbar();

  useEffect(() => {
    const showLoginMessage = localStorage.getItem("showLoginMessage");
    if (showLoginMessage === "true") {
      showSnackbar("Sesión iniciada exitosamente", "success"); // 🔥
      localStorage.removeItem("showLoginMessage"); // ✅ Limpiar marca
    }
  }, [showSnackbar]);

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 2,
        padding: 2,
        ml: { xs: 0, md: "120px" }, // padding habitual
      }}
    >
      <Typography variant="h3" fontWeight="bold">
        Bienvenido al Panel de Control
      </Typography>

      <Typography variant="subtitle1" color="textSecondary">
        Aquí podrás gestionar tus facturas, usuarios y configuración.
      </Typography>

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
