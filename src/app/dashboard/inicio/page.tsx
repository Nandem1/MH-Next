"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useEffect } from "react";
import { useSnackbar } from "@/hooks/useSnackbar";
import { usePrefetch } from "@/hooks/usePrefetch";
import Footer from "@/components/shared/Footer";
import { MetricsDashboard } from "@/components/ui/MetricsDashboard";

export default function InicioPage() {
  const { open, message, severity, showSnackbar, handleClose } = useSnackbar();
  const { prefetchFacturas, prefetchNotasCredito, prefetchUsuarios, prefetchProveedores } = usePrefetch();

  useEffect(() => {
    const showLoginMessage = localStorage.getItem("showLoginMessage");
    if (showLoginMessage === "true") {
      showSnackbar("Sesión iniciada exitosamente", "success");
      localStorage.removeItem("showLoginMessage");
    }

    // Prefetch de datos importantes en background
    const prefetchData = async () => {
      try {
        // Prefetch en paralelo para mejor performance
        await Promise.all([
          prefetchFacturas(),
          prefetchNotasCredito(),
          prefetchUsuarios(),
          prefetchProveedores(),
        ]);
      } catch (error) {
        // Silenciar errores de prefetch - no afectan la UX
        console.debug('Prefetch error:', error);
      }
    };

    // Delay para no bloquear la carga inicial
    const timer = setTimeout(prefetchData, 1000);
    return () => clearTimeout(timer);
  }, [showSnackbar, prefetchFacturas, prefetchNotasCredito, prefetchUsuarios, prefetchProveedores]);

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
          mt: 12, // ✅ aumentado de 8 a 12 para más separación del Topbar
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ color: "text.primary" }}>
          Dashboard
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
          Monitoreo en tiempo real del sistema y métricas de rendimiento.
        </Typography>
      </Box>

      {/* Dashboard de Métricas */}
      <MetricsDashboard />

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
