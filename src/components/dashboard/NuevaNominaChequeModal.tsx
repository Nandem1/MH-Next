"use client";

import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Stack, 
  Typography,
  useTheme,
  InputAdornment 
} from "@mui/material";
import { useState } from "react";
import { CrearNominaRequest } from "@/types/nominaCheque";
import { useAuthStatus } from "@/hooks/useAuthStatus";

interface NuevaNominaModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (request: CrearNominaRequest) => Promise<void>;
  loading?: boolean;
}

export function NuevaNominaModal({
  open,
  onClose,
  onSubmit,
  loading = false,
}: NuevaNominaModalProps) {
  const theme = useTheme();
  const { usuario } = useAuthStatus();
  const [numeroNomina, setNumeroNomina] = useState("");

  // Prefijo por local
  const prefixByLocal: Record<number, string> = {
    1: "NOM-LC1-",
    2: "NOM-LCO-",
    3: "NOM-BA1-",
  };
  const prefijo = usuario?.local_id ? (prefixByLocal[usuario.local_id] || "NOM-") : "NOM-";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!numeroNomina.trim()) {
      return;
    }

    if (!usuario) {
      console.error("No se pudo obtener la información del usuario");
      return;
    }

    const numeroSolo = numeroNomina.replace(/\D/g, "");
    const request: CrearNominaRequest = {
      nombre: `${prefijo}${numeroSolo}`.trim(),
      fecha: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
    };

    try {
      await onSubmit(request);
      // Limpiar formulario
      setNumeroNomina("");
      onClose();
    } catch (error) {
      // El error se maneja en el componente padre
      console.error("Error al crear nómina:", error);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setNumeroNomina("");
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
            Crear Nueva Nómina
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 0 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Número de Nómina"
              value={numeroNomina}
              onChange={(e) => setNumeroNomina(e.target.value.replace(/\D/g, ""))}
              fullWidth
              required
              disabled={loading}
              placeholder="Sólo número (ej: 00123)"
              inputProps={{ inputMode: "numeric", pattern: "\\d*" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">{prefijo}</InputAdornment>
                ),
              }}
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
            
            <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic" }}>
              • Se guardará como: {prefijo}{numeroNomina || "..."}
              • La fecha de emisión se establecerá automáticamente como hoy
              • El monto total se calculará automáticamente al asignar cheques
              • El tracking se iniciará en estado &quot;En Origen&quot;
              • Local de origen: {usuario?.local_nombre || "No disponible"}
            </Typography>
          </Stack>
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
            disabled={loading || !numeroNomina.trim() || !usuario}
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