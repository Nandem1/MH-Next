"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import { useTheme } from "@mui/material";
import { Cheque, CrearChequeRequest } from "@/types/factura";
import { useCheques, useCreateCheque, useUpdateCheque, useDeleteCheque } from "@/hooks/useCheques";
import { montoAEntero } from "@/utils/formatearMonto";

interface GestionChequesModalProps {
  open: boolean;
  onClose: () => void;
}

export function GestionChequesModal({
  open,
  onClose,
}: GestionChequesModalProps) {
  const theme = useTheme();
  const [mode, setMode] = useState<"list" | "create" | "edit" | "view">("list");
  const [selectedCheque, setSelectedCheque] = useState<Cheque | null>(null);
  const [formData, setFormData] = useState<CrearChequeRequest>({
    correlativo: "",
    monto: 0,
  });
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const { data: chequesData, isLoading: isLoadingCheques } = useCheques(100, 0);
  const createChequeMutation = useCreateCheque();
  const updateChequeMutation = useUpdateCheque();
  const deleteChequeMutation = useDeleteCheque();

  const cheques = chequesData?.data || [];

  const handleClose = () => {
    setMode("list");
    setSelectedCheque(null);
    setFormData({ correlativo: "", monto: 0 });
    setError(null);
    onClose();
  };

  const handleCreate = () => {
    setMode("create");
    setFormData({ correlativo: "", monto: 0 });
    setError(null);
  };

  const handleEdit = (cheque: Cheque) => {
    setSelectedCheque(cheque);
    setFormData({
      correlativo: cheque.correlativo,
      monto: montoAEntero(cheque.monto),
    });
    setMode("edit");
    setError(null);
  };

  const handleView = (cheque: Cheque) => {
    setSelectedCheque(cheque);
    setMode("view");
    setError(null);
  };

  const handleDelete = async (cheque: Cheque) => {
    if (window.confirm(`¿Está seguro de eliminar el cheque ${cheque.correlativo}?`)) {
      try {
        await deleteChequeMutation.mutateAsync(cheque.id);
      } catch {
        setError("No se pudo eliminar el cheque");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.correlativo.trim()) {
      setError("El correlativo es requerido");
      return;
    }
    
    if (formData.monto <= 0) {
      setError("El monto debe ser mayor a 0");
      return;
    }

    try {
      setError(null);
      
      if (mode === "create") {
        await createChequeMutation.mutateAsync(formData);
        setMode("list");
      } else if (mode === "edit" && selectedCheque) {
        await updateChequeMutation.mutateAsync({
          id: selectedCheque.id,
          data: formData,
        });
        setMode("list");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al procesar el cheque");
    }
  };

  const getMontoDisponible = (cheque: Cheque) => {
    const montoAsignado = montoAEntero(cheque.monto_asignado);
    const montoTotal = montoAEntero(cheque.monto);
    const montoDisponible = montoTotal - montoAsignado;
    return {
      montoTotal,
      montoAsignado,
      montoDisponible,
      montoAdicional: montoDisponible, // Monto que se puede asignar adicionalmente
      porcentajeUsado: montoAsignado > 0 ? Math.round((montoAsignado / montoTotal) * 100) : 0
    };
  };

  const isLoading = createChequeMutation.isPending || updateChequeMutation.isPending || deleteChequeMutation.isPending;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="lg" 
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
          {mode === "list" && "Gestión de Cheques"}
          {mode === "create" && "Crear Nuevo Cheque"}
          {mode === "edit" && "Editar Cheque"}
          {mode === "view" && "Detalles del Cheque"}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 0 }}>
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

        {/* Lista de Cheques */}
        {mode === "list" && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {cheques.length} cheques encontrados
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                                          createChequeMutation.mutate({
                        correlativo: `CHK-TEST-${Date.now()}`,
                        monto: 100000
                      });
                  }}
                  disabled={isLoading}
                  sx={{ textTransform: "none" }}
                >
                  Crear Cheque Test
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCreate}
                  disabled={isLoading}
                  sx={{ textTransform: "none" }}
                >
                  Crear Cheque
                </Button>
              </Box>
            </Box>

            {isLoadingCheques ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Correlativo</TableCell>
                      <TableCell align="right">Monto Total</TableCell>
                      <TableCell align="right">Disponible</TableCell>
                      <TableCell align="center">Facturas</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cheques.map((cheque) => (
                      <TableRow key={cheque.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {cheque.correlativo}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          ${montoAEntero(cheque.monto).toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`$${getMontoDisponible(cheque).montoDisponible.toLocaleString()}`}
                            size="small"
                            color={getMontoDisponible(cheque).montoDisponible > 0 ? "success" : "error"}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {cheque.cantidad_facturas || 0}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleView(cheque)}
                            disabled={isLoading}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(cheque)}
                            disabled={isLoading}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(cheque)}
                            disabled={isLoading || (cheque.cantidad_facturas || 0) > 0}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}

        {/* Formulario de Crear/Editar */}
        {(mode === "create" || mode === "edit") && (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Correlativo del Cheque"
              value={formData.correlativo}
              onChange={(e) => setFormData({ ...formData, correlativo: e.target.value })}
              placeholder="Ej: CHK-001-2024"
              margin="normal"
              required
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="Monto del Cheque"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: montoAEntero(e.target.value) || 0 })}
              type="number"
              margin="normal"
              required
              disabled={isLoading}
              inputProps={{ min: 0, step: 1 }}
            />
          </form>
        )}

        {/* Vista de Detalles */}
        {mode === "view" && selectedCheque && (
          <Box>
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Chip
                                  label={`Total: $${montoAEntero(selectedCheque.monto).toLocaleString()}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`Disponible: $${getMontoDisponible(selectedCheque).montoDisponible.toLocaleString()}`}
                color={getMontoDisponible(selectedCheque).montoDisponible > 0 ? "success" : "error"}
                variant="outlined"
              />
              <Chip
                label={`Facturas: ${selectedCheque.cantidad_facturas || 0}`}
                color="info"
                variant="outlined"
              />
            </Box>

            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Información del Cheque
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Correlativo:</strong> {selectedCheque.correlativo}
              </Typography>
              <Typography variant="body2">
                <strong>Monto Total:</strong> ${montoAEntero(selectedCheque.monto).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <strong>Monto Asignado:</strong> ${(selectedCheque.monto_asignado || 0).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <strong>Monto Disponible:</strong> ${getMontoDisponible(selectedCheque).montoDisponible.toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <strong>Creado:</strong> {new Date(selectedCheque.created_at).toLocaleDateString()}
              </Typography>
              {selectedCheque.nombre_usuario && (
                <Typography variant="body2">
                  <strong>Creado por:</strong> {selectedCheque.nombre_usuario}
                </Typography>
              )}
            </Box>

            {/* Lista de Facturas Asociadas */}
            {selectedCheque.facturas && selectedCheque.facturas.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Facturas Asociadas
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 200 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Folio</TableCell>
                        <TableCell>Proveedor</TableCell>
                        <TableCell align="right">Monto Factura</TableCell>
                        <TableCell align="right">Monto Asignado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedCheque.facturas.map((factura) => (
                        <TableRow key={factura.id_factura}>
                          <TableCell>{factura.folio}</TableCell>
                          <TableCell>{factura.proveedor}</TableCell>
                          <TableCell align="right">${factura.monto_factura.toLocaleString()}</TableCell>
                          <TableCell align="right">${factura.monto_asignado.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        {mode === "list" && (
          <Button onClick={handleClose}>
            Cerrar
          </Button>
        )}
        
        {(mode === "create" || mode === "edit") && (
          <>
            <Button
              onClick={() => setMode("list")}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={isLoading}
              sx={{ textTransform: "none" }}
            >
              {isLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={16} color="inherit" />
                  Guardando...
                </Box>
              ) : (
                mode === "create" ? "Crear" : "Actualizar"
              )}
            </Button>
          </>
        )}
        
        {mode === "view" && (
          <>
            <Button
              onClick={() => setMode("list")}
            >
              Volver
            </Button>
            <Button
              onClick={() => handleEdit(selectedCheque!)}
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Editar
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
} 