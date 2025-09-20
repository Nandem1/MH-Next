"use client";

import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  useTheme,
  Box,
  Typography,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  RemoveCircle as RemoveCircleIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { FacturaAsignada, ChequeAsignado } from "@/types/nominaCheque";
import { formatearMontoPesos } from "@/utils/formatearMonto";

interface NominaItemMenuActionsProps {
  factura: FacturaAsignada;
  tipoNomina: "cheques" | "facturas" | "mixta";
  onDesasignarFactura?: (factura: FacturaAsignada) => void;
  onDesasignarCheque?: (cheque: ChequeAsignado) => void;
  onAsignarCheque?: (factura: FacturaAsignada) => void;
}

export function NominaItemMenuActions({
  factura,
  tipoNomina,
  onDesasignarFactura,
  onDesasignarCheque,
  onAsignarCheque,
}: NominaItemMenuActionsProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDesasignarClick = () => {
    handleClose();
    setConfirmDialogOpen(true);
  };

  const handleAsignarChequeClick = () => {
    if (onAsignarCheque) {
      onAsignarCheque(factura);
    }
    handleClose();
  };

  const handleConfirmDesasignar = () => {
    if (tipoNomina === "cheques" && factura.cheque_asignado && onDesasignarCheque) {
      // Desasignar cheque
      const cheque: ChequeAsignado = {
        id: factura.cheque_asignado.id.toString(),
        correlativo: factura.cheque_asignado.correlativo,
        monto: factura.cheque_asignado.monto,
        montoAsignado: factura.cheque_asignado.monto_asignado,
        createdAt: factura.cheque_asignado.fecha_asignacion_cheque || '',
        idUsuario: factura.cheque_asignado.id.toString(),
        nombreUsuario: factura.cheque_asignado.nombre_usuario_cheque,
        fechaAsignacion: factura.cheque_asignado.fecha_asignacion_cheque,
        facturas: undefined,
        numeroCorrelativo: factura.cheque_asignado.correlativo,
        estado: "ASIGNADO" as const,
        fechaPago: undefined,
        facturaAsociada: undefined,
      };
      onDesasignarCheque(cheque);
    } else if ((tipoNomina === "mixta" || tipoNomina === "facturas") && onDesasignarFactura) {
      // Desasignar factura
      onDesasignarFactura(factura);
    }
    setConfirmDialogOpen(false);
  };

  const handleCancelDesasignar = () => {
    setConfirmDialogOpen(false);
  };

  // Determinar qué opción mostrar basado en el tipo de nómina
  const isNominaCheques = tipoNomina === "cheques";
  const isNominaMixta = tipoNomina === "mixta" || tipoNomina === "facturas";
  
  // Determinar qué opciones están disponibles
  const canDesasignar = (isNominaCheques && factura.cheque_asignado && onDesasignarCheque) || 
                       (isNominaMixta && onDesasignarFactura);
  
  const canAsignarCheque = onAsignarCheque && !factura.cheque_asignado;

  // Solo mostrar el menú si hay al menos una opción disponible
  if (!canDesasignar && !canAsignarCheque) {
    return null;
  }

  const getDesasignarText = () => {
    if (isNominaCheques) return "Desasignar cheque";
    return "Desasignar factura";
  };

  const getDesasignarSecondary = () => {
    if (isNominaCheques) return "Quitar cheque de la nómina";
    return "Quitar factura de la nómina";
  };

  const getDialogTitle = () => {
    if (isNominaCheques) return "Desasignar Cheque";
    return "Desasignar Factura";
  };

  const getDialogContent = () => {
    if (isNominaCheques && factura.cheque_asignado) {
      return (
        <>
          <DialogContentText sx={{ color: "text.primary", mb: 2 }}>
            ¿Estás seguro de que deseas desasignar este cheque de la nómina?
          </DialogContentText>
          
          <Box sx={{ 
            p: 2, 
            bgcolor: "background.default", 
            borderRadius: "8px",
            border: `1px solid ${theme.palette.divider}`
          }}>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
              <strong>Cheque:</strong> #{factura.cheque_asignado.correlativo}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
              <strong>Monto:</strong> {formatearMontoPesos(factura.cheque_asignado.monto)}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
              <strong>Monto asignado:</strong> {formatearMontoPesos(factura.cheque_asignado.monto_asignado)}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              <strong>Asignado por:</strong> {factura.cheque_asignado.nombre_usuario_cheque}
            </Typography>
          </Box>
          
          <DialogContentText sx={{ color: "text.secondary", mt: 2, fontSize: "0.875rem" }}>
            Esta acción:
            <br />• Eliminará la relación entre el cheque y la nómina
            <br />• Marcará el cheque como no asignado
            <br />• Actualizará las facturas asociadas al cheque
            <br />• Actualizará el monto total de la nómina
          </DialogContentText>
        </>
      );
    } else {
      return (
        <>
          <DialogContentText sx={{ color: "text.primary", mb: 2 }}>
            ¿Estás seguro de que deseas desasignar esta factura de la nómina?
          </DialogContentText>
          
          <Box sx={{ 
            p: 2, 
            bgcolor: "background.default", 
            borderRadius: "8px",
            border: `1px solid ${theme.palette.divider}`
          }}>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
              <strong>Factura:</strong> #{factura.folio}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
              <strong>Proveedor:</strong> {factura.proveedor}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              <strong>Monto asignado:</strong> {formatearMontoPesos(factura.montoAsignado)}
            </Typography>
          </Box>
          
          <DialogContentText sx={{ color: "text.secondary", mt: 2, fontSize: "0.875rem" }}>
            Esta acción:
            <br />• Eliminará la relación entre la factura y la nómina
            <br />• Marcará la factura como no asignada
            <br />• Actualizará el monto total de la nómina
          </DialogContentText>
        </>
      );
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          color: "text.secondary",
          "&:hover": {
            color: "text.primary",
            bgcolor: "action.hover",
          },
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            minWidth: 200,
            mt: 1,
            boxShadow: 2,
          },
        }}
      >
        {/* Opción de asignar cheque */}
        {canAsignarCheque && (
          <MenuItem onClick={handleAsignarChequeClick}>
            <ListItemIcon>
              <AssignmentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Asignar cheque"
              secondary="Asignar cheque a esta factura"
            />
          </MenuItem>
        )}

        {/* Opción de desasignación */}
        {canDesasignar && (
          <MenuItem onClick={handleDesasignarClick} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <RemoveCircleIcon fontSize="small" sx={{ color: "error.main" }} />
            </ListItemIcon>
            <ListItemText
              primary={getDesasignarText()}
              secondary={getDesasignarSecondary()}
              sx={{ color: "error.main" }}
            />
          </MenuItem>
        )}
      </Menu>

      {/* Dialog de confirmación */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelDesasignar}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            bgcolor: "background.paper",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: `1px solid ${theme.palette.divider}`,
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 2, 
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: "background.default"
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <RemoveCircleIcon sx={{ color: "error.main", fontSize: 28 }} />
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ color: "text.primary" }}>
                {getDialogTitle()}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Confirmar acción de desasignación
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {getDialogContent()}
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: "background.default",
          gap: 1
        }}>
          <Button
            onClick={handleCancelDesasignar}
            variant="outlined"
            sx={{
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
              "&:hover": {
                borderColor: theme.palette.primary.main,
                bgcolor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDesasignar}
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            {getDesasignarText()}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
