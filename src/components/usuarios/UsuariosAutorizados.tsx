"use client";

import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useUsuariosAutorizados } from "@/hooks/useUsuariosAutorizados";
import { useState } from "react";
import { UsuarioAutorizado } from "@/services/usuarioService";
import { CrearUsuarioAutorizadoModal } from "./CrearUsuarioAutorizadoModal";
import { EditarUsuarioAutorizadoModal } from "./EditarUsuarioAutorizadoModal";

export function UsuariosAutorizados() {
  const { usuarios, isLoading, isError } = useUsuariosAutorizados();
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuarioAutorizado | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info">("success");

  const handleCrearUsuario = () => {
    setModalCrearOpen(true);
  };

  const handleEditarUsuario = (usuario: UsuarioAutorizado) => {
    setUsuarioSeleccionado(usuario);
    setModalEditarOpen(true);
  };

  const handleCerrarModales = () => {
    setModalCrearOpen(false);
    setModalEditarOpen(false);
    setUsuarioSeleccionado(null);
  };

  const handleSuccess = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    handleCerrarModales();
  };

  const handleError = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error al cargar los usuarios autorizados. Por favor, intenta nuevamente.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCrearUsuario}
        >
          Nuevo Usuario
        </Button>
      </Box>

      <Paper sx={{ width: "100%", overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>RUT</TableCell>
              <TableCell>Local</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    No hay usuarios autorizados registrados
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((usuario) => {
                const tieneRut = usuario.rut && usuario.rut.trim() !== "";
                return (
                  <TableRow key={usuario.id}>
                    <TableCell>{usuario.id}</TableCell>
                    <TableCell>{usuario.nombre}</TableCell>
                    <TableCell>
                      <Chip
                        label={tieneRut ? "Autorizado" : "No autorizado"}
                        color={tieneRut ? "success" : "error"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{usuario.rut || "-"}</TableCell>
                    <TableCell>{usuario.local.nombre_local}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditarUsuario(usuario)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Paper>

      <CrearUsuarioAutorizadoModal
        open={modalCrearOpen}
        onClose={handleCerrarModales}
        onSuccess={(message) => handleSuccess(message)}
        onError={(message) => handleError(message)}
      />

      <EditarUsuarioAutorizadoModal
        open={modalEditarOpen}
        onClose={handleCerrarModales}
        usuario={usuarioSeleccionado}
        onSuccess={(message) => handleSuccess(message)}
        onError={(message) => handleError(message)}
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
  );
}

