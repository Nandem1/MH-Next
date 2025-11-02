"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Container,
  Typography,
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
  useTheme,
  TablePagination,
  Button,
  Backdrop,
} from "@mui/material";
import { useNominasGastos } from "@/hooks/useNominasGastos";
import { useUsuarios } from "@/hooks/useUsuarios";
import { AnimatedBox, AnimatedPaper, AnimatedTypography } from "@/components/ui/animated";
import { useAnimations, useInViewAnimations } from "@/hooks/useAnimations";
import { NominaGasto } from "@/types/nominasGastos";
import Footer from "@/components/shared/Footer";
import { formatearMontoPesos } from "@/utils/formatearMonto";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { NominaGastoMenuActions } from "@/components/nominas/NominaGastoMenuActions";
import { usePrintNominaGasto } from "@/hooks/usePrintNominaGasto";
import { EstadisticasSection } from "@/components/dashboard/EstadisticasSection";
import { FiltrosNominasGastos } from "@/components/dashboard/FiltrosNominasGastos";

export default function CajaChicaPage() {
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
    estadisticas,
    estadisticasActivas,
    pagination,
    loadNominas,
    loadNominaDetalle,
    loadEstadisticas,
    aplicarFiltros,
    limpiarFiltros,
    cambiarPagina,
    cambiarLimite,
  } = useNominasGastos();

  const { data: usuarios, isLoading: isLoadingUsuarios } = useUsuarios();
  const { printNominaGasto, loading: printLoading } = usePrintNominaGasto();

  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [selectedNomina, setSelectedNomina] = useState<NominaGasto | null>(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info">("success");

  // Estados para filtros
  const [filtroLocal, setFiltroLocal] = useState<number | null>(null);
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [tipoEstadisticas, setTipoEstadisticas] = useState<'historicas' | 'activas'>('historicas');
  const [loadingEstadisticas, setLoadingEstadisticas] = useState(false);

  // Manejar cambio de tipo de estadísticas - Solo actualiza estadísticas, no recarga la tabla
  const handleTipoEstadisticasChange = useCallback(async (nuevoTipo: 'historicas' | 'activas') => {
    setTipoEstadisticas(nuevoTipo);
    setLoadingEstadisticas(true);
    try {
      // Solo cargar estadísticas, mantener la tabla sin cambios
      await loadEstadisticas(nuevoTipo);
    } finally {
      setLoadingEstadisticas(false);
    }
  }, [loadEstadisticas]);

  // Manejar cambio de filtro de local
  const handleFiltroLocalChange = useCallback((localId: number | null) => {
    setFiltroLocal(localId);
    
    const nuevosFiltros: Record<string, unknown> = {
      stats_tipo: tipoEstadisticas // Mantener el tipo de estadísticas actual
    };
    
    if (localId) {
      nuevosFiltros.local_id = localId;
    }
    if (filtroUsuario) {
      const usuario = usuarios?.find(u => u.nombre === filtroUsuario);
      if (usuario) {
        nuevosFiltros.usuario_id = usuario.id;
      }
    }
    
    aplicarFiltros(nuevosFiltros);
  }, [filtroUsuario, tipoEstadisticas, usuarios, aplicarFiltros]);

  // Manejar cambio de filtro de usuario
  const handleFiltroUsuarioChange = useCallback((nombreUsuario: string) => {
    setFiltroUsuario(nombreUsuario);
    
    const nuevosFiltros: Record<string, unknown> = {
      stats_tipo: tipoEstadisticas // Mantener el tipo de estadísticas actual
    };
    
    if (filtroLocal) {
      nuevosFiltros.local_id = filtroLocal;
    }
    if (nombreUsuario) {
      const usuario = usuarios?.find(u => u.nombre === nombreUsuario);
      if (usuario) {
        nuevosFiltros.usuario_id = usuario.id;
      }
    }
    
    aplicarFiltros(nuevosFiltros);
  }, [filtroLocal, tipoEstadisticas, usuarios, aplicarFiltros]);

  const handleLimpiarFiltros = useCallback(() => {
    setFiltroLocal(null);
    setFiltroUsuario("");
    setTipoEstadisticas('historicas'); // Resetear a históricas por defecto
    limpiarFiltros();
  }, [limpiarFiltros]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleViewNomina = async (nomina: NominaGasto) => {
    try {
      setLoadingModal(true);
      setModalDetalleOpen(true);
      
      // Cargar nómina completa con todos los gastos
      // Nota: El ID puede ser string (rendiciones activas) o number (nóminas generadas)
      const nominaCompleta = await loadNominaDetalle(nomina.id);
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

  const handleCloseDetalleModal = useCallback(() => {
    setModalDetalleOpen(false);
    setSelectedNomina(null);
  }, []);

  // Funciones para el menú de acciones
  const handleVerDetalles = (nomina: NominaGasto) => {
    handleViewNomina(nomina);
  };

  const handleImprimir = async (nomina: NominaGasto) => {
    try {
      await printNominaGasto(nomina, {
        formato: 'A4',
        orientacion: 'portrait',
        incluirLogo: true,
        incluirFirma: false
      });
    } catch (err) {
      setSnackbarMessage(err instanceof Error ? err.message : "Error al preparar impresión");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleEliminar = (nomina: NominaGasto) => {
    // TODO: Implementar funcionalidad de eliminación en otro sprint
    console.log("Eliminar nómina:", nomina);
  };

  // Helper functions - Deben estar antes de los returns
  const getEstadoColor = (estado: string): "warning" | "success" | "error" | "info" | "default" => {
    switch (estado) {
      case "activa":
        return "info";
      case "generada":
        return "warning";
      case "reembolsada":
        return "success";
      case "pendiente":
        return "error";
      default:
        return "default";
    }
  };

  const getTipoLabel = (tipo: 'nomina_generada' | 'rendicion_activa'): string => {
    return tipo === 'rendicion_activa' ? 'Rendición Activa' : 'Nómina Generada';
  };

  const getTipoColor = (tipo: 'nomina_generada' | 'rendicion_activa'): "info" | "default" => {
    // Gris sutil para nómina generada, azul info para rendición activa
    return tipo === 'rendicion_activa' ? "info" : "default";
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadNominas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirigir cuando no exista sesión
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

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
    return null;
  }



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
              Caja Chica - Nóminas de Gastos
            </AnimatedTypography>
            <AnimatedTypography 
              {...headerAnimation}
              variant="body1" 
              sx={{ color: "text.secondary" }}
            >
              Gestiona y visualiza las nóminas de gastos y rendiciones activas
            </AnimatedTypography>
          </Box>
        </AnimatedBox>

        {/* Estadísticas */}
        <EstadisticasSection
          tipoEstadisticas={tipoEstadisticas}
          onTipoEstadisticasChange={handleTipoEstadisticasChange}
          loading={loading}
          loadingEstadisticas={loadingEstadisticas}
          estadisticas={estadisticas}
          estadisticasActivas={estadisticasActivas}
          filtersAnimation={filtersAnimation}
        />

        {/* Filtros */}
        <FiltrosNominasGastos
          filtroLocal={filtroLocal}
          filtroUsuario={filtroUsuario}
          onFiltroLocalChange={handleFiltroLocalChange}
          onFiltroUsuarioChange={handleFiltroUsuarioChange}
          onLimpiarFiltros={handleLimpiarFiltros}
          usuarios={usuarios}
          isLoadingUsuarios={isLoadingUsuarios}
          filtersAnimation={filtersAnimation}
        />

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
                Cargando nóminas de gastos...
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{ p: 4 }}>
              <Alert severity="error" sx={{ borderRadius: "8px" }}>
                {error}
              </Alert>
            </Box>
          ) : nominas.length === 0 ? (
            <Box sx={{ p: 8, textAlign: "center" }}>
              <Typography variant="h6" sx={{ color: "text.secondary", mb: 2 }}>
                No se encontraron nóminas de gastos
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                Las nóminas se generan automáticamente al reiniciar ciclos de rendición
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "background.default" }}>
                    <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Usuario</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Monto Total</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Cantidad Gastos</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Fecha Creación</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Locales</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nominas.map((nomina) => (
                    <TableRow
                      key={nomina.id}
                      sx={{
                        "&:hover": {
                          bgcolor: "background.default",
                        },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          #{nomina.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getTipoLabel(nomina.tipo)}
                          color={getTipoColor(nomina.tipo)}
                          size="small"
                          variant={nomina.tipo === 'rendicion_activa' ? "filled" : "outlined"}
                          sx={{ 
                            fontWeight: 600,
                            borderRadius: "8px",
                            fontSize: "0.75rem"
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {nomina.nombre_usuario}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {formatearMontoPesos(nomina.monto_total_rendicion)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {nomina.cantidad_gastos} gastos
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
                        {new Date(nomina.fecha_creacion).toLocaleDateString('es-CL')}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {nomina.locales_afectados && nomina.locales_afectados.length > 0 ? (
                            <>
                              {nomina.locales_afectados.slice(0, 2).map((local) => (
                                <Chip
                                  key={local.local_id}
                                  label={local.nombre_local}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: "0.7rem" }}
                                />
                              ))}
                              {nomina.locales_afectados.length > 2 && (
                                <Chip
                                  label={`+${nomina.locales_afectados.length - 2}`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: "0.7rem" }}
                                />
                              )}
                            </>
                          ) : (
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                              Sin locales
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <NominaGastoMenuActions
                          nomina={nomina}
                          onVerDetalles={handleVerDetalles}
                          onImprimir={handleImprimir}
                          onEliminar={handleEliminar}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={pagination.total}
                page={pagination.pagina - 1}
                onPageChange={(event, newPage) => cambiarPagina(newPage + 1)}
                rowsPerPage={pagination.limite}
                onRowsPerPageChange={(event) => cambiarLimite(parseInt(event.target.value, 10))}
                rowsPerPageOptions={[10, 20, 50, 100]}
                labelRowsPerPage="Filas por página:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
              />
            </TableContainer>
          )}
        </AnimatedPaper>
      </Stack>

      {/* Modal de Detalle */}
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
                {selectedNomina?.tipo === 'rendicion_activa' ? 'Rendición Activa' : 'Nómina'} #{selectedNomina?.id}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {selectedNomina?.tipo === 'rendicion_activa' 
                  ? 'Detalle de la rendición activa' 
                  : 'Detalle de la nómina de gastos'}
              </Typography>
            </Box>
            {selectedNomina && (
              <Chip
                label={selectedNomina.estado}
                color={getEstadoColor(selectedNomina.estado)}
                size="small"
                sx={{ 
                  fontWeight: 600,
                  borderRadius: "8px",
                  textTransform: "capitalize"
                }}
              />
            )}
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
            <Box sx={{ p: 4 }}>
              {/* Información general */}
              <Box sx={{ mb: 4, p: 3, bgcolor: "background.default", borderRadius: "8px" }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Información General
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 3 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                      Tipo
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={getTipoLabel(selectedNomina.tipo)}
                        color={getTipoColor(selectedNomina.tipo)}
                        size="small"
                        variant={selectedNomina.tipo === 'rendicion_activa' ? "filled" : "outlined"}
                        sx={{ fontWeight: 600, borderRadius: "8px" }}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                      Usuario
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500, mt: 0.5 }}>
                      {selectedNomina.nombre_usuario}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                      Monto Total
                    </Typography>
                    <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 700, mt: 0.5 }}>
                      {formatearMontoPesos(selectedNomina.monto_total_rendicion)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                      Cantidad de Gastos
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500, mt: 0.5 }}>
                      {selectedNomina.cantidad_gastos} gastos
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                      Fecha de Creación
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500, mt: 0.5 }}>
                      {new Date(selectedNomina.fecha_creacion).toLocaleDateString('es-CL')}
                    </Typography>
                  </Box>
                  {/* Mostrar fecha_reembolso solo si no es null y es una nómina generada */}
                  {selectedNomina.tipo === 'nomina_generada' && (
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                        Fecha de Reembolso
                      </Typography>
                      <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500, mt: 0.5 }}>
                        {selectedNomina.fecha_reembolso ? new Date(selectedNomina.fecha_reembolso).toLocaleDateString('es-CL') : 'No reembolsada'}
                      </Typography>
                    </Box>
                  )}
                  {/* Mostrar fecha_reinicio_ciclo solo si no es null y es una nómina generada */}
                  {selectedNomina.tipo === 'nomina_generada' && selectedNomina.fecha_reinicio_ciclo && (
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                        Fecha de Reinicio de Ciclo
                      </Typography>
                      <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500, mt: 0.5 }}>
                        {new Date(selectedNomina.fecha_reinicio_ciclo).toLocaleDateString('es-CL')}
                      </Typography>
                    </Box>
                  )}
                  {/* Mostrar rendicion_id para rendiciones activas */}
                  {selectedNomina.tipo === 'rendicion_activa' && (
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                        ID Rendición
                      </Typography>
                      <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 500, mt: 0.5 }}>
                        {selectedNomina.rendicion_id}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Observaciones - Solo mostrar si existe */}
              {selectedNomina.observaciones && (
                <Box sx={{ mb: 4, p: 3, bgcolor: "background.default", borderRadius: "8px" }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Observaciones
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.primary" }}>
                    {selectedNomina.observaciones}
                  </Typography>
                </Box>
              )}

              {/* Observaciones de Reinicio - Solo para nóminas generadas */}
              {selectedNomina.tipo === 'nomina_generada' && selectedNomina.observaciones_reinicio && (
                <Box sx={{ mb: 4, p: 3, bgcolor: "background.default", borderRadius: "8px" }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Observaciones de Reinicio
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.primary" }}>
                    {selectedNomina.observaciones_reinicio}
                  </Typography>
                </Box>
              )}


              {/* Locales Afectados con Montos */}
              {selectedNomina.locales_afectados && selectedNomina.locales_afectados.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Locales Afectados
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 2 }}>
                    {selectedNomina.locales_afectados.map((local) => (
                      <Box
                        key={local.local_id}
                        sx={{
                          p: 2,
                          bgcolor: "background.default",
                          borderRadius: "8px",
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={600} sx={{ color: "text.primary", mb: 1 }}>
                          {local.nombre_local}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
                          Monto: {formatearMontoPesos(local.monto_local)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Gastos: {local.cantidad_gastos}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Gastos incluidos */}
              {selectedNomina.gastos_incluidos && selectedNomina.gastos_incluidos.length > 0 && (
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Gastos Incluidos
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Descripción</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Monto</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Local</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Cuenta Contable</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedNomina.gastos_incluidos.map((gasto) => (
                          <TableRow key={gasto.id}>
                            <TableCell>{gasto.descripcion}</TableCell>
                            <TableCell>{formatearMontoPesos(gasto.monto)}</TableCell>
                            <TableCell>{new Date(gasto.fecha).toLocaleDateString('es-CL')}</TableCell>
                            <TableCell>{gasto.local_nombre}</TableCell>
                            <TableCell>{gasto.cuenta_contable_nombre}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: "background.default"
        }}>
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

      {/* Backdrop de Loading para Impresión */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: 'column',
          gap: 2
        }}
        open={printLoading}
      >
        <CircularProgress color="inherit" size={60} />
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Procesando PDF...
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Preparando documento para impresión
        </Typography>
      </Backdrop>

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
