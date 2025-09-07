"use client";

import { useState, useCallback } from "react";
import {
  Container,
  Typography,
  Button,
  Stack,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  useTheme,
  TablePagination,
} from "@mui/material";
import { Add as AddIcon, Assignment as AssignmentIcon } from "@mui/icons-material";
import { useNominasCheque } from "@/hooks/useNominasCheque";
import { useUsuarios } from "@/hooks/useUsuarios";
import { AnimatedBox, AnimatedPaper, AnimatedButton, AnimatedTypography } from "@/components/ui/animated";
import { useAnimations, useInViewAnimations } from "@/hooks/useAnimations";
import { FacturasAsignadasView } from "@/components/dashboard/FacturasAsignadasView";
import { NominaCantera, CrearNominaRequest, AsignarChequeRequest, ActualizarTrackingRequest, TrackingEnvio, FacturaAsignada, AsignarChequeAFacturaRequest, FiltrosNominas } from "@/types/nominaCheque";
import { CrearChequeRequest } from "@/types/factura";
import { NuevaNominaModal } from "@/components/dashboard/NuevaNominaChequeModal";
import { AsignarChequeModal } from "@/components/dashboard/AsignarChequeModal";
import { AsignarChequeAFacturaModal } from "@/components/dashboard/AsignarChequeAFacturaModal";
import { TrackingEnvioComponent } from "@/components/dashboard/TrackingEnvio";
import { AsignarFacturasModal } from "@/components/dashboard/AsignarFacturasModal";
import Footer from "@/components/shared/Footer";
import { formatearMontoPesos } from "@/utils/formatearMonto";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { locales } from "@/hooks/useAuthStatus";

