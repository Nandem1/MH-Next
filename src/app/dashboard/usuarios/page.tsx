"use client";

import { Box, Button, CircularProgress, Typography, Paper, Snackbar, Alert, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
// /app/dashboard/usuarios/page.tsx


import { useUsuariosFull } from "@/hooks/useUsuariosFull";
import { useAuthStatus } from "@/hooks/useAuthStatus";

import { useRouter } from "next/navigation";
import { useState } from "react";
import NuevoUsuarioModal from "@/components/usuarios/NuevoUsuarioModal";
import Footer from "@/components/shared/Footer";

export default function UsuariosPage() {
  const { usuarios, isLoading, isError } = useUsuariosFull();
  const { isAuthenticated, isLoading: authLoading, rol_id } = useAuthStatus();
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  if (isLoading || authLoading) {
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
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((usuario) => (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <NuevoUsuarioModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onUsuarioCreado={() => setSnackbarOpen(true)}
        />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Cuenta registrada exitosamente
          </Alert>
        </Snackbar>
      </Box>

      <Box>
        <Footer />
      </Box>
    </Box>
  );
}