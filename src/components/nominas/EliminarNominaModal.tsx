"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  useTheme,
} from "@mui/material";
import { Delete as DeleteIcon, Warning as WarningIcon } from "@mui/icons-material";
import { NominaCantera } from "@/types/nominaCheque";

interface EliminarNominaModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (nomina: NominaCantera) => Promise<void>;
  nomina: NominaCantera | null;
  loading?: boolean;
}

export function EliminarNominaModal({
  open,
  onClose,
  onConfirm,
  nomina,
  loading = false,
}: EliminarNominaModalProps) {
  const theme = useTheme();
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    setConfirmText("");
    setError("");
    onClose();
  };

  const handleConfirm = async () => {
    if (confirmText !== "ELIMINAR") {
      setError("Debes escribir exactamente 'ELIMINAR' para confirmar");
      return;
    }

    if (!nomina) return;

    try {
      await onConfirm(nomina);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar la nómina");
    }
  };

  const isConfirmValid = confirmText === "ELIMINAR";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          bgcolor: "background.paper",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <DialogTitle sx={{ 
        pb: 2, 
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: "background.default"
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: "text.primary" }}>
              Eliminar Nómina
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Esta acción no se puede deshacer
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        {nomina && (
          <Box sx={{ mb: 3, mt: 4 }}>
            <Alert
              severity="warning"
              icon={<WarningIcon />}
              sx={{
                borderRadius: "12px",
                border: `1px solid ${theme.palette.warning.light}`,
                bgcolor: theme.palette.warning.light + "30",
                "& .MuiAlert-icon": {
                  color: theme.palette.warning.dark,
                },
              }}
            >
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                ¿Estás seguro de que deseas eliminar esta nómina?
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                <strong>Nómina:</strong> {nomina.numeroNomina}<br />
                <strong>Fecha:</strong> {new Date(nomina.fechaEmision).toLocaleDateString('es-CL')}<br />
                <strong>Monto:</strong> ${nomina.montoTotal.toLocaleString('es-CL')}
              </Typography>
            </Alert>
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ color: "text.primary", mb: 2, fontWeight: 500 }}>
            Para confirmar la eliminación, escribe <strong>ELIMINAR</strong> en el campo de abajo:
          </Typography>
          <TextField
            fullWidth
            value={confirmText}
            onChange={(e) => {
              setConfirmText(e.target.value);
              setError("");
            }}
            placeholder="Escribe ELIMINAR aquí"
            variant="outlined"
            error={!!error}
            helperText={error}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.error.main,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.error.main,
                },
              },
            }}
          />
        </Box>

        <Box sx={{ 
          p: 3, 
          borderRadius: "12px", 
          bgcolor: theme.palette.grey[50],
          border: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
            ⚠️ <strong>Advertencia:</strong> Esta acción eliminará permanentemente:
          </Typography>
          <Box component="ul" sx={{ mt: 1, pl: 2, color: "text.secondary" }}>
            <li>La nómina y todos sus datos</li>
            <li>Los cheques asignados a esta nómina</li>
            <li>El historial de tracking asociado</li>
            <li>Todas las facturas vinculadas</li>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: "background.default",
        gap: 2
      }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            px: 3,
            py: 1,
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!isConfirmValid || loading}
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            px: 3,
            py: 1,
            boxShadow: "none",
            "&:hover": {
              boxShadow: `0 4px 12px ${theme.palette.error.main}30`,
            },
          }}
        >
          {loading ? "Eliminando..." : "Eliminar Nómina"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
