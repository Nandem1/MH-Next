"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, Alert, CircularProgress, Chip, Paper, Stack, useTheme } from "@mui/material";



import { useState } from "react";
import { CrearNominaChequeRequest } from "@/types/nominaCheque";
import { useAuthStatus } from "@/hooks/useAuthStatus";

interface NuevaNominaChequeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (request: CrearNominaChequeRequest) => Promise<void>;
  loading?: boolean;
}

export function NuevaNominaChequeModal({
  open,
  onClose,
  onSubmit,
  loading = false,
}: NuevaNominaChequeModalProps) {
  const { usuario } = useAuthStatus();
  const theme = useTheme();
  const [nombre, setNombre] = useState("");
  const [correlativoInicial, setCorrelativoInicial] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Generar correlativos para preview
  const generarCorrelativos = (inicial: string): string[] => {
    if (!inicial || isNaN(parseInt(inicial))) return [];
    
    const base = parseInt(inicial);
    const correlativos: string[] = [];
    
    for (let i = 0; i < 10; i++) {
      correlativos.push((base + i).toString().padStart(6, '0'));
    }
    
    return correlativos;
  };

  const correlativos = generarCorrelativos(correlativoInicial);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      setError("El nombre es requerido");
      return;
    }
    
    if (!correlativoInicial.trim()) {
      setError("El correlativo inicial es requerido");
      return;
    }
    
    if (isNaN(parseInt(correlativoInicial))) {
      setError("El correlativo inicial debe ser un número válido");
      return;
    }

    if (!usuario) {
      setError("No se pudo obtener la información del usuario");
      return;
    }

    try {
      setError(null);
      await onSubmit({
        nombre: nombre.trim(),
        correlativoInicial: correlativoInicial.trim(),
        local: usuario.local_id.toString(),
      });
      
      // Limpiar formulario
      setNombre("");
      setCorrelativoInicial("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear nómina");
    }
  };

  const handleClose = () => {
    if (!loading) {
      setNombre("");
      setCorrelativoInicial("");
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
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
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h5" fontWeight={700} sx={{ color: "text.primary" }}>
            Nueva Nómina de Cheques
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 0 }}>
          <Box>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: "8px",
                  border: `1px solid ${theme.palette.error.light}`,
                  bgcolor: theme.palette.mode === 'light' ? "#fef2f2" : "#2d1b1b",
                  color: "error.main",
                }}
              >
                {error}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Nombre de la Nómina"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Nómina Junio 2025"
              margin="normal"
              required
              disabled={loading}
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
              helperText={<span style={{ color: theme.palette.text.secondary }}>Nombre descriptivo para identificar la nómina</span>}
            />
            
            <TextField
              fullWidth
              label="Correlativo Inicial"
              value={correlativoInicial}
              onChange={(e) => setCorrelativoInicial(e.target.value)}
              placeholder="Ej: 100001"
              margin="normal"
              required
              disabled={loading}
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
              helperText={<span style={{ color: theme.palette.text.secondary }}>Número del primer cheque de la nómina</span>}
              inputProps={{
                pattern: "[0-9]*",
                inputMode: "numeric",
              }}
            />
            
            {correlativos.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ color: "text.primary", mb: 2 }}>
                  Cheques que se generarán:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {correlativos.map((correlativo, index) => (
                    <Chip
                      key={index}
                      label={`#${correlativo}`}
                      size="small"
                      sx={{
                        bgcolor: index === 0
                          ? theme.palette.primary.main
                          : theme.palette.mode === 'light'
                            ? theme.palette.grey[200]
                            : theme.palette.grey[800],
                        color: index === 0
                          ? (theme.palette.mode === 'light' ? "#000" : "#000")
                          : theme.palette.text.primary,
                        fontWeight: 500,
                        border: `1px solid ${index === 0 ? theme.palette.primary.main : theme.palette.divider}`,
                        "&:hover": {
                          bgcolor: index === 0
                            ? theme.palette.primary.dark
                            : theme.palette.mode === 'light'
                              ? theme.palette.grey[300]
                              : theme.palette.grey[700],
                        },
                      }}
                    />
                  ))}
                </Stack>
                <Typography variant="caption" sx={{ color: "text.secondary", mt: 1, display: "block" }}>
                  Total: {correlativos.length} cheques (del {correlativos[0]} al {correlativos[correlativos.length - 1]})
                </Typography>
              </Box>
            )}
            
            <Paper 
              elevation={0}
              sx={{ 
                mt: 4, 
                p: 3, 
                bgcolor: theme.palette.mode === 'light' ? theme.palette.info.light : theme.palette.background.default,
                border: `1px solid ${theme.palette.info.main}`,
                borderRadius: "8px",
              }}
            >
              <Typography variant="body2" sx={{ color: theme.palette.info.main, fontWeight: 600, mb: 2 }}>
                Información de Envío:
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  • Local de origen: <strong style={{ color: theme.palette.text.primary }}>{usuario?.local_nombre || "No disponible"}</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  • Estado inicial: <Chip label="En Origen" size="small" sx={{ bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800], color: theme.palette.text.secondary, fontWeight: 500, border: `1px solid ${theme.palette.divider}` }} />
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  • Creado por: <strong style={{ color: theme.palette.text.primary }}>{usuario?.nombre || "Usuario"}</strong>
                </Typography>
              </Stack>
            </Paper>
            
            <Paper 
              elevation={0}
              sx={{ 
                mt: 3, 
                p: 3, 
                bgcolor: theme.palette.background.default,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px",
              }}
            >
              <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 2 }}>
                Información:
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  • Se generarán automáticamente 10 cheques correlativos
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  • Los cheques estarán disponibles para asignar a facturas
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  • Puedes asignar cheques a facturas desde la vista de la nómina
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  • La nómina iniciará en estado &quot;En Origen&quot; para tracking de envío
                </Typography>
              </Stack>
            </Paper>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
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
            type="submit"
            variant="contained"
            disabled={loading || !nombre.trim() || !correlativoInicial.trim() || !usuario}
            startIcon={loading ? <CircularProgress size={16} /> : null}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.mode === 'light' ? "#000" : "#000",
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
              "&:disabled": {
                bgcolor: theme.palette.action.disabledBackground,
                color: theme.palette.action.disabled,
              },
            }}
          >
            {loading ? "Creando..." : "Crear Nómina"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 