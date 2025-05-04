// /app/dashboard/configuracion/page.tsx
"use client";

import {
  Box,
  Typography,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useRouter } from "next/navigation";
import Footer from "@/components/shared/Footer";

export default function ConfiguracionPage() {
  const { isAuthenticated, isLoading, id, usuario_id, rol_id } =
    useAuthStatus();
  const router = useRouter();

  if (isLoading) {
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

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <Box sx={{ minHeight: "95vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: { xs: 2, md: 3 }, pt: 10, pb: 4, flexGrow: 1 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Configuración de Usuario
        </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>ID Auth:</strong> {id}
        </Typography>
        <Typography variant="body1">
          <strong>ID Usuario:</strong> {usuario_id ?? "-"}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Rol:</strong>{" "}
          {rol_id === 1
            ? "Administrador"
            : rol_id === 2
            ? "Supervisor"
            : "Empleado"}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Acciones Disponibles
        </Typography>
        <Button variant="outlined" fullWidth sx={{ mb: 2 }} disabled>
          Cambiar contraseña (próximamente)
        </Button>
        <Button variant="outlined" fullWidth disabled>
          Cambiar local asignado (próximamente)
        </Button>
      </Box>
      <Footer />
    </Box>
  );
}
