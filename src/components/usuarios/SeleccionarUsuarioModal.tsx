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
  Paper
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import { useInViewAnimations } from "@/hooks/useAnimations";
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  // Animaciones
  const { ref: modalRef, ...modalInView } = useInViewAnimations({ threshold: 0.3 });

  const cargarUsuariosDisponibles = useCallback(async () => {
    try {
      setLoadingUsuarios(true);
      const usuariosData = await getUsuariosDisponibles();
      setUsuarios(usuariosData);
      
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
  }, [onError]);

  // Cargar usuarios disponibles cuando se abre el modal
  useEffect(() => {
    if (open) {
      cargarUsuariosDisponibles();
    }
  }, [open, cargarUsuariosDisponibles]);

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
      }, 1500);
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

  return (
    <Modal 
      open={open} 
      onClose={handleClose} 
      keepMounted
      disableEscapeKeyDown
    >
      <motion.div
        ref={modalRef}
        {...modalInView}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 500,
          outline: "none",
        }}
      >
        <Paper
          component={motion.div}
          whileHover={{ 
            y: -2,
            transition: { duration: 0.2, ease: "easeOut" }
          }}
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: 24,
            backgroundColor: "background.paper",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ mb: 3, textAlign: "center" }}>
            Seleccione su usuario
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: "center" }}>
            Elija su nombre de la lista para completar el registro
          </Typography>

          {loadingUsuarios ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Autocomplete
              options={usuarios}
              getOptionLabel={(option) => `${option.nombre} - ${option.nombre_local}`}
              value={usuarioSeleccionado}
              onChange={(_, newValue) => setUsuarioSeleccionado(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar usuario"
                  placeholder="Seleccione su nombre..."
                  fullWidth
                  margin="normal"
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {option.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.nombre_local} • WhatsApp: {option.whatsapp_id}
                    </Typography>
                  </Box>
                </Box>
              )}
              noOptionsText="No se encontraron usuarios"
              loading={loadingUsuarios}
              disabled={loadingUsuarios || loading}
            />
          )}

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3, py: 1.25, fontWeight: 600 }}
            onClick={handleRelacionar}
            disabled={!usuarioSeleccionado || loading || loadingUsuarios}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Completar Registro"
            )}
          </Button>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
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
        </Paper>
      </motion.div>
    </Modal>
  );
}
