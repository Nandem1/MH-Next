// /app/dashboard/usuarios/page.tsx
"use client";

import { useUsuariosFull } from "@/hooks/useUsuariosFull";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { Box, Button, CircularProgress, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useRouter } from "next/navigation";

export default function UsuariosPage() {
  const { usuarios, isLoading, isError } = useUsuariosFull();
  const { isAuthenticated, isLoading: authLoading, rol_id } = useAuthStatus();
  const router = useRouter();

  if (isLoading || authLoading) {
    return (
      <Box sx={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || isError) {
    router.push("/login");
    return null;
  }

  const esAdmin = rol_id === 1; // 🔥 Solo admin puede ver el botón "Nuevo Usuario"

  return (
    <Box sx={{ minHeight: "80vh", padding: 2, ml: { xs: 0, md: "120px" } }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Gestión de Usuarios
      </Typography>

      {/* Botón "Nuevo Usuario" solo para Admin */}
      {esAdmin && (
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" color="primary" onClick={() => alert("Abrir modal de nuevo usuario")}>
            Nuevo Usuario
          </Button>
        </Box>
      )}

      {/* Tabla de usuarios */}
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
                  {usuario.rol_id === 1 ? "Administrador" : usuario.rol_id === 2 ? "Supervisor" : "Empleado"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
