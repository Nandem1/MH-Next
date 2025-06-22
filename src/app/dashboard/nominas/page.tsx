"use client";

import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
  Container,
  Paper,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStatus, locales } from "@/hooks/useAuthStatus";
import { useNominasCheque } from "@/hooks/useNominasCheque";
import { NominaChequeTable } from "@/components/dashboard/NominaChequeTable";
import { NuevaNominaChequeModal } from "@/components/dashboard/NuevaNominaChequeModal";
import { AsignarChequeModal } from "@/components/dashboard/AsignarChequeModal";
import { FiltroNominas } from "@/components/dashboard/FiltroNominas";
import { TrackingEnvioComponent } from "@/components/dashboard/TrackingEnvio";
import Footer from "@/components/shared/Footer";
import { NominaCheque, Cheque, TrackingEnvio } from "@/types/nominaCheque";

export default function NominasPage() {
  const theme = useTheme();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, rol_id, usuario } = useAuthStatus();
  const {
    nominas,
    filtro,
    loading,
    error,
    crearNomina,
    asignarCheque,
    marcarChequePagado,
    actualizarTracking,
    clearError,
    setFiltro,
  } = useNominasCheque();

  const [modalNuevaNominaOpen, setModalNuevaNominaOpen] = useState(false);
  const [modalAsignarOpen, setModalAsignarOpen] = useState(false);
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

  const handleConfirmarAsignacion = async (facturaId: string) => {
    if (!selectedCheque) return;
    
    try {
      await asignarCheque(selectedCheque.nominaId, selectedCheque.cheque.id, facturaId);
      setSnackbarMessage("Cheque asignado exitosamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err instanceof Error ? err.message : "Error al asignar cheque");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleMarcarPagado = async (nominaId: string, chequeId: string) => {
    try {
      await marcarChequePagado(nominaId, chequeId);
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

  const getLocalNombre = (localId: string) => {
    return locales.find(l => l.id.toString() === localId)?.nombre || localId;
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
                  asignar cheques y actualizar estados no funcionarán hasta que se complete el desarrollo del backend.
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Typography 
            variant="h3" 
            fontWeight={700}
            sx={{ 
              fontSize: { xs: "2rem", md: "2.5rem" },
              color: "text.primary",
              mb: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Nóminas de Cheques
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: "text.secondary",
              fontSize: "1.1rem",
              lineHeight: 1.6,
              maxWidth: "600px",
            }}
          >
            Gestiona el proceso digital de cheques físicos. Crea nóminas de 10 cheques correlativos 
            y asígnalos a facturas para el control de pagos.
          </Typography>
        </Box>

        {/* Información del usuario */}
        {usuario && (
          <Paper 
            elevation={0}
            sx={{ 
              mb: 4, 
              p: 3, 
              bgcolor: "background.paper",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "12px",
            }}
          >
            <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                  Usuario
                </Typography>
                <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500 }}>
                  {usuario.nombre}
                </Typography>
              </Box>
              <Box sx={{ width: "1px", height: "24px", bgcolor: "divider" }} />
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                  Local
                </Typography>
                <Chip
                  label={usuario.local_nombre}
                  size="small"
                  sx={{
                    bgcolor: theme.palette.mode === 'light' ? "#f0f0f0" : "#333",
                    marginLeft: "8px",
                    color: "text.primary",
                    fontWeight: 500,
                    border: `1px solid ${theme.palette.divider}`,
                    "&:hover": {
                      bgcolor: theme.palette.mode === 'light' ? "#e8e8e8" : "#444",
                    },
                  }}
                />
              </Box>
            </Stack>
          </Paper>
        )}

        {/* Filtros */}
        <FiltroNominas
          filtro={filtro}
          onFiltroChange={setFiltro}
          locales={locales.map(l => ({ id: l.id.toString(), nombre: l.nombre }))}
        />

        {/* Botón crear nómina */}
        {esAdmin && (
          <Box sx={{ mb: 4 }}>
            <Button
              variant="contained"
              onClick={() => setModalNuevaNominaOpen(true)}
              disabled={loading}
              sx={{
                bgcolor: "primary.main",
                color: theme.palette.mode === 'light' ? "#000" : "#000",
                px: 4,
                py: 1.5,
                borderRadius: "8px",
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: 600,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "primary.dark",
                  boxShadow: "none",
                },
                "&:disabled": {
                  bgcolor: "action.disabledBackground",
                  color: "action.disabled",
                },
              }}
            >
              Crear Nueva Nómina
            </Button>
          </Box>
        )}

        {/* Error */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4, 
              borderRadius: "8px",
              border: `1px solid ${theme.palette.error.light}`,
              bgcolor: theme.palette.mode === 'light' ? "#fef2f2" : "#2d1b1b",
              color: "error.main",
            }} 
            onClose={clearError}
          >
            {error}
          </Alert>
        )}

        {/* Contenido principal */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={32} />
          </Box>
        ) : nominas.length === 0 ? (
          <Paper 
            elevation={0}
            sx={{ 
              textAlign: "center", 
              py: 8, 
              bgcolor: "background.paper",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "12px",
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: "text.secondary", 
                mb: 2,
                fontWeight: 500,
              }}
            >
              No hay nóminas que coincidan con los filtros
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: "text.secondary",
                maxWidth: "400px",
                mx: "auto",
              }}
            >
              {esAdmin 
                ? "Crea tu primera nómina de cheques usando el botón de arriba"
                : "Contacta a un administrador para crear nóminas de cheques"
              }
            </Typography>
          </Paper>
        ) : (
          <NominaChequeTable
            nominas={nominas}
            onViewNomina={handleViewNomina}
            onAsignarCheque={handleAsignarCheque}
            onMarcarPagado={handleMarcarPagado}
          />
        )}

        {/* Modales */}
        <NuevaNominaChequeModal
          open={modalNuevaNominaOpen}
          onClose={() => setModalNuevaNominaOpen(false)}
          onSubmit={handleCrearNomina}
          loading={loading}
        />

        {selectedCheque && (
          <AsignarChequeModal
            open={modalAsignarOpen}
            onClose={() => {
              setModalAsignarOpen(false);
              setSelectedCheque(null);
            }}
            onAsignar={handleConfirmarAsignacion}
            numeroCheque={selectedCheque.cheque.numeroCorrelativo}
            loading={loading}
          />
        )}

        {/* Modal Detalle de Nómina */}
        <Dialog
          open={modalDetalleOpen}
          onClose={() => {
            setModalDetalleOpen(false);
            setSelectedNomina(null);
          }}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "12px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }
          }}
        >
          <DialogTitle sx={{ pb: 2 }}>
            <Typography variant="h5" fontWeight={700} sx={{ color: "text.primary" }}>
              Detalles de Nómina
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
              {selectedNomina?.nombre}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 0 }}>
            {selectedNomina && (
              <Box>
                <Stack direction="row" spacing={4} sx={{ mb: 4, flexWrap: "wrap" }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                      Local
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500 }}>
                      {getLocalNombre(selectedNomina.local)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                      Correlativos
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500 }}>
                      {selectedNomina.correlativoInicial} - {selectedNomina.correlativoFinal}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                      Estado
                    </Typography>
                    <Chip
                      label={selectedNomina.estado}
                      size="small"
                      sx={{
                        bgcolor: selectedNomina.estado === "ACTIVA" ? "success.light" : 
                                selectedNomina.estado === "COMPLETADA" ? "primary.light" : "error.light",
                        color: selectedNomina.estado === "ACTIVA" ? "success.dark" : 
                               selectedNomina.estado === "COMPLETADA" ? "primary.dark" : "error.dark",
                        fontWeight: 600,
                        border: "1px solid",
                        borderColor: selectedNomina.estado === "ACTIVA" ? "success.main" : 
                                   selectedNomina.estado === "COMPLETADA" ? "primary.main" : "error.main",
                      }}
                    />
                  </Box>
                </Stack>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                    Creado por
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500 }}>
                    {selectedNomina.creadoPor}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                    Fecha de creación
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500 }}>
                    {new Date(selectedNomina.fechaCreacion).toLocaleDateString()}
                  </Typography>
                </Box>
                
                {/* Tracking de envío */}
                {selectedNomina.trackingEnvio && (
                  <Box sx={{ mb: 4 }}>
                    <TrackingEnvioComponent
                      tracking={selectedNomina.trackingEnvio}
                      onUpdateTracking={handleUpdateTracking}
                      readonly={false}
                    />
                  </Box>
                )}
                
                <Box>
                  <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 600, mb: 2 }}>
                    Cheques de la Nómina
                  </Typography>
                  <NominaChequeTable
                    nominas={[selectedNomina]}
                    onViewNomina={() => {}}
                    onAsignarCheque={handleAsignarCheque}
                    onMarcarPagado={handleMarcarPagado}
                  />
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button 
              onClick={() => {
                setModalDetalleOpen(false);
                setSelectedNomina(null);
              }}
              sx={{
                color: "text.secondary",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert 
            severity={snackbarSeverity} 
            sx={{ 
              width: "100%",
              borderRadius: "8px",
              fontWeight: 500,
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>

      <Footer />
    </Box>
  );
}
