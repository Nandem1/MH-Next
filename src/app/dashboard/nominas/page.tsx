"use client";

import { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Paper,
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
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useNominasCheque } from "@/hooks/useNominasCheque";
import { useUsuarios } from "@/hooks/useUsuarios";
import { NominaCantera, CrearNominaRequest, AsignarChequeRequest, ActualizarTrackingRequest } from "@/types/nominaCheque";
import { NuevaNominaModal } from "@/components/dashboard/NuevaNominaChequeModal";
import { AsignarChequeModal } from "@/components/dashboard/AsignarChequeModal";
import { TrackingEnvioComponent } from "@/components/dashboard/TrackingEnvio";
import Footer from "@/components/shared/Footer";
import { formatearMontoPesos } from "@/utils/formatearMonto";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { locales } from "@/hooks/useAuthStatus";

export default function NominasPage() {
  const theme = useTheme();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStatus();

  const {
    nominas,
    selectedNomina,
    loading,
    crearNomina,
    asignarCheque,
    actualizarTracking,
    crearTracking,
    loadNomina,
    setSelectedNomina,
    error,
  } = useNominasCheque();

  const { data: usuarios, isLoading: isLoadingUsuarios } = useUsuarios();

  const [modalNuevaNominaOpen, setModalNuevaNominaOpen] = useState(false);
  const [modalAsignarOpen, setModalAsignarOpen] = useState(false);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  // Estados para filtros
  const [filtroLocal, setFiltroLocal] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");

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

  const getEstadoColor = (estado: string): "warning" | "success" | "error" | "default" => {
    switch (estado) {
      case "pendiente":
        return "warning";
      case "pagada":
        return "success";
      case "vencida":
        return "error";
      default:
        return "default";
    }
  };

  const getTrackingEstadoText = (estado: string) => {
    switch (estado) {
      case "EN_ORIGEN":
        return "En Origen";
      case "EN_TRANSITO":
        return "En Tránsito";
      case "RECIBIDA":
        return "Recibida";
      default:
        return estado;
    }
  };

  const getLocalNombre = (localId: string) => {
    return locales.find(l => l.id.toString() === localId)?.nombre || localId;
  };

  // Filtrar nóminas
  const nominasFiltradas = nominas.filter(nomina => {
    const cumpleLocal = !filtroLocal || getLocalNombre(nomina.local).toLowerCase().includes(filtroLocal.toLowerCase());
    const cumpleEstado = !filtroEstado || nomina.estado === filtroEstado;
    const cumpleUsuario = !filtroUsuario || nomina.creadoPor.toLowerCase().includes(filtroUsuario.toLowerCase());
    
    return cumpleLocal && cumpleEstado && cumpleUsuario;
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4, mt: 9 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: "text.primary", mb: 1 }}>
              Gestión de Nóminas
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Administra y rastrea las nóminas de cheques
            </Typography>
          </Box>
          <Button
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
          </Button>
        </Box>

        {/* Filtros */}
        <Paper
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
                value={filtroLocal}
                label="Local"
                onChange={(e) => setFiltroLocal(e.target.value)}
              >
                <MenuItem value="">Todos los locales</MenuItem>
                {locales.map((local) => (
                  <MenuItem key={local.id} value={local.nombre}>
                    {local.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={filtroEstado}
                label="Estado"
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="pendiente">Pendiente</MenuItem>
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="completado">Completado</MenuItem>
                <MenuItem value="cancelado">Cancelado</MenuItem>
              </Select>
            </FormControl>
            <Autocomplete
              disablePortal
              options={usuarios || []}
              getOptionLabel={(option) => option.nombre}
              value={usuarios?.find(u => u.nombre === filtroUsuario) || null}
              onChange={(event, newValue) => {
                setFiltroUsuario(newValue ? newValue.nombre : "");
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
            <Button
              variant="outlined"
              onClick={() => {
                setFiltroLocal("");
                setFiltroEstado("");
                setFiltroUsuario("");
              }}
              fullWidth
              sx={{ height: 40 }}
            >
              Limpiar Filtros
            </Button>
          </Box>
        </Paper>

        {/* Content */}
        <Paper
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
                        {nomina.creadoPor}
                      </TableCell>
                      <TableCell>
                        {nomina.trackingEnvio ? (
                          <Chip
                            label={getTrackingEstadoText(nomina.trackingEnvio.estado)}
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
            </TableContainer>
          )}
        </Paper>
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
        onClose={() => setModalDetalleOpen(false)}
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
                       {selectedNomina.creadoPor}
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

              {/* Cheques asignados */}
              <Box sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ color: "text.primary" }}>
                    Cheques Asignados
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {selectedNomina.cheques?.length || 0} cheques
                  </Typography>
                </Box>
                
                                 {selectedNomina.cheques && selectedNomina.cheques.length > 0 ? (
                   <Box sx={{ 
                     display: "grid", 
                     gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, 
                     gap: 2 
                   }}>
                    {selectedNomina.cheques
                      .sort((a, b) => {
                        // Ordenar por correlativo numérico si es posible, sino alfabéticamente
                        const correlativoA = parseInt(a.correlativo) || 0;
                        const correlativoB = parseInt(b.correlativo) || 0;
                        return correlativoA - correlativoB;
                      })
                      .map((cheque) => (
                      <Box
                        key={cheque.id}
                        sx={{
                          p: 3,
                          bgcolor: "background.default",
                          borderRadius: "12px",
                          border: `1px solid ${theme.palette.divider}`,
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            borderColor: theme.palette.primary.main,
                            bgcolor: "background.paper",
                          },
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                          <Typography variant="h6" fontWeight={600} sx={{ color: "text.primary" }}>
                            #{cheque.correlativo}
                          </Typography>
                          <Typography variant="h6" fontWeight={700} sx={{ color: "text.primary" }}>
                            {formatearMontoPesos(cheque.monto)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: 600 }}>
                              Monto Asignado
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
                              {formatearMontoPesos(cheque.montoAsignado)}
                            </Typography>
                          </Box>
                          
                          {cheque.facturaAsociada && (
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: 600 }}>
                                Factura
                              </Typography>
                              <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
                                {cheque.facturaAsociada.folio}
                              </Typography>
                            </Box>
                          )}
                          
                          {cheque.fechaAsignacion && (
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: 600 }}>
                                Fecha Asignación
                              </Typography>
                              <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
                                {new Date(cheque.fechaAsignacion).toLocaleDateString()}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ 
                    p: 4, 
                    textAlign: "center", 
                    bgcolor: "background.default", 
                    borderRadius: "12px",
                    border: `2px dashed ${theme.palette.divider}`
                  }}>
                    <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
                      No hay cheques asignados
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Asigna cheques para comenzar a procesar esta nómina
                    </Typography>
                  </Box>
                )}
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
            onClick={() => setModalDetalleOpen(false)}
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

      <Footer />
    </Container>
  );
}
