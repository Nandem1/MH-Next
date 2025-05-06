// /app/dashboard/configuracion/page.tsx
"use client";

import {
  Box,
  Typography,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Footer from "@/components/shared/Footer";
import { PageTitle } from "@/components/shared/PageTitle";

export default function ConfiguracionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: "100%",
      }}
    >
      <PageTitle 
        title="Configuración" 
        description="Configura los parámetros y preferencias de Mercado House"
      />
      <Box
        sx={{
          flexGrow: 1,
          mt: 8,
          px: { xs: 2, md: 3 },
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Configuración
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>ID Auth:</strong> {session?.user?.id}
        </Typography>
        <Typography variant="body1">
          <strong>ID Usuario:</strong> {session?.user?.id_local ?? "-"}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Rol:</strong>{" "}
          {session?.user?.role === "1"
            ? "Administrador"
            : session?.user?.role === "2"
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
