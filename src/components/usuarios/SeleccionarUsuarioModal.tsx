"use client";

import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Snackbar, 
  Alert, 
  Modal,
  Autocomplete,
  TextField,
  Paper,
  Fade,
  Slide,
  Grow
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { AxiosError } from "axios";
import { getUsuariosDisponibles, UsuarioDisponible } from "@/services/usuarioService";
import { relacionarUsuario, RelacionarUsuarioRequest } from "@/services/authService";

export interface SeleccionarUsuarioModalProps {
  open: boolean;
  authUserId: number;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function SeleccionarUsuarioModal({
  open,
  authUserId,
  onSuccess,
  onError,
}: SeleccionarUsuarioModalProps) {
  const [usuarios, setUsuarios] = useState<UsuarioDisponible[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuarioDisponible | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [usuariosCargados, setUsuariosCargados] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const cargarUsuariosDisponibles = useCallback(async () => {
    if (usuariosCargados) return; // No cargar si ya están cargados
    
    try {
      setLoadingUsuarios(true);
      const usuariosData = await getUsuariosDisponibles();
      setUsuarios(usuariosData);
      setUsuariosCargados(true);
      
      if (usuariosData.length === 0) {
        setSnackbarMessage("No hay usuarios disponibles. Contacte al administrador.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        onError("No hay usuarios disponibles");
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data?.message || "Error al cargar usuarios disponibles";
      
      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      onError(message);
    } finally {
      setLoadingUsuarios(false);
    }
  }, [onError, usuariosCargados]);

  // Cargar usuarios disponibles cuando se abre el modal (solo una vez)
  useEffect(() => {
    if (open && !usuariosCargados) {
      cargarUsuariosDisponibles();
    }
  }, [open, cargarUsuariosDisponibles, usuariosCargados]);

  const handleRelacionar = async () => {
    if (!usuarioSeleccionado) {
      setSnackbarMessage("Por favor seleccione un usuario");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      setLoading(true);
      const request: RelacionarUsuarioRequest = {
        authUserId,
        usuarioId: usuarioSeleccionado.id,
      };

      await relacionarUsuario(request);

      setSnackbarMessage("Usuario relacionado exitosamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      
      // Cerrar modal después de un breve delay
      setTimeout(() => {
        onSuccess();
      }, 800);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data?.message || "Error al relacionar usuario";

      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      onError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (event: unknown, reason: string) => {
    // Modal no se puede cerrar manualmente según requerimientos
    // Solo se cierra cuando se completa la relación exitosamente
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return; // No hacer nada, mantener modal abierto
    }
  };

  // Reset del estado cuando el modal se cierra
  useEffect(() => {
    if (!open) {
      setUsuarios([]);
      setUsuariosCargados(false);
      setUsuarioSeleccionado(null);
    }
  }, [open]);

  return (
    <Modal 
      open={open} 
      onClose={handleClose} 
      keepMounted
      disableEscapeKeyDown
      closeAfterTransition
    >
      <Fade in={open} timeout={300}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 500,
            outline: "none",
          }}
        >
          <Slide direction="up" in={open} timeout={400}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 2,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Grow in={open} timeout={600}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    mb: 3, 
                    textAlign: "center",
                    fontWeight: 600,
                    color: "text.primary"
                  }}
                >
                  Seleccione su usuario
                </Typography>
              </Grow>

              <Grow in={open} timeout={700}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: "center" }}>
                  Elija su nombre de la lista para completar el registro
                </Typography>
              </Grow>

              <Grow in={open} timeout={750}>
                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 1,
                    '& .MuiAlert-message': {
                      textAlign: "center",
                      width: "100%"
                    }
                  }}
                >
                  Si no se encuentra en la lista, contacte a un administrador
                </Alert>
              </Grow>

              {loadingUsuarios ? (
                <Grow in={open} timeout={800}>
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress />
                  </Box>
                </Grow>
              ) : (
                <Grow in={open} timeout={800}>
                  <Autocomplete
                    options={usuarios}
                    getOptionLabel={(option) => `${option.nombre} - ${option.nombre_local}`}
                    value={usuarioSeleccionado}
                    onChange={(_, newValue) => setUsuarioSeleccionado(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Buscar usuario"
                        placeholder="Escriba para buscar..."
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    )}
                    renderOption={(props, option) => {
                      const { key, ...otherProps } = props;
                      return (
                        <Box component="li" key={key} {...otherProps}>
                          <Box sx={{ p: 1 }}>
                            <Typography variant="body1" fontWeight={500}>
                              {option.nombre}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {option.nombre_local}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    }}
                    noOptionsText="No se encontraron usuarios"
                    loading={loadingUsuarios}
                    disabled={loadingUsuarios || loading}
                    sx={{
                      '& .MuiAutocomplete-paper': {
                        borderRadius: 1,
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      }
                    }}
                  />
                </Grow>
              )}

              <Grow in={open} timeout={900}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ 
                    mt: 3, 
                    py: 1.25, 
                    fontWeight: 500,
                    borderRadius: 1,
                    textTransform: "none",
                    fontSize: "0.875rem",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    '&:hover': {
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    },
                    transition: "all 0.15s ease-in-out",
                  }}
                  onClick={handleRelacionar}
                  disabled={!usuarioSeleccionado || loading || loadingUsuarios}
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Completar Registro"
                  )}
                </Button>
              </Grow>

              <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                TransitionComponent={Slide}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                TransitionProps={{ direction: "down" } as any}
              >
                <Alert 
                  severity={snackbarSeverity} 
                  sx={{ width: "100%" }}
                  onClose={() => setSnackbarOpen(false)}
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar>
            </Paper>
          </Slide>
        </Box>
      </Fade>
    </Modal>
  );
}
