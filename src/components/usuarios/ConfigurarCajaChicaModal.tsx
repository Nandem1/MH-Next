// /components/usuarios/ConfigurarCajaChicaModal.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  useTheme,
} from "@mui/material";
import { UsuarioCajaChica } from "@/services/cajaChicaService";
import { useCajaChicaUsuarios } from "@/hooks/useCajaChicaUsuarios";
import { formatearMonto } from "@/utils/formatearMonto";

interface ConfigurarCajaChicaModalProps {
  open: boolean;
  onClose: () => void;
  usuario: UsuarioCajaChica | null;
  onSuccess?: () => void;
}

export function ConfigurarCajaChicaModal({
  open,
  onClose,
  usuario,
  onSuccess,
}: ConfigurarCajaChicaModalProps) {
  const theme = useTheme();
  
  const {
    habilitarCajaChicaUsuario,
    editarCajaChicaUsuario,
    deshabilitarCajaChicaUsuario,
    isHabilitando,
    isEditando,
    isDeshabilitando,
    errorHabilitar,
    errorEditar,
    errorDeshabilitar,
    resetErrorHabilitar,
    resetErrorEditar,
    resetErrorDeshabilitar,
  } = useCajaChicaUsuarios();

  const [montoFijo, setMontoFijo] = useState<string>("");
  const [montoActual, setMontoActual] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Resetear estados cuando se abre/cierra el modal
  useEffect(() => {
    if (open && usuario) {
      setMontoFijo(usuario.montoFijo?.toString() || "2000000");
      setMontoActual(usuario.montoActual?.toString() || "");
      setError("");
      // Resetear errores
      resetErrorHabilitar();
      resetErrorEditar();
      resetErrorDeshabilitar();
    }
  }, [open, usuario, resetErrorHabilitar, resetErrorEditar, resetErrorDeshabilitar]);

  const handleClose = () => {
    setError("");
    onClose();
  };

  const validateInputs = () => {
    if (!usuario) return false;

    if (!usuario.tieneCajaChica) {
      // Validación para habilitar
      const monto = parseInt(montoFijo);
      if (isNaN(monto) || monto < 1 || monto > 10000000) {
        setError("El monto fijo debe estar entre $1 y $10,000,000");
        return false;
      }
    } else {
      // Validación para editar
      if (montoFijo) {
        const monto = parseInt(montoFijo);
        if (isNaN(monto) || monto < 1 || monto > 10000000) {
          setError("El monto fijo debe estar entre $1 y $10,000,000");
          return false;
        }
      }
      if (montoActual) {
        const monto = parseInt(montoActual);
        if (isNaN(monto) || monto < 0 || monto > 10000000) {
          setError("El monto actual debe estar entre $0 y $10,000,000");
          return false;
        }
      }
      if (!montoFijo && !montoActual) {
        setError("Debe proporcionar al menos un monto para editar");
        return false;
      }
    }
    return true;
  };

  const handleHabilitar = async () => {
    if (!usuario || !validateInputs()) return;

    try {
      await habilitarCajaChicaUsuario({
        authUserId: usuario.authUserId,
        montoFijo: parseInt(montoFijo),
      });
      onSuccess?.();
      handleClose();
    } catch {
      // El error se maneja en el hook
    }
  };

  const handleEditar = async () => {
    if (!usuario || !validateInputs()) return;

    try {
      const request: { authUserId: number; montoFijo?: number; montoActual?: number } = { authUserId: usuario.authUserId };
      if (montoFijo) request.montoFijo = parseInt(montoFijo);
      if (montoActual) request.montoActual = parseInt(montoActual);

      await editarCajaChicaUsuario(request);
      onSuccess?.();
      handleClose();
    } catch {
      // El error se maneja en el hook
    }
  };

  const handleDeshabilitar = async () => {
    if (!usuario) return;

    try {
      await deshabilitarCajaChicaUsuario({
        authUserId: usuario.authUserId,
      });
      onSuccess?.();
      handleClose();
    } catch {
      // El error se maneja en el hook
    }
  };


  const handleMontoFijoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, "");
    setMontoFijo(value);
    setError("");
  };

  const handleMontoActualChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, "");
    setMontoActual(value);
    setError("");
  };

  // Función para formatear el valor mostrado en el input
  const formatInputValue = (value: string) => {
    if (!value) return "";
    const number = parseInt(value);
    if (isNaN(number)) return "";
    return number.toLocaleString("es-CL");
  };

  if (!usuario) return null;

  const isLoading = isHabilitando || isEditando || isDeshabilitando;
  const currentError = errorHabilitar || errorEditar || errorDeshabilitar;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          bgcolor: "background.paper",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 2, 
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: "background.default"
      }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ color: "text.primary", mb: 0.5 }}>
              {usuario.tieneCajaChica ? "Editar Caja Chica" : "Habilitar Caja Chica"}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {usuario.tieneCajaChica ? "Modificar configuración de caja chica" : "Configurar caja chica para el usuario"}
            </Typography>
          </Box>
          <Chip
            label={usuario.tieneCajaChica ? "Configurado" : "Sin configurar"}
            color={usuario.tieneCajaChica ? "success" : "default"}
            size="small"
            sx={{ 
              fontWeight: 600,
              borderRadius: "8px",
              textTransform: "capitalize"
            }}
          />
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Información del usuario */}
        <Box sx={{ p: 4, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 600, mb: 3 }}>
            Información del Usuario
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }, gap: 3 }}>
            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                Nombre
              </Typography>
              <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500, mt: 0.5 }}>
                {usuario.nombre}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                Email
              </Typography>
              <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500, mt: 0.5 }}>
                {usuario.email}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                WhatsApp
              </Typography>
              <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500, mt: 0.5 }}>
                {usuario.whatsappId || "No especificado"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                Local
              </Typography>
              <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500, mt: 0.5 }}>
                {usuario.nombreLocal}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Estado actual */}
        {usuario.tieneCajaChica && (
          <Box sx={{ p: 4, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 600, mb: 3 }}>
              Estado Actual de Caja Chica
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 3, mb: 3 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                  Monto Fijo
                </Typography>
                <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700, mt: 0.5 }}>
                  {formatearMonto(usuario.montoFijo)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                  Monto Actual
                </Typography>
                <Typography variant="h6" sx={{ color: "success.main", fontWeight: 700, mt: 0.5 }}>
                  {formatearMonto(usuario.montoActual)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                  Límite Mínimo
                </Typography>
                <Typography variant="h6" sx={{ color: "warning.main", fontWeight: 700, mt: 0.5 }}>
                  {formatearMonto(usuario.limiteMinimo)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={usuario.estadoAutorizacion === "autorizado" ? "Autorizado" : "No Autorizado"}
                color={usuario.estadoAutorizacion === "autorizado" ? "success" : "default"}
                size="small"
                sx={{ 
                  fontWeight: 600,
                  borderRadius: "8px",
                  textTransform: "capitalize"
                }}
              />
              <Chip
                label={
                  usuario.estadoOperacional === "activo"
                    ? "Activo"
                    : usuario.estadoOperacional === "requiere_reembolso"
                    ? "Requiere Reembolso"
                    : "Inactivo"
                }
                color={
                  usuario.estadoOperacional === "activo"
                    ? "success"
                    : usuario.estadoOperacional === "requiere_reembolso"
                    ? "warning"
                    : "error"
                }
                size="small"
                sx={{ 
                  fontWeight: 600,
                  borderRadius: "8px",
                  textTransform: "capitalize"
                }}
              />
            </Box>
          </Box>
        )}

        {/* Errores */}
        {(error || currentError) && (
          <Box sx={{ p: 4, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: "8px",
                border: `1px solid ${theme.palette.error.light}`,
              }}
            >
              {error || (currentError as Error)?.message}
            </Alert>
          </Box>
        )}

        {/* Formulario */}
        <Box sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 600, mb: 3 }}>
            {usuario.tieneCajaChica ? "Editar Configuración" : "Configurar Caja Chica"}
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Monto Fijo"
                value={formatInputValue(montoFijo)}
                onChange={handleMontoFijoChange}
                placeholder="2.000.000"
                helperText="Monto base de la caja chica (entre $1 y $10,000,000)"
                disabled={isLoading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1, color: "text.secondary" }}>$</Typography>,
                }}
              />
            </Grid>
            {usuario.tieneCajaChica && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Monto Actual"
                  value={formatInputValue(montoActual)}
                  onChange={handleMontoActualChange}
                  placeholder="1.500.000"
                  helperText="Saldo actual disponible (entre $0 y $10,000,000)"
                  disabled={isLoading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1, color: "text.secondary" }}>$</Typography>,
                  }}
                />
              </Grid>
            )}
          </Grid>

          {!usuario.tieneCajaChica && (
            <Alert 
              severity="info" 
              sx={{ 
                mt: 3,
                borderRadius: "8px",
                border: `1px solid ${theme.palette.info.light}`,
              }}
            >
              Al habilitar la caja chica, se creará automáticamente una rendición activa
              y se establecerá el límite mínimo como el 10% del monto fijo.
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        gap: 2,
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: "background.default"
      }}>
        <Button 
          onClick={handleClose} 
          disabled={isLoading}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            px: 3,
          }}
        >
          Cancelar
        </Button>
        
        {usuario.tieneCajaChica && (
          <Button
            onClick={handleDeshabilitar}
            color="error"
            variant="outlined"
            disabled={isLoading}
            startIcon={isDeshabilitando ? <CircularProgress size={16} /> : null}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
            }}
          >
            {isDeshabilitando ? "Deshabilitando..." : "Deshabilitar"}
          </Button>
        )}

        <Button
          onClick={usuario.tieneCajaChica ? handleEditar : handleHabilitar}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : null}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            px: 3,
          }}
        >
          {isLoading
            ? usuario.tieneCajaChica
              ? "Editando..."
              : "Habilitando..."
            : usuario.tieneCajaChica
            ? "Guardar Cambios"
            : "Habilitar Caja Chica"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
