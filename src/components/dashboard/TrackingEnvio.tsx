"use client";

import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { TrackingEnvio } from "@/types/nominaCheque";
import { locales } from "@/hooks/useAuthStatus";

interface TrackingEnvioProps {
  tracking: TrackingEnvio;
  onUpdateTracking?: (tracking: Partial<TrackingEnvio>) => Promise<void>;
  readonly?: boolean;
}

const estadosTracking = [
  { value: "EN_ORIGEN" as const, label: "En Origen", color: "default" as const },
  { value: "EN_TRANSITO" as const, label: "En Tránsito", color: "warning" as const },
  { value: "RECIBIDA" as const, label: "Recibida", color: "info" as const },
  { value: "ENTREGADA" as const, label: "Entregada", color: "success" as const },
];

export function TrackingEnvioComponent({
  tracking,
  onUpdateTracking,
  readonly = false,
}: TrackingEnvioProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    estado: tracking.estado as "EN_ORIGEN" | "EN_TRANSITO" | "RECIBIDA" | "ENTREGADA",
    localDestino: tracking.localDestino || "",
    observaciones: tracking.observaciones || "",
  });
  const theme = useTheme();

  const getEstadoIndex = (estado: string) => {
    return estadosTracking.findIndex(e => e.value === estado);
  };

  const handleUpdateTracking = async () => {
    if (!onUpdateTracking) return;
    try {
      setUpdating(true);
      await onUpdateTracking({
        estado: formData.estado as "EN_ORIGEN" | "EN_TRANSITO" | "RECIBIDA" | "ENTREGADA",
        localDestino: formData.localDestino || undefined,
        observaciones: formData.observaciones || undefined,
        fechaEnvio: formData.estado === "EN_TRANSITO" ? new Date().toISOString() : tracking.fechaEnvio,
        fechaRecepcion: formData.estado === "RECIBIDA" ? new Date().toISOString() : tracking.fechaRecepcion,
        fechaEntrega: formData.estado === "ENTREGADA" ? new Date().toISOString() : tracking.fechaEntrega,
      });
      setModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar tracking:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ color: "text.primary" }}>
          Tracking de Envío
        </Typography>
        {!readonly && onUpdateTracking && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => setModalOpen(true)}
            sx={{
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                borderColor: theme.palette.text.primary,
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            Actualizar Estado
          </Button>
        )}
      </Stack>
      <Paper elevation={0} sx={{ bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}`, borderRadius: "12px", p: 3 }}>
        <Stepper activeStep={getEstadoIndex(tracking.estado)} orientation="vertical">
          <Step>
            <StepLabel>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" fontWeight={600} sx={{ color: "text.primary" }}>
                  En Origen
                </Typography>
                <Chip
                  label={locales.find(l => l.id.toString() === tracking.localOrigen)?.nombre || tracking.localOrigen}
                  size="small"
                  sx={{
                    bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                />
              </Stack>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Nómina creada en {locales.find(l => l.id.toString() === tracking.localOrigen)?.nombre || tracking.localOrigen}
              </Typography>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" fontWeight={600} sx={{ color: "text.primary" }}>
                  En Tránsito
                </Typography>
                {tracking.localDestino && (
                  <Chip
                    label={`→ ${locales.find(l => l.id.toString() === tracking.localDestino)?.nombre || tracking.localDestino}`}
                    size="small"
                    sx={{
                      bgcolor: theme.palette.warning.light,
                      color: theme.palette.warning.dark,
                      fontWeight: 500,
                      border: `1px solid ${theme.palette.warning.main}`,
                    }}
                  />
                )}
              </Stack>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {tracking.fechaEnvio && `Enviado el ${new Date(tracking.fechaEnvio).toLocaleDateString()}`}
                {tracking.enviadoPor && ` por ${tracking.enviadoPor}`}
              </Typography>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>
              <Typography variant="body2" fontWeight={600} sx={{ color: "text.primary" }}>
                Recibida
              </Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {tracking.fechaRecepcion && `Recibida el ${new Date(tracking.fechaRecepcion).toLocaleDateString()}`}
                {tracking.recibidoPor && ` por ${tracking.recibidoPor}`}
              </Typography>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>
              <Typography variant="body2" fontWeight={600} sx={{ color: "text.primary" }}>
                Entregada
              </Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {tracking.fechaEntrega && `Entregada el ${new Date(tracking.fechaEntrega).toLocaleDateString()}`}
              </Typography>
            </StepContent>
          </Step>
        </Stepper>
        {tracking.observaciones && (
          <Box sx={{ mt: 3, p: 3, bgcolor: "background.default", borderRadius: "8px", border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="body2" fontWeight={600} sx={{ color: "text.primary", mb: 1 }}>
              Observaciones:
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {tracking.observaciones}
            </Typography>
          </Box>
        )}
      </Paper>
      {/* Modal para actualizar tracking */}
      <Dialog 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            bgcolor: "background.paper",
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h5" fontWeight={700} sx={{ color: "text.primary" }}>
            Actualizar Estado de Envío
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: theme.palette.text.secondary, "&.Mui-focused": { color: theme.palette.primary.main } }}>Estado</InputLabel>
              <Select
                value={formData.estado}
                label="Estado"
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as "EN_ORIGEN" | "EN_TRANSITO" | "RECIBIDA" | "ENTREGADA" })}
                sx={{
                  borderRadius: "8px",
                  color: theme.palette.text.primary,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.divider,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.text.primary,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                    },
                  },
                }}
              >
                {estadosTracking.map((estado) => (
                  <MenuItem key={estado.value} value={estado.value} style={{ color: theme.palette.text.primary }}>
                    {estado.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {formData.estado === "EN_TRANSITO" && (
              <FormControl fullWidth>
                <InputLabel sx={{ color: theme.palette.text.secondary, "&.Mui-focused": { color: theme.palette.primary.main } }}>Local Destino</InputLabel>
                <Select
                  value={formData.localDestino}
                  label="Local Destino"
                  onChange={(e) => setFormData({ ...formData, localDestino: e.target.value })}
                  sx={{
                    borderRadius: "8px",
                    color: theme.palette.text.primary,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.divider,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.text.primary,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                      },
                    },
                  }}
                >
                  {locales
                    .filter(local => local.id.toString() !== tracking.localOrigen)
                    .map((local) => (
                      <MenuItem key={local.id} value={local.id.toString()} style={{ color: theme.palette.text.primary }}>
                        {local.nombre}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
            <TextField
              fullWidth
              label="Observaciones"
              multiline
              rows={3}
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              placeholder="Agregar observaciones sobre el envío..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  color: theme.palette.text.primary,
                  "& fieldset": {
                    borderColor: theme.palette.divider,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.text.primary,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.text.secondary,
                  "&.Mui-focused": {
                    color: theme.palette.primary.main,
                  },
                },
                input: {
                  color: theme.palette.text.primary,
                },
              }}
              InputProps={{ style: { color: theme.palette.text.primary } }}
              InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setModalOpen(false)} 
            disabled={updating}
            sx={{
              color: theme.palette.text.secondary,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUpdateTracking}
            variant="contained"
            disabled={updating}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.mode === 'light' ? "#000" : "#fff",
              px: 4,
              py: 1.5,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
                boxShadow: "none",
              },
            }}
          >
            {updating ? "Actualizando..." : "Actualizar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 