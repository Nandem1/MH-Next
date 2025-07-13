"use client";

import { Box, Button, CircularProgress, Typography, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Container, Paper, Stack, useTheme } from "@mui/material";



import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStatus, locales } from "@/hooks/useAuthStatus";
import { useNominasCheque } from "@/hooks/useNominasCheque";
import { NominaChequeTable } from "@/components/dashboard/NominaChequeTable";
import { NuevaNominaChequeModal } from "@/components/dashboard/NuevaNominaChequeModal";
import { NuevoChequeModal } from "@/components/dashboard/NuevoChequeModal";
import { AsignarChequeModal } from "@/components/dashboard/AsignarChequeModal";
import { MarcarPagadoModal } from "@/components/dashboard/MarcarPagadoModal";
import { FiltroNominas } from "@/components/dashboard/FiltroNominas";
import { TrackingEnvioComponent } from "@/components/dashboard/TrackingEnvio";
import Footer from "@/components/shared/Footer";
import { NominaCheque, Cheque, TrackingEnvio, AsignarChequeRequest, MarcarPagadoRequest } from "@/types/nominaCheque";

export default function NominasPage() {
  const theme = useTheme();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, rol_id } = useAuthStatus();
  const {
    nominas,
    filtro,
    loading,
    crearNomina,
    crearCheque,
    asignarCheque,
    marcarChequePagado,
    actualizarTracking,
    setFiltro,
  } = useNominasCheque();

  const [modalNuevaNominaOpen, setModalNuevaNominaOpen] = useState(false);
  const [modalNuevoChequeOpen, setModalNuevoChequeOpen] = useState(false);
  const [modalAsignarOpen, setModalAsignarOpen] = useState(false);
  const [modalMarcarPagadoOpen, setModalMarcarPagadoOpen] = useState(false);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [selectedNomina, setSelectedNomina] = useState<NominaCheque | null>(null);
  const [selectedCheque, setSelectedCheque] = useState<{ nominaId: string; cheque: Cheque } | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  if (authLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  const esAdmin = rol_id === 1;

  const handleCrearNomina = async (request: { nombre: string; correlativoInicial: string; local: string }) => {
    try {
      await crearNomina(request);
      setSnackbarMessage("Nómina creada exitosamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err instanceof Error ? err.message : "Error al crear nómina");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCrearCheque = async (request: { numeroCorrelativo: string; nominaId?: string }) => {
    try {
      await crearCheque(request);
      setSnackbarMessage("Cheque creado exitosamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err instanceof Error ? err.message : "Error al crear cheque");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleViewNomina = (nomina: NominaCheque) => {
    setSelectedNomina(nomina);
    setModalDetalleOpen(true);
  };

  const handleAsignarCheque = (nominaId: string, chequeId: string) => {
    const nomina = nominas.find(n => n.id === nominaId);
    const cheque = nomina?.cheques.find(c => c.id === chequeId);
    
    if (nomina && cheque) {
      setSelectedCheque({ nominaId, cheque });
      setModalAsignarOpen(true);
    }
  };

  const handleConfirmarAsignacion = async (request: AsignarChequeRequest) => {
    if (!selectedCheque) return;
    
    try {
      await asignarCheque(selectedCheque.nominaId, selectedCheque.cheque.id, request);
      setSnackbarMessage("Cheque asignado exitosamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err instanceof Error ? err.message : "Error al asignar cheque");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleMarcarPagado = (nominaId: string, chequeId: string) => {
    const nomina = nominas.find(n => n.id === nominaId);
    const cheque = nomina?.cheques.find(c => c.id === chequeId);
    
    if (nomina && cheque) {
      setSelectedCheque({ nominaId, cheque });
      setModalMarcarPagadoOpen(true);
    }
  };

  const handleConfirmarMarcarPagado = async (request: MarcarPagadoRequest) => {
    if (!selectedCheque) return;
    
    try {
      await marcarChequePagado(selectedCheque.nominaId, selectedCheque.cheque.id, request);
      setSnackbarMessage("Cheque marcado como pagado");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err instanceof Error ? err.message : "Error al marcar cheque como pagado");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleUpdateTracking = async (trackingData: Partial<TrackingEnvio>) => {
    if (!selectedNomina) return;
    
    try {
      await actualizarTracking(selectedNomina.id, trackingData);
      setSnackbarMessage("Tracking actualizado exitosamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err instanceof Error ? err.message : "Error al actualizar tracking");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };



  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh",
      bgcolor: "background.default",
    }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 2 }, pt: 12, pb: 6, flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          {/* Development Banner */}
          <Paper 
            elevation={0}
            sx={{ 
              mb: 4, 
              p: 3, 
              bgcolor: theme.palette.mode === 'light' ? "#fff3cd" : "#2d2b1b",
              border: `1px solid ${theme.palette.mode === 'light' ? "#ffeaa7" : "#4a4a2b"}`,
              borderRadius: "12px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: "linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff)",
                backgroundSize: "200% 100%",
                animation: "gradient 3s ease infinite",
                "@keyframes gradient": {
                  "0%": { backgroundPosition: "0% 50%" },
                  "50%": { backgroundPosition: "100% 50%" },
                  "100%": { backgroundPosition: "0% 50%" },
                },
              }}
            />
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: theme.palette.mode === 'light' ? "#ffc107" : "#f39c12",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.mode === 'light' ? "#856404" : "#fff",
                    fontWeight: 700,
                    fontSize: "1.2rem",
                  }}
                >
                  🚧
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.mode === 'light' ? "#856404" : "#f39c12",
                    fontWeight: 700,
                    mb: 0.5,
                  }}
                >
                  Módulo en Desarrollo
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.mode === 'light' ? "#856404" : "#f4f4f4",
                    lineHeight: 1.5,
                  }}
                >
                  Este módulo está actualmente en desarrollo. La interfaz visual está casi completa, 
                  pero el backend aún no ha sido implementado. Las funcionalidades de crear nóminas, 
                  crear cheques manualmente, asignar cheques y actualizar estados no funcionarán hasta que se complete el desarrollo del backend.
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Typography 
            variant="h4" 
            fontWeight={700} 
            sx={{ 
              color: "text.primary", 
              mb: 2,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Gestión de Nóminas de Cheques
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: "text.secondary", 
              mb: 4,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Administra las nóminas de cheques, crea cheques manualmente, asigna facturas y controla el estado de pagos
          </Typography>

          {/* Action Buttons */}
          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            spacing={2} 
            sx={{ mb: 4 }}
            justifyContent={{ xs: "center", md: "flex-start" }}
          >
            <Button
              variant="contained"
              onClick={() => setModalNuevaNominaOpen(true)}
              disabled={!esAdmin}
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
              Nueva Nómina
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => setModalNuevoChequeOpen(true)}
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                px: 4,
                py: 1.5,
                borderRadius: "8px",
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: 600,
                "&:hover": {
                  borderColor: theme.palette.primary.dark,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.mode === 'light' ? "#000" : "#000",
                },
              }}
            >
              Nuevo Cheque
            </Button>
          </Stack>
        </Box>

        {/* Filters */}
        <FiltroNominas 
          filtro={filtro} 
          onFiltroChange={setFiltro} 
          locales={locales.map(l => ({ id: l.id.toString(), nombre: l.nombre }))}
        />

        {/* Content */}
        <NominaChequeTable
          nominas={nominas}
          onViewNomina={handleViewNomina}
          onAsignarCheque={handleAsignarCheque}
          onMarcarPagado={handleMarcarPagado}
        />

        {/* Modals */}
        <NuevaNominaChequeModal
          open={modalNuevaNominaOpen}
          onClose={() => setModalNuevaNominaOpen(false)}
          onSubmit={handleCrearNomina}
          loading={loading}
        />

        <NuevoChequeModal
          open={modalNuevoChequeOpen}
          onClose={() => setModalNuevoChequeOpen(false)}
          onSubmit={handleCrearCheque}
          loading={loading}
          nominasDisponibles={nominas.map(n => ({ id: n.id.toString(), nombre: n.nombre }))}
        />

        <AsignarChequeModal
          open={modalAsignarOpen}
          onClose={() => setModalAsignarOpen(false)}
          onAsignar={handleConfirmarAsignacion}
          numeroCheque={selectedCheque?.cheque.numeroCorrelativo || ""}
          loading={loading}
        />

        <MarcarPagadoModal
          open={modalMarcarPagadoOpen}
          onClose={() => setModalMarcarPagadoOpen(false)}
          onSubmit={handleConfirmarMarcarPagado}
          numeroCheque={selectedCheque?.cheque.numeroCorrelativo || ""}
          montoFactura={selectedCheque?.cheque.facturaAsociada?.monto}
          loading={loading}
        />

        {/* Detail Modal */}
        <Dialog
          open={modalDetalleOpen}
          onClose={() => setModalDetalleOpen(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "12px",
              bgcolor: "background.paper",
            }
          }}
        >
          <DialogTitle>
            <Typography variant="h5" fontWeight={700} sx={{ color: "text.primary" }}>
              Detalle de Nómina: {selectedNomina?.nombre}
            </Typography>
          </DialogTitle>
          <DialogContent>
            {selectedNomina && (
              <Box>
                {/* Tracking Component */}
                {selectedNomina.trackingEnvio && (
                  <TrackingEnvioComponent
                    tracking={selectedNomina.trackingEnvio}
                    onUpdateTracking={handleUpdateTracking}
                  />
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalDetalleOpen(false)}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
      
      <Footer />
    </Box>
  );
}
