// /app/dashboard/usuarios/page.tsx
"use client";

import { Box, Typography } from "@mui/material";
import { useUsuariosFull } from "@/hooks/useUsuariosFull";
import {
  Button,
  CircularProgress,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import NuevoUsuarioModal from "@/components/usuarios/NuevoUsuarioModal";
import { PageTitle } from "@/components/shared/PageTitle";
import Footer from "@/components/shared/Footer";

export default function UsuariosPage() {
  const { usuarios, isLoading, isError } = useUsuariosFull();
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
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
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <PageTitle 
        title="Usuarios" 
        description="Administra los usuarios y permisos de Mercado House"
      />
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Gestion de Usuarios	
        </Typography>

        {isAdmin && (
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
      <Footer />
    </Box>
  );
}