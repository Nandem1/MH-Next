"use client";

import { 
  Box, 
  Typography, 
  Chip, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Stack, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  useTheme 
} from "@mui/material";
import { useState } from "react";
import { TrackingEnvio, ActualizarTrackingRequest } from "@/types/nominaCheque";
import { locales } from "@/hooks/useAuthStatus";

interface TrackingEnvioProps {
  tracking: TrackingEnvio;
  onUpdateTracking?: (tracking: ActualizarTrackingRequest) => Promise<void>;
  readonly?: boolean;
}

const estadosTracking = [
  { value: "EN_ORIGEN" as const, label: "En Origen", color: "default" as const },
  { value: "EN_TRANSITO" as const, label: "En Tránsito", color: "warning" as const },
  { value: "RECIBIDA" as const, label: "Recibida", color: "info" as const },
];

export function TrackingEnvioComponent({
  tracking,
  onUpdateTracking,
  readonly = false,
}: TrackingEnvioProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    estado: tracking.estado as "EN_TRANSITO" | "RECIBIDA",
    localDestino: tracking.localDestino || "",
    observaciones: tracking.observaciones || "",
  });
  const theme = useTheme();

  const getEstadoIndex = (estado: string) => {
    return estadosTracking.findIndex(e => e.value === estado);
  };

  const getLocalNombre = (localId: string) => {
    return locales.find(l => l.id.toString() === localId)?.nombre || localId;
  };

  const handleUpdateTracking = async () => {
    if (!onUpdateTracking) return;
    try {
      setUpdating(true);
      await onUpdateTracking({
        estado: formData.estado,
        observaciones: formData.observaciones || undefined,
        fechaEnvio: formData.estado === "EN_TRANSITO" ? new Date().toISOString() : undefined,
        fechaRecepcion: formData.estado === "RECIBIDA" ? new Date().toISOString() : undefined,
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
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h6" fontWeight={600} sx={{ color: "text.primary", mb: 0.5 }}>
            Tracking de Envío
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Seguimiento del estado de la nómina
          </Typography>
        </Box>
        {!readonly && onUpdateTracking && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => setModalOpen(true)}
            sx={{
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 2,
              "&:hover": {
                borderColor: theme.palette.primary.main,
                bgcolor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
              },
            }}
          >
            Actualizar Estado
          </Button>
        )}
      </Box>
      
      <Box sx={{ 
        bgcolor: "background.default", 
        border: `1px solid ${theme.palette.divider}`, 
        borderRadius: "12px", 
        p: 3 
      }}>
        <Stepper 
          activeStep={getEstadoIndex(tracking.estado)} 
          orientation="vertical"
          sx={{
            "& .MuiStepConnector-line": {
              borderColor: theme.palette.divider,
            },
            "& .MuiStepLabel-root": {
              "&.Mui-completed": {
                color: theme.palette.success.main,
              },
              "&.Mui-active": {
                color: theme.palette.primary.main,
              },
            },
          }}
        >
          <Step>
            <StepLabel>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" fontWeight={600} sx={{ color: "text.primary" }}>
                  En Origen
                </Typography>
                <Chip
                  label={getLocalNombre(tracking.localOrigen)}
                  size="small"
                  sx={{
                    bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
                    color: theme.palette.text.secondary,
                    fontWeight: 600,
                    borderRadius: "6px",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                />
              </Stack>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Nómina creada en {getLocalNombre(tracking.localOrigen)}
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
                    label={`→ ${getLocalNombre(tracking.localDestino)}`}
                    size="small"
                    sx={{
                      bgcolor: theme.palette.warning.light,
                      color: theme.palette.warning.dark,
                      fontWeight: 600,
                      borderRadius: "6px",
                      border: `1px solid ${theme.palette.warning.main}`,
                    }}
                  />
                )}
              </Stack>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {tracking.fechaEnvio && `Enviado el ${new Date(tracking.fechaEnvio).toLocaleDateString('es-CL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}`}
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
                {tracking.fechaRecepcion && `Recibida el ${new Date(tracking.fechaRecepcion).toLocaleDateString('es-CL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}`}
                {tracking.recibidoPor && ` por ${tracking.recibidoPor}`}
              </Typography>
            </StepContent>
          </Step>
        </Stepper>
        
        {tracking.observaciones && (
          <Box sx={{ 
            mt: 3, 
            p: 3, 
            bgcolor: "background.paper", 
            borderRadius: "8px", 
            border: `1px solid ${theme.palette.divider}` 
          }}>
            <Typography variant="body2" fontWeight={600} sx={{ color: "text.primary", mb: 1 }}>
              Observaciones:
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {tracking.observaciones}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Modal para actualizar tracking */}
      <Dialog 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        maxWidth="sm" 
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
          <Typography variant="h5" fontWeight={700} sx={{ color: "text.primary" }}>
            Actualizar Estado de Envío
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 4 }}>
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ 
                  color: theme.palette.text.secondary, 
                  "&.Mui-focused": { color: theme.palette.primary.main } 
                }}>
                  Estado
                </InputLabel>
                <Select
                  value={formData.estado}
                  label="Estado"
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value as "EN_TRANSITO" | "RECIBIDA" })}
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
                        borderRadius: "8px",
                        border: `1px solid ${theme.palette.divider}`,
                      },
                    },
                  }}
                >
                  {estadosTracking.slice(1).map((estado) => (
                    <MenuItem key={estado.value} value={estado.value} style={{ color: theme.palette.text.primary }}>
                      {estado.label}
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, fontStyle: "italic" }}>
                  Estado actual: En origen - {getLocalNombre(tracking.localOrigen)}
                </Typography>
              </FormControl>
              
              {formData.estado === "EN_TRANSITO" && (
                <FormControl fullWidth>
                  <InputLabel sx={{ 
                    color: theme.palette.text.secondary, 
                    "&.Mui-focused": { color: theme.palette.primary.main } 
                  }}>
                    Local Destino
                  </InputLabel>
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
                          borderRadius: "8px",
                          border: `1px solid ${theme.palette.divider}`,
                        },
                      },
                    }}
                  >
                    {locales.map((local) => (
                      <MenuItem key={local.id} value={local.nombre} style={{ color: theme.palette.text.primary }}>
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
                }}
              />
            </Stack>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: "background.default"
        }}>
          <Button 
            onClick={() => setModalOpen(false)} 
            disabled={updating}
            sx={{
              color: theme.palette.text.secondary,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
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
              color: theme.palette.primary.contrastText,
              px: 4,
              py: 1.5,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
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