export default function NominasPage() {
  const theme = useTheme();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStatus();

  // Animaciones sutiles y profesionales
  const headerAnimation = useAnimations({ preset: 'fade', delay: 0.1 });
  const filtersAnimation = useAnimations({ preset: 'fade', delay: 0.2 });
  const contentAnimation = useAnimations({ preset: 'fade', delay: 0.3 });
  const footerAnimation = useInViewAnimations({ threshold: 0.1 });

  const {
    nominas,
    loading,
    error,
    crearNomina,
    asignarCheque,
    asignarChequeAFactura,
    crearYAsignarChequeAFactura,
    selectedNomina,
    loadNomina,
    setSelectedNomina,
    actualizarTracking,
    crearTracking,
    aplicarFiltros,
    limpiarFiltros,
    pagination,
    cambiarPagina,
    cambiarLimite,
  } = useNominasCheque();

  const { data: usuarios, isLoading: isLoadingUsuarios } = useUsuarios();

  const [modalNuevaNominaOpen, setModalNuevaNominaOpen] = useState(false);
  const [modalAsignarOpen, setModalAsignarOpen] = useState(false);
  const [modalAsignarFacturasOpen, setModalAsignarFacturasOpen] = useState(false);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [modalAsignarChequeAFacturaOpen, setModalAsignarChequeAFacturaOpen] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<FacturaAsignada | null>(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info">("success");

  // Estados para filtros
  const [filtroLocal, setFiltroLocal] = useState<number | null>(null);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");

  // Aplicar filtros cuando cambien
  const handleAplicarFiltros = useCallback(() => {
    const filtros: FiltrosNominas = {};
    

    
    if (filtroLocal) {
      // Enviar el ID numérico del local al backend
      filtros.local = filtroLocal.toString();

    } else {

    }
    
    if (filtroEstado) filtros.estado = filtroEstado;
    if (filtroUsuario) filtros.usuario = filtroUsuario;
    if (filtroTipo) filtros.nombre = filtroTipo;
    

    
    // Siempre aplicar filtros, incluso si no hay filtros seleccionados
    // Esto mantiene el estado consistente para la paginación
    aplicarFiltros(filtros);
  }, [filtroLocal, filtroEstado, filtroUsuario, filtroTipo, aplicarFiltros]);

  const handleLimpiarFiltros = useCallback(() => {
    setFiltroLocal(null);
    setFiltroEstado("");
    setFiltroUsuario("");
    setFiltroTipo("");
    limpiarFiltros();
  }, [limpiarFiltros]);

  // No necesitamos useEffect para filtro automático

  const handleAsignarFacturasSuccess = useCallback(() => {
    setSnackbarMessage("Facturas asignadas correctamente");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    if (selectedNomina?.id) {
      loadNomina(selectedNomina.id);
    }
  }, [selectedNomina?.id, loadNomina]);

  const handleAsignarChequeAFactura = useCallback(async (nominaId: string, facturaId: number, request: AsignarChequeAFacturaRequest) => {
    try {
      await asignarChequeAFactura(nominaId, facturaId, request);
      setSnackbarMessage("Cheque asignado a factura correctamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setModalAsignarChequeAFacturaOpen(false);
      setFacturaSeleccionada(null);
      
      // Recargar la nómina para actualizar la UI
      if (selectedNomina?.id) {
        await loadNomina(selectedNomina.id);
      }
    } catch (err) {
      console.error("Error asignando cheque a factura:", err);
      setSnackbarMessage("Error al asignar cheque a factura");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [asignarChequeAFactura, selectedNomina?.id, loadNomina]);

  const handleCrearYAsignarChequeAFactura = useCallback(async (nominaId: string, facturaId: number, request: CrearChequeRequest) => {
    try {
      await crearYAsignarChequeAFactura(nominaId, facturaId, request);
      setSnackbarMessage("Cheque creado y asignado a factura correctamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setModalAsignarChequeAFacturaOpen(false);
      setFacturaSeleccionada(null);
      
      // Recargar la nómina para actualizar la UI
      if (selectedNomina?.id) {
        await loadNomina(selectedNomina.id);
      }
    } catch (err) {
      console.error("Error creando y asignando cheque a factura:", err);
      setSnackbarMessage("Error al crear y asignar cheque a factura");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [crearYAsignarChequeAFactura, selectedNomina?.id, loadNomina]);



  const handleCloseDetalleModal = useCallback(() => {
    setModalDetalleOpen(false);
    // Recargar la página para mostrar datos actualizados
    if (selectedNomina?.id) {
      // Pequeño delay para asegurar que los cambios se hayan procesado
      setTimeout(() => {
        // Recargar la página de manera elegante
        router.refresh();
      }, 100);
    }
  }, [selectedNomina?.id, router]);

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

  const handleCrearNomina = async (request: CrearNominaRequest) => {
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

  const handleAsignarCheque = async (request: AsignarChequeRequest) => {
    try {
      await asignarCheque(selectedNomina!.id, request);
      setSnackbarMessage("Cheque asignado exitosamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err instanceof Error ? err.message : "Error al asignar cheque");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleUpdateTracking = async (trackingData: ActualizarTrackingRequest) => {
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

  const handleViewNomina = async (nomina: NominaCantera) => {
    try {
      setLoadingModal(true);
      setModalDetalleOpen(true);
      
      // Cargar nómina completa con todos los cheques
      const nominaCompleta = await loadNomina(nomina.id);
      setSelectedNomina(nominaCompleta);
    } catch (err) {
      setSnackbarMessage(err instanceof Error ? err.message : "Error al cargar nómina");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setModalDetalleOpen(false);
    } finally {
      setLoadingModal(false);
    }
  };

  const handleAsignarChequeClick = () => {
    if (selectedNomina) {
      setModalAsignarOpen(true);
    }
  };

  const handleAsignarFacturasClick = () => {
    if (!selectedNomina) {
      setSnackbarMessage("Debes seleccionar una nómina primero");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    setModalAsignarFacturasOpen(true);
  };

  const getEstadoColor = (estado: string): "warning" | "success" | "error" | "default" => {
    switch (estado) {
      case "pendiente":
        return "warning";
      case "pagada":
      case "recibida":
        return "success";
      case "enviada":
        return "default";
      case "vencida":
      case "cancelada":
        return "error";
      default:
        return "default";
    }
  };

  const getTrackingText = (tracking: TrackingEnvio | undefined): string => {
    if (!tracking) return "Sin tracking";
    
    switch (tracking.estado) {
      case "EN_ORIGEN":
        return "En origen";
      case "EN_TRANSITO":
        return "En tránsito";
      case "RECIBIDA":
        return "Recibida";
      default:
        return "Sin tracking";
    }
  };

  const getLocalNombre = (localId: string) => {
    return locales.find(l => l.id.toString() === localId)?.nombre || localId;
  };

  // Usar las nóminas directamente del hook (ya filtradas por el backend)
  const nominasFiltradas = nominas;

  return (
    <Container maxWidth="xl" sx={{ py: 4, mt: 9 }}>
      <Stack spacing={4}>
        {/* Header */}
        <AnimatedBox 
          {...headerAnimation}
          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}
        >
          <Box>
            <AnimatedTypography 
              {...headerAnimation}
              variant="h4" 
              fontWeight={700} 
              sx={{ 
                color: "text.primary", 
                mb: 1,
                fontWeight: 600
              }}
            >
              Gestión de Nóminas
            </AnimatedTypography>
            <AnimatedTypography 
              {...headerAnimation}
              variant="body1" 
              sx={{ color: "text.secondary" }}
            >
              Administra y rastrea las nóminas de cheques
            </AnimatedTypography>
          </Box>
          <AnimatedButton
            {...headerAnimation}
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalNuevaNominaOpen(true)}
            sx={{
              bgcolor: "text.primary",
              color: "background.paper",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
              py: 1.5,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "text.primary",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            Nueva Nómina
          </AnimatedButton>
        </AnimatedBox>

        {/* Filtros */}
        <AnimatedPaper
          {...filtersAnimation}
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderRadius: "12px",
            border: `1px solid ${theme.palette.divider}`,
            p: 3,
          }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "text.primary" }}>
            Filtros
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }, gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Local</InputLabel>
              <Select
                value={filtroLocal ?? ""}
                label="Local"
                onChange={(e) => {
                  const value = (e.target as HTMLInputElement).value as unknown;
                  const selectedId = value === "" ? null : Number(value);

                  setFiltroLocal(selectedId);
                  // Construir filtros con el valor seleccionado (evita usar estado aún no actualizado)
                  const filtrosInmediatos: FiltrosNominas = {};
                  if (selectedId !== null) filtrosInmediatos.local = String(selectedId);
                  if (filtroEstado) filtrosInmediatos.estado = filtroEstado;
                  if (filtroUsuario) filtrosInmediatos.usuario = filtroUsuario;
                  if (filtroTipo) filtrosInmediatos.nombre = filtroTipo;
                  aplicarFiltros(filtrosInmediatos);
                }}
              >
                <MenuItem value="">Todos los locales</MenuItem>
                {locales.map((local) => {

                  return (
                    <MenuItem key={local.id} value={local.id}>
                      {local.nombre}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                disabled
                value={filtroEstado}
                label="Estado"
                onChange={(e) => {
                  setFiltroEstado(e.target.value);
                  // Aplicar filtro automáticamente
                  setTimeout(() => handleAplicarFiltros(), 100);
                }}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="pendiente">Pendiente</MenuItem>
                <MenuItem value="enviada">En tránsito</MenuItem>
                <MenuItem value="recibida">Recibida</MenuItem>
              </Select>
            </FormControl>
            <Autocomplete
              disabled
              disablePortal
              options={usuarios || []}
              getOptionLabel={(option) => option.nombre}
              value={usuarios?.find(u => u.nombre === filtroUsuario) || null}
              onChange={(event, newValue) => {
                setFiltroUsuario(newValue ? newValue.nombre : "");
                // Aplicar filtro automáticamente
                setTimeout(() => handleAplicarFiltros(), 100);
              }}
              loading={isLoadingUsuarios}
              fullWidth
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Usuario"
                  placeholder="Buscar por usuario..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingUsuarios ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              noOptionsText="No se encontraron usuarios"
              loadingText="Cargando usuarios..."
              clearOnBlur
              clearOnEscape
            />
                           <FormControl fullWidth size="small">
                 <InputLabel>Tipo de Nómina</InputLabel>
                 <Select
                   disabled
                   value={filtroTipo}
                   label="Tipo de Nómina"
                   onChange={(e) => {
                     setFiltroTipo(e.target.value);
                     // Aplicar filtro automáticamente
                     setTimeout(() => handleAplicarFiltros(), 100);
                   }}
                 >
                   <MenuItem value="">Todos los tipos</MenuItem>
                   <MenuItem value="cheques">Cheques</MenuItem>
                   <MenuItem value="mixta">Por Pagar</MenuItem>
                 </Select>
               </FormControl>
            <Button
              variant="outlined"
              onClick={handleLimpiarFiltros}
              fullWidth
              sx={{ height: 40 }}
            >
              Limpiar Filtros
            </Button>
          </Box>
        </AnimatedPaper>

        {/* Content */}
        <AnimatedPaper
          {...contentAnimation}
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderRadius: "12px",
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
          }}
        >
          {loading ? (
            <Box sx={{ p: 8, textAlign: "center" }}>
              <CircularProgress size={40} />
              <Typography variant="body1" sx={{ color: "text.secondary", mt: 2 }}>
                Cargando nóminas...
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{ p: 4 }}>
              <Alert severity="error" sx={{ borderRadius: "8px" }}>
                {error}
              </Alert>
            </Box>
          ) : nominasFiltradas.length === 0 ? (
            <Box sx={{ p: 8, textAlign: "center" }}>
              <Typography variant="h6" sx={{ color: "text.secondary", mb: 2 }}>
                {nominas.length === 0 ? "No hay nóminas creadas" : "No se encontraron nóminas con los filtros aplicados"}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                {nominas.length === 0 ? "Comienza creando tu primera nómina para gestionar los cheques" : "Intenta con otros filtros"}
              </Typography>
              {nominas.length === 0 && (
                <Button
                  variant="outlined"
                  onClick={() => setModalNuevaNominaOpen(true)}
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
                  Crear Primera Nómina
                </Button>
              )}
            </Box>
          ) : (
                         <TableContainer>
               <Table>
                 <TableHead>
                   <TableRow sx={{ bgcolor: "background.default" }}>
                     <TableCell sx={{ fontWeight: 600 }}>Número</TableCell>
                     <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                     <TableCell sx={{ fontWeight: 600 }}>Local</TableCell>
                     <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                     <TableCell sx={{ fontWeight: 600 }}>Monto</TableCell>
                     <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                     <TableCell sx={{ fontWeight: 600 }}>Creado por</TableCell>
                     <TableCell sx={{ fontWeight: 600 }}>Tracking</TableCell>
                     <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {nominasFiltradas.map((nomina) => (
                     <TableRow
                       key={nomina.id}
                       sx={{
                         cursor: "pointer",
                         "&:hover": {
                           bgcolor: "background.default",
                         },
                       }}
                       onClick={() => handleViewNomina(nomina)}
                     >
                       <TableCell>
                         <Typography variant="body2" fontWeight={600}>
                           {nomina.numeroNomina}
                         </Typography>
                       </TableCell>
                       <TableCell>
                         {new Date(nomina.fechaEmision).toLocaleDateString('es-CL')}
                       </TableCell>
                       <TableCell>
                         {getLocalNombre(nomina.local)}
                       </TableCell>
                       <TableCell>
                         <Chip
                           label={nomina.tipoNomina === 'mixta' ? 'por pagar' : nomina.tipoNomina}
                           color={nomina.tipoNomina === 'mixta' ? 'primary' : 
                                  nomina.tipoNomina === 'facturas' ? 'secondary' : 'default'}
                           size="small"
                           sx={{ 
                             fontWeight: 600,
                             borderRadius: "8px",
                             textTransform: "capitalize"
                           }}
                         />
                       </TableCell>
                       <TableCell>
                         <Typography variant="body2" fontWeight={600}>
                           {formatearMontoPesos(nomina.montoTotal)}
                         </Typography>
                       </TableCell>
                       <TableCell>
                         <Chip
                           label={nomina.estado}
                           color={getEstadoColor(nomina.estado)}
                           size="small"
                           sx={{ 
                             fontWeight: 600,
                             borderRadius: "8px",
                             textTransform: "capitalize"
                           }}
                         />
                       </TableCell>
                       <TableCell>
                         {nomina.nombreUsuario}
                       </TableCell>
                       <TableCell>
                         {nomina.trackingEnvio ? (
                           <Chip
                             label={getTrackingText(nomina.trackingEnvio)}
                             size="small"
                             sx={{
                               bgcolor: nomina.trackingEnvio.estado === "EN_ORIGEN" ? theme.palette.grey[200] :
                                       nomina.trackingEnvio.estado === "EN_TRANSITO" ? theme.palette.warning.light :
                                       theme.palette.info.light,
                               color: nomina.trackingEnvio.estado === "EN_ORIGEN" ? theme.palette.text.secondary :
                                      nomina.trackingEnvio.estado === "EN_TRANSITO" ? theme.palette.warning.dark :
                                      theme.palette.info.dark,
                               fontWeight: 600,
                               borderRadius: "6px",
                             }}
                           />
                         ) : (
                           <Typography variant="body2" sx={{ color: "text.secondary" }}>
                             Sin tracking
                           </Typography>
                         )}
                       </TableCell>
                       <TableCell>
                         <Button
                           variant="outlined"
                           size="small"
                           onClick={(e) => {
                             e.stopPropagation();
                             handleViewNomina(nomina);
                           }}
                           sx={{
                             borderColor: theme.palette.divider,
                             color: theme.palette.text.primary,
                             textTransform: "none",
                             fontWeight: 600,
                             borderRadius: "8px",
                             "&:hover": {
                               borderColor: theme.palette.primary.main,
                               bgcolor: theme.palette.primary.light,
                               color: theme.palette.primary.contrastText,
                             },
                           }}
                         >
                           Ver Detalles
                         </Button>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
               <TablePagination
                 component="div"
                 count={pagination.total}
                 page={pagination.page - 1}
                 onPageChange={(event, newPage) => cambiarPagina(newPage + 1)}
                 rowsPerPage={pagination.limit}
                 onRowsPerPageChange={(event) => cambiarLimite(parseInt(event.target.value, 10))}
                 rowsPerPageOptions={[5, 10, 25, 50]}
                 labelRowsPerPage="Filas por página:"
                 labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
               />
             </TableContainer>
          )}
        </AnimatedPaper>
      </Stack>

      {/* Modals */}
      <NuevaNominaModal
        open={modalNuevaNominaOpen}
        onClose={() => setModalNuevaNominaOpen(false)}
        onSubmit={handleCrearNomina}
        loading={loading}
      />

      <AsignarChequeModal
        open={modalAsignarOpen}
        onClose={() => setModalAsignarOpen(false)}
        onAsignar={handleAsignarCheque}
      />

      {/* Detail Modal */}
      <Dialog
        open={modalDetalleOpen}
        onClose={handleCloseDetalleModal}
        maxWidth="lg"
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
                {selectedNomina?.numeroNomina}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Detalle de la nómina
              </Typography>
            </Box>
            <Chip
              label={selectedNomina?.estado}
              color={getEstadoColor(selectedNomina?.estado || "pendiente")}
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
          {loadingModal ? (
            <Box sx={{ p: 8, textAlign: "center" }}>
              <CircularProgress size={40} />
              <Typography variant="body1" sx={{ color: "text.secondary", mt: 2 }}>
                Cargando detalles...
              </Typography>
            </Box>
          ) : selectedNomina ? (
            <Box sx={{ p: 0 }}>
              {/* Información general */}
                             <Box sx={{ p: 4, borderBottom: `1px solid ${theme.palette.divider}` }}>
                 <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }, gap: 3 }}>
                   <Box>
                     <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                       Número de Nómina
                     </Typography>
                     <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500, mt: 0.5 }}>
                       {selectedNomina.numeroNomina}
                     </Typography>
                   </Box>
                   <Box>
                     <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                       Fecha de Emisión
                     </Typography>
                     <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500, mt: 0.5 }}>
                       {new Date(selectedNomina.fechaEmision).toLocaleDateString()}
                     </Typography>
                   </Box>
                   <Box>
                     <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                       Local
                     </Typography>
                     <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500, mt: 0.5 }}>
                       {getLocalNombre(selectedNomina.local)}
                     </Typography>
                   </Box>
                   <Box>
                     <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                       Creado por
                     </Typography>
                     <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500, mt: 0.5 }}>
                       {selectedNomina.nombreUsuario}
                     </Typography>
                   </Box>
                   <Box>
                     <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                       Monto Total
                     </Typography>
                     <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 700, mt: 0.5 }}>
                       {formatearMontoPesos(selectedNomina.montoTotal)}
                     </Typography>
                   </Box>
                   <Box>
                     <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                       Cheques Asignados
                     </Typography>
                     <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500, mt: 0.5 }}>
                       {selectedNomina.cheques?.length || 0} cheques
                     </Typography>
                   </Box>
                 </Box>
               </Box>

                 {/* Tracking Component */}
                 {selectedNomina.trackingEnvio ? (
                   <Box sx={{ p: 4, borderBottom: `1px solid ${theme.palette.divider}` }}>
                     <TrackingEnvioComponent
                       tracking={selectedNomina.trackingEnvio}
                       onUpdateTracking={handleUpdateTracking}
                     />
                   </Box>
                 ) : (
                   <Box sx={{ p: 4, borderBottom: `1px solid ${theme.palette.divider}` }}>
                     <Box sx={{ 
                       p: 4, 
                       textAlign: "center", 
                       bgcolor: "background.default", 
                       borderRadius: "12px",
                       border: `2px dashed ${theme.palette.divider}`
                     }}>
                       <Typography variant="h6" sx={{ color: "text.secondary", mb: 1, fontWeight: 600 }}>
                         No hay tracking configurado
                       </Typography>
                       <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                         Esta nómina no tiene un seguimiento de envío configurado. 
                         El tracking se crea automáticamente al crear la nómina.
                       </Typography>
                       <Button
                         variant="outlined"
                         size="small"
                         onClick={async () => {
                           if (selectedNomina) {
                             try {
                               await crearTracking(selectedNomina.id);
                               setSnackbarMessage("Tracking creado exitosamente");
                               setSnackbarSeverity("success");
                               setSnackbarOpen(true);
                             } catch (err) {
                               setSnackbarMessage(err instanceof Error ? err.message : "Error al crear tracking");
                               setSnackbarSeverity("error");
                               setSnackbarOpen(true);
                             }
                           }
                         }}
                         sx={{
                           borderColor: theme.palette.divider,
                           color: theme.palette.text.secondary,
                           textTransform: "none",
                           fontWeight: 500,
                           "&:hover": {
                             borderColor: theme.palette.primary.main,
                             color: theme.palette.primary.main,
                           },
                         }}
                       >
                         Crear Tracking
                       </Button>
                     </Box>
                   </Box>
                 )}

                 {/* Vista unificada de Facturas Asignadas */}
                 <Box sx={{ p: 4 }}>
                   <FacturasAsignadasView
                     facturas={selectedNomina.facturas || []}
                     onFacturaClick={(factura) => {
                       setFacturaSeleccionada(factura);
                       setModalAsignarChequeAFacturaOpen(true);
                     }}
                   />
                 </Box>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: "background.default"
        }}>
          <Button
            variant="outlined"
            onClick={handleAsignarChequeClick}
            disabled={loadingModal}
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
            Asignar Cheque
          </Button>
          <Button
            variant="outlined"
            startIcon={<AssignmentIcon />}
            onClick={handleAsignarFacturasClick}
            disabled={loadingModal}
            sx={{
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
              "&:hover": {
                borderColor: theme.palette.secondary.main,
                bgcolor: theme.palette.secondary.light,
                color: theme.palette.secondary.contrastText,
              },
            }}
          >
            Asignar Facturas
          </Button>
          <Button 
            onClick={handleCloseDetalleModal}
            disabled={loadingModal}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Asignar Facturas */}
      <AsignarFacturasModal
        open={modalAsignarFacturasOpen}
        onClose={() => setModalAsignarFacturasOpen(false)}
        nominaId={selectedNomina?.id || ''}
        onSuccess={handleAsignarFacturasSuccess}
      />

      {/* Modal Asignar Cheque a Factura */}
      <AsignarChequeAFacturaModal
        open={modalAsignarChequeAFacturaOpen}
        onClose={() => {
          setModalAsignarChequeAFacturaOpen(false);
          setFacturaSeleccionada(null);
        }}
        onAsignar={handleAsignarChequeAFactura}
        onCrearYAsignar={handleCrearYAsignarChequeAFactura}
        factura={facturaSeleccionada}
        nominaId={selectedNomina?.id || ''}
      />

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
          sx={{
            width: "100%",
            borderRadius: "8px",
            border: `1px solid ${snackbarSeverity === "success" ? theme.palette.success.light : theme.palette.error.light}`,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <AnimatedBox {...footerAnimation}>
        <Footer />
      </AnimatedBox>
    </Container>
  );
}
