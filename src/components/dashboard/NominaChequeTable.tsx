"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Chip,
  Stack,
  Box,
  Collapse,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { NominaCantera } from "@/types/nominaCheque";
import { formatearMontoPesos } from "@/utils/formatearMonto";
import { locales } from "@/hooks/useAuthStatus";

interface NominaChequeTableProps {
  nominas: NominaCantera[];
  onViewNomina: (nomina: NominaCantera) => void;
  onAsignarCheque: (nominaId: string, chequeId: string) => void;
  onMarcarPagado: (nominaId: string, chequeId: string) => void;
}

export function NominaChequeTable({
  nominas,
  onViewNomina,
  onAsignarCheque,
  onMarcarPagado,
}: NominaChequeTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const theme = useTheme();

  const handleRowClick = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const isExpanded = (id: string) => expandedRows.has(id);

  const getChequeEstadoText = (estado: string) => {
    switch (estado) {
      case "DISPONIBLE":
        return "Disponible";
      case "ASIGNADO":
        return "Asignado";
      case "PAGADO":
        return "Pagado";
      default:
        return estado;
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
      case "ENTREGADA":
        return "Entregada";
      default:
        return estado;
    }
  };

  const getLocalNombre = (localId: string) => {
    return locales.find(l => l.id.toString() === localId)?.nombre || localId;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <TableContainer>
        <Table size="medium" aria-label="Tabla de nóminas de cheques">
          <TableHead>
            <TableRow sx={{ bgcolor: "background.default" }}>
              <TableCell align="center" sx={{ width: 50, borderBottom: `1px solid ${theme.palette.divider}` }}></TableCell>
              <TableCell align="center" sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 2 }}>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                  Nombre
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 2 }}>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                  Local
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 2 }}>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                  Correlativos
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 2 }}>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                  Estado
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 2 }}>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                  Tracking
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 2 }}>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                  Progreso
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 2 }}>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                  Creado por
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 2 }}>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                  Fecha
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 2 }}>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                  Acciones
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nominas.map((nomina) => (
              <>
                <TableRow
                  key={nomina.id}
                  hover
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    "&:not(:last-child)": {
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    },
                  }}
                  onClick={() => handleRowClick(nomina.id)}
                >
                  {/* Columna de expandir */}
                  <TableCell align="center" sx={{ width: 50 }}>
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(nomina.id);
                      }}
                      sx={{
                        color: theme.palette.text.secondary,
                        "&:hover": {
                          bgcolor: theme.palette.action.hover,
                        },
                      }}
                    >
                      {isExpanded(nomina.id) ? (
                        <ExpandLessIcon fontSize="small" />
                      ) : (
                        <ExpandMoreIcon fontSize="small" />
                      )}
                    </Button>
                  </TableCell>

                  <TableCell align="center" sx={{ py: 2 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.text.primary }}>
                      {nomina.nombre}
                    </Typography>
                  </TableCell>

                  <TableCell align="center" sx={{ py: 2 }}>
                    <Chip
                      label={getLocalNombre(nomina.local)}
                      size="small"
                      sx={{
                        bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
                        color: theme.palette.text.primary,
                        fontWeight: 500,
                        border: `1px solid ${theme.palette.divider}`,
                        "&:hover": {
                          bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
                        },
                      }}
                    />
                  </TableCell>

                  <TableCell align="center" sx={{ py: 2 }}>
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.text.primary }}>
                        {nomina.correlativoInicial} - {nomina.correlativoFinal}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        {nomina.totalCheques} cheques
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell align="center" sx={{ py: 2 }}>
                    <Chip
                      label={nomina.estado}
                      size="small"
                      sx={{
                        bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
                        color: theme.palette.text.primary,
                        fontWeight: 500,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    />
                  </TableCell>

                  <TableCell align="center" sx={{ py: 2 }}>
                    {nomina.trackingEnvio ? (
                      <Stack spacing={0.5} alignItems="center">
                        <Chip
                          label={getTrackingEstadoText(nomina.trackingEnvio.estado)}
                          size="small"
                          sx={{
                            bgcolor: nomina.trackingEnvio.estado === "EN_ORIGEN" ? theme.palette.grey[200] :
                                    nomina.trackingEnvio.estado === "EN_TRANSITO" ? theme.palette.warning.light :
                                    nomina.trackingEnvio.estado === "RECIBIDA" ? theme.palette.info.light : theme.palette.success.light,
                            color: nomina.trackingEnvio.estado === "EN_ORIGEN" ? theme.palette.text.secondary :
                                   nomina.trackingEnvio.estado === "EN_TRANSITO" ? theme.palette.warning.dark :
                                   nomina.trackingEnvio.estado === "RECIBIDA" ? theme.palette.info.dark : theme.palette.success.dark,
                            fontWeight: 500,
                            border: `1px solid ${nomina.trackingEnvio.estado === "EN_ORIGEN" ? theme.palette.divider :
                                           nomina.trackingEnvio.estado === "EN_TRANSITO" ? theme.palette.warning.main :
                                           nomina.trackingEnvio.estado === "RECIBIDA" ? theme.palette.info.main : theme.palette.success.main}`,
                          }}
                        />
                        {nomina.trackingEnvio.localDestino && (
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            → {getLocalNombre(nomina.trackingEnvio.localDestino)}
                          </Typography>
                        )}
                      </Stack>
                    ) : (
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Sin tracking
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell align="center" sx={{ py: 2 }}>
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.text.primary }}>
                        {nomina.chequesPagados || 0}/{nomina.totalCheques || 0}
                      </Typography>
                      <Box
                        sx={{
                          width: 60,
                          height: 4,
                          bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            width: `${((nomina.chequesPagados || 0) / (nomina.totalCheques || 1)) * 100}%`,
                            height: "100%",
                            bgcolor: theme.palette.success.main,
                          }}
                        />
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell align="center" sx={{ py: 2 }}>
                    <Typography variant="body2" noWrap sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                      {nomina.nombreUsuario}
                    </Typography>
                  </TableCell>

                  <TableCell align="center" sx={{ py: 2 }}>
                    <Typography variant="body2" noWrap sx={{ color: theme.palette.text.secondary }}>
                      {new Date(nomina.fechaCreacion || nomina.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>

                  {/* Acciones */}
                  <TableCell align="center" sx={{ py: 2 }}>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Ver detalles">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewNomina(nomina);
                          }}
                          sx={{
                            borderColor: theme.palette.divider,
                            color: theme.palette.text.primary,
                            textTransform: "none",
                            fontWeight: 500,
                            "&:hover": {
                              borderColor: theme.palette.text.primary,
                              bgcolor: theme.palette.action.hover,
                            },
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>

                {/* Row expandible con cheques */}
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={10}
                    sx={{ border: "none" }}
                  >
                    <Collapse
                      in={isExpanded(nomina.id)}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ p: 3, bgcolor: "background.default" }}>
                        <Typography
                          variant="h6"
                          sx={{ 
                            color: theme.palette.text.primary, 
                            fontWeight: 600, 
                            mb: 2,
                          }}
                        >
                          Cheques de la Nómina
                        </Typography>
                        
                        <Paper elevation={0} sx={{ bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}`, borderRadius: "8px" }}>
                          <Table size="small" aria-label="cheques de la nómina">
                            <TableHead>
                              <TableRow sx={{ bgcolor: "background.default" }}>
                                <TableCell align="center" sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.5 }}>
                                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                                    N° Cheque
                                  </Typography>
                                </TableCell>
                                <TableCell align="center" sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.5 }}>
                                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                                    Estado
                                  </Typography>
                                </TableCell>
                                <TableCell align="center" sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.5 }}>
                                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                                    Factura Asociada
                                  </Typography>
                                </TableCell>
                                <TableCell align="center" sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.5 }}>
                                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                                    Fecha Asignación
                                  </Typography>
                                </TableCell>
                                <TableCell align="center" sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.5 }}>
                                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                                    Fecha Pago
                                  </Typography>
                                </TableCell>
                                <TableCell align="center" sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 1.5 }}>
                                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                                    Acciones
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {nomina.cheques?.map((cheque, index) => (
                                <TableRow key={cheque.id || `cheque-${index}`} sx={{ 
                                  "&:not(:last-child)": {
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                  },
                                }}>
                                  <TableCell align="center" sx={{ py: 1.5 }}>
                                    <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.text.primary }}>
                                      #{cheque.numeroCorrelativo}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center" sx={{ py: 1.5 }}>
                                    <Chip
                                      label={getChequeEstadoText(cheque.estado || '')}
                                      size="small"
                                      sx={{
                                        bgcolor: (cheque.estado || '') === "DISPONIBLE" ? theme.palette.grey[200] :
                                                (cheque.estado || '') === "ASIGNADO" ? theme.palette.warning.light : theme.palette.success.light,
                                        color: (cheque.estado || '') === "DISPONIBLE" ? theme.palette.text.secondary :
                                               (cheque.estado || '') === "ASIGNADO" ? theme.palette.warning.dark : theme.palette.success.dark,
                                        fontWeight: 600,
                                        border: "1px solid",
                                        borderColor: (cheque.estado || '') === "DISPONIBLE" ? theme.palette.divider :
                                                   (cheque.estado || '') === "ASIGNADO" ? theme.palette.warning.main : theme.palette.success.main,
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center" sx={{ py: 1.5 }}>
                                    {cheque.facturaAsociada ? (
                                      <Stack spacing={0.5} alignItems="center">
                                        <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.text.primary }}>
                                          {cheque.facturaAsociada.folio}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                          {cheque.facturaAsociada.proveedor}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                                          ${formatearMontoPesos(cheque.facturaAsociada.monto)}
                                        </Typography>
                                      </Stack>
                                    ) : (
                                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                        Sin asignar
                                      </Typography>
                                    )}
                                  </TableCell>
                                  <TableCell align="center" sx={{ py: 1.5 }}>
                                    <Typography variant="body2" noWrap sx={{ color: theme.palette.text.secondary }}>
                                      {cheque.fechaAsignacion
                                        ? new Date(cheque.fechaAsignacion).toLocaleDateString()
                                        : "-"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center" sx={{ py: 1.5 }}>
                                    <Typography variant="body2" noWrap sx={{ color: theme.palette.text.secondary }}>
                                      {cheque.fechaPago
                                        ? new Date(cheque.fechaPago).toLocaleDateString()
                                        : "-"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center" sx={{ py: 1.5 }}>
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                      {(cheque.estado || '') === "DISPONIBLE" && (
                                        <Tooltip title="Asignar a factura">
                                          <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => onAsignarCheque(nomina.id, cheque.id || '')}
                                            sx={{
                                              borderColor: theme.palette.warning.main,
                                              color: theme.palette.warning.dark,
                                              textTransform: "none",
                                              fontWeight: 500,
                                              "&:hover": {
                                                borderColor: theme.palette.warning.dark,
                                                bgcolor: theme.palette.warning.light,
                                              },
                                            }}
                                          >
                                            <AssignmentIcon fontSize="small" />
                                          </Button>
                                        </Tooltip>
                                      )}
                                      {(cheque.estado || '') === "ASIGNADO" && (
                                        <Tooltip title="Marcar como pagado">
                                          <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => onMarcarPagado(nomina.id, cheque.id || '')}
                                            sx={{
                                              borderColor: theme.palette.success.main,
                                              color: theme.palette.success.dark,
                                              textTransform: "none",
                                              fontWeight: 500,
                                              "&:hover": {
                                                borderColor: theme.palette.success.dark,
                                                bgcolor: theme.palette.success.light,
                                              },
                                            }}
                                          >
                                            <CheckCircleIcon fontSize="small" />
                                          </Button>
                                        </Tooltip>
                                      )}
                                    </Stack>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Paper>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
} 