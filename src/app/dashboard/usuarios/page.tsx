"use client";

import { Box, Button, CircularProgress, Typography, Paper, Snackbar, Alert, Table, TableHead, TableRow, TableCell, TableBody, Chip } from "@mui/material";
// /app/dashboard/usuarios/page.tsx

import { useUsuariosFull } from "@/hooks/useUsuariosFull";
import { useCajaChicaUsuarios } from "@/hooks/useCajaChicaUsuarios";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { formatearMonto } from "@/utils/formatearMonto";

import { useRouter } from "next/navigation";
import { useState } from "react";
import NuevoUsuarioModal from "@/components/usuarios/NuevoUsuarioModal";
import { UsuarioMenuActions } from "@/components/usuarios/UsuarioMenuActions";
import { ConfigurarCajaChicaModal } from "@/components/usuarios/ConfigurarCajaChicaModal";
import { UsuarioCajaChica } from "@/services/cajaChicaService";
import Footer from "@/components/shared/Footer";

export default function UsuariosPage() {
  const { usuarios, isLoading, isError } = useUsuariosFull();
  const { usuarios: usuariosCajaChica, isLoading: isLoadingCajaChica } = useCajaChicaUsuarios();
  const { isAuthenticated, isLoading: authLoading, rol_id } = useAuthStatus();
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info">("success");
  
  // Estados para el modal de caja chica
  const [modalCajaChicaOpen, setModalCajaChicaOpen] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuarioCajaChica | null>(null);

  if (isLoading || authLoading || isLoadingCajaChica) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || isError) {
    router.push("/login");
    return null;
  }

  const esAdmin = rol_id === 1;

  // Función para manejar la configuración de caja chica
  const handleConfigurarCajaChica = (usuario: UsuarioCajaChica) => {
    setUsuarioSeleccionado(usuario);
    setModalCajaChicaOpen(true);
  };

  // Función para manejar el éxito de la configuración de caja chica
  const handleCajaChicaSuccess = () => {
    setSnackbarMessage("Configuración de caja chica actualizada exitosamente");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  // Función para obtener información de caja chica de un usuario
  const getUsuarioCajaChica = (authUserId: number) => {
    return usuariosCajaChica.find(u => u.authUserId === authUserId);
  };

  // Función para obtener el color del chip según el estado de caja chica
  const getCajaChicaChipColor = (usuario: UsuarioCajaChica) => {
    if (!usuario.tieneCajaChica) {
      return "default";
    }
    
    switch (usuario.estadoOperacional) {
      case "activo":
        return "success";
      case "requiere_reembolso":
        return "warning";
      case "inactivo":
        return "error";
      default:
        return "default";
    }
  };

  // Función para obtener el texto del chip según el estado de caja chica
  const getCajaChicaChipText = (usuario: UsuarioCajaChica) => {
    if (!usuario.tieneCajaChica) {
      return "Sin caja chica";
    }
    
    switch (usuario.estadoOperacional) {
      case "activo":
        return "Activo";
      case "requiere_reembolso":
        return "Requiere reembolso";
      case "inactivo":
        return "Inactivo";
      default:
        return "Desconocido";
    }
  };

  // Función para ordenar usuarios por rol
  const ordenarUsuariosPorRol = (usuariosList: Array<{ rol_id: number; nombre: string | null; email: string; id_auth_user: number; whatsapp_id: string | null }>) => {
    return [...usuariosList].sort((a, b) => {
      // Orden: Administradores (1) -> Supervisores (2) -> Empleados (3+)
      const ordenRoles = { 1: 1, 2: 2, 3: 3 }; // Administrador, Supervisor, Empleado
      const ordenA = ordenRoles[a.rol_id as keyof typeof ordenRoles] || 999;
      const ordenB = ordenRoles[b.rol_id as keyof typeof ordenRoles] || 999;
      
      if (ordenA !== ordenB) {
        return ordenA - ordenB;
      }
      
      // Si tienen el mismo rol, ordenar alfabéticamente por nombre
      const nombreA = a.nombre || a.email || "";
      const nombreB = b.nombre || b.email || "";
      return nombreA.localeCompare(nombreB);
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "95vh" }}>
      <Box sx={{ px: { xs: 2, md: 3 }, pt: 10, pb: 4, flexGrow: 1 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Gestión de Usuarios
        </Typography>

        {esAdmin && (
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setModalOpen(true)}
            >
              Nuevo Usuario
            </Button>
          </Box>
        )}

        <Paper sx={{ width: "100%", overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>WhatsApp ID</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Local</TableCell>
                <TableCell>Estado Caja Chica</TableCell>
                <TableCell>Saldo Actual</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ordenarUsuariosPorRol(usuarios).map((usuario) => {
                const usuarioCajaChica = getUsuarioCajaChica(usuario.id_auth_user);
                return (
                  <TableRow key={usuario.id_auth_user}>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{usuario.nombre ?? "-"}</TableCell>
                    <TableCell>{usuario.whatsapp_id ?? "-"}</TableCell>
                    <TableCell>
                      {usuario.rol_id === 1
                        ? "Administrador"
                        : usuario.rol_id === 2
                        ? "Supervisor"
                        : "Empleado"}
                    </TableCell>
                    <TableCell>
                      {usuarioCajaChica?.nombreLocal ? (
                        <Typography variant="body2" color="text.primary" fontWeight={500}>
                          {usuarioCajaChica.nombreLocal}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Sin asignar
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {usuarioCajaChica ? (
                        <Chip
                          label={getCajaChicaChipText(usuarioCajaChica)}
                          color={getCajaChicaChipColor(usuarioCajaChica)}
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Chip
                          label="Sin información"
                          color="default"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {usuarioCajaChica?.montoActual ? (
                        <Typography variant="body2" color="success.main" fontWeight="bold">
                          {formatearMonto(usuarioCajaChica.montoActual)}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {esAdmin && usuarioCajaChica && (
                        <UsuarioMenuActions
                          usuario={usuarioCajaChica}
                          onConfigurarCajaChica={handleConfigurarCajaChica}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>

        <NuevoUsuarioModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onUsuarioCreado={() => {
            setSnackbarMessage("Usuario creado exitosamente");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
          }}
        />

        <ConfigurarCajaChicaModal
          open={modalCajaChicaOpen}
          onClose={() => {
            setModalCajaChicaOpen(false);
            setUsuarioSeleccionado(null);
          }}
          usuario={usuarioSeleccionado}
          onSuccess={handleCajaChicaSuccess}
        />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert 
            severity={snackbarSeverity} 
            sx={{ width: "100%" }}
            onClose={() => setSnackbarOpen(false)}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>

      <Box>
        <Footer />
      </Box>
    </Box>
  );
}