"use client";

import { Box, Typography, Divider, Button, CircularProgress, Tabs, Tab } from "@mui/material";
// /app/dashboard/configuracion/page.tsx



import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Footer from "@/components/shared/Footer";
import { ListaPreciosImporter } from "@/components/configuracion/ListaPreciosImporter";
import { CategoriasArticulos } from "@/components/configuracion/CategoriasArticulos";
import { ChangePasswordModal } from "@/components/usuarios/ChangePasswordModal";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`config-tabpanel-${index}`}
      aria-labelledby={`config-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ConfiguracionPage() {
  const { isAuthenticated, isLoading, id, usuario_id, rol_id } =
    useAuthStatus();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
          Configuración
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Información de Usuario" />
            <Tab label="Importar Lista de Precios" />
            <Tab label="Categorías Artículos" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Información de Usuario
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
          <Button 
            variant="outlined" 
            fullWidth 
            sx={{ mb: 2 }}
            onClick={() => setChangePasswordModalOpen(true)}
          >
            Cambiar contraseña
          </Button>
          <Button variant="outlined" fullWidth disabled>
            Cambiar local asignado (próximamente)
          </Button>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <ListaPreciosImporter />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <CategoriasArticulos />
        </TabPanel>
      </Box>
      <Footer />

      {/* Modal de cambio de contraseña */}
      <ChangePasswordModal
        open={changePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
        onSuccess={() => {
          // Opcional: mostrar mensaje de éxito o actualizar datos
          console.log("Contraseña cambiada exitosamente");
        }}
      />
    </Box>
  );
}
