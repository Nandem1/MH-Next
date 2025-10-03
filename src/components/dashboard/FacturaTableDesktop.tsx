"use client";

import { Paper, Typography, IconButton, Box, CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Stack, Tooltip, Chip } from "@mui/material";
import { useTheme } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Factura } from "@/types/factura";
import { formatearRut } from "@/utils/formatearRut";
import { formatearMonto, getDiasRestantesText } from "@/utils/formatearMonto";
import { FacturaMenuActions } from "./FacturaMenuActions";

interface FacturaTableDesktopProps {
  facturas: Factura[];
  onView: (factura: Factura) => void;
  onEditarMonto: (factura: Factura) => void;
  onEditarPago: (factura: Factura) => void;
  onEditarFechaPago: (factura: Factura) => void;
  onEditarCamposBasicos: (factura: Factura) => void;
  onDelete?: (factura: Factura) => void;
}

export function FacturaTableDesktop({
  facturas,
  onView,
  onEditarMonto,
  onEditarPago,
  onEditarFechaPago,
  onEditarCamposBasicos,
  onDelete,
}: FacturaTableDesktopProps) {
  const theme = useTheme();

  const getPagoText = (factura: Factura) => {
    if (!factura.metodo_pago || factura.metodo_pago === "POR_PAGAR") {
      return "POR PAGAR";
    }
    
    // Para cheques, siempre mostrar solo "CHEQUE" - el correlativo se mostrará en un span separado
    if (factura.metodo_pago === "CHEQUE") {
      return "CHEQUE";
    }
    
    return factura.metodo_pago;
  };

  const getPagoColor = (metodoPago: string) => {
    switch (metodoPago) {
      case "POR_PAGAR":
        return "warning"; // Naranja vibrante - más llamativo
      case "CHEQUE":
        return "info"; // Azul eléctrico - moderno y confiable
      case "TRANSFERENCIA":
        return "success"; // Verde suave - sutil
      case "EFECTIVO":
        return "default"; // Gris elegante - discreto
      default:
        return "default";
    }
  };

  const getTrackingColor = (estado: string | null) => {
    switch (estado) {
      case "EN_ORIGEN":
        return "warning";
      case "EN_TRANSITO":
        return "info";
      case "RECIBIDA":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "100%",
        mt: 0,
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflowX: "auto",
      }}
    >
      <Table size="small" aria-label="Tabla de facturas">
        <TableHead>
          <TableRow>
            <TableCell align="center">Folio</TableCell>
            <TableCell align="center">Proveedor</TableCell>
            <TableCell align="center">Local</TableCell>
            <TableCell align="center">Nómina</TableCell>
            <TableCell align="center">Pagado con</TableCell>
            <TableCell align="center">Monto</TableCell>
            <TableCell align="center">Fecha Ingreso</TableCell>
            <TableCell align="center">Fecha Pago</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {facturas.map((factura) => (
            <TableRow key={factura.id} hover>
              <TableCell align="center">
                <Typography variant="caption" fontWeight={500} noWrap sx={{ fontSize: '0.75rem' }}>
                  {factura.folio}
                </Typography>
              </TableCell>

              {/* Proveedor + Rut */}
              <TableCell align="center">
                <Stack spacing={0.1} alignItems="center">
                  <Typography variant="caption" fontWeight={500} noWrap sx={{ fontSize: '0.75rem' }}>
                    {factura.proveedor}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    Rut: {formatearRut(factura.rut_proveedor || "")}
                  </Typography>
                </Stack>
              </TableCell>

              {/* Local + Usuario */}
              <TableCell align="center">
                <Stack spacing={0.1} alignItems="center">
                  <Typography variant="caption" fontWeight={500} noWrap sx={{ fontSize: '0.75rem' }}>
                    {factura.local}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {factura.nombre_usuario}
                  </Typography>
                </Stack>
              </TableCell>

              {/* Nómina + Estado de tracking */}
              <TableCell align="center">
                <Stack spacing={0.1} alignItems="center">
                  <Typography variant="caption" fontWeight={500} noWrap sx={{ fontSize: '0.75rem' }}>
                    {factura.nomina_numero || "No asignada"}
                  </Typography>
                  {factura.tracking_estado && (
                    <Chip
                      label={factura.tracking_estado.replace('_', ' ')}
                      color={getTrackingColor(factura.tracking_estado)}
                      variant="outlined"
                      size="small"
                      sx={{
                        fontSize: '0.7rem',
                        height: '18px',
                        '& .MuiChip-label': {
                          px: 0.8,
                          fontWeight: 500,
                        },
                                                 // Estilos especiales para estados de tracking con el mismo blur que Pagado con
                         ...(factura.tracking_estado === "EN_ORIGEN" && {
                           borderColor: '#757575',
                           color: '#757575',
                           backgroundColor: 'rgba(117, 117, 117, 0.08)',
                           '&:hover': {
                             backgroundColor: 'rgba(117, 117, 117, 0.12)',
                           },
                         }),
                        ...(factura.tracking_estado === "EN_TRANSITO" && {
                          borderColor: '#2196f3',
                          color: '#2196f3',
                          backgroundColor: 'rgba(33, 150, 243, 0.08)',
                          '&:hover': {
                            backgroundColor: 'rgba(33, 150, 243, 0.12)',
                          },
                        }),
                        ...(factura.tracking_estado === "RECIBIDA" && {
                          borderColor: '#4caf50',
                          color: '#4caf50',
                          backgroundColor: 'rgba(76, 175, 80, 0.08)',
                          '&:hover': {
                            backgroundColor: 'rgba(76, 175, 80, 0.12)',
                          },
                        }),
                      }}
                    />
                  )}
                </Stack>
              </TableCell>

              {/* PAGADO CON con diseño minimalista al estilo Vercel */}
              <TableCell align="center">
                <Box sx={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 0.3 }}>
                  {factura.isUpdating ? (
                    <CircularProgress size={16} />
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.3 }}>
                      <Chip
                        label={getPagoText(factura)}
                        color={getPagoColor(factura.metodo_pago || "POR_PAGAR")}
                        variant="outlined"
                        size="small"
                        sx={{
                          fontSize: '0.7rem',
                          height: '18px',
                          '& .MuiChip-label': {
                            px: 0.8,
                            fontWeight: 500,
                          },
                          // Estilos especiales para estados principales
                          ...(factura.metodo_pago === "POR_PAGAR" && {
                            borderColor: '#ff9800',
                            color: '#ff9800',
                            backgroundColor: 'rgba(255, 152, 0, 0.08)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 152, 0, 0.12)',
                            },
                          }),
                          ...(factura.metodo_pago === "CHEQUE" && {
                            borderColor: '#2196f3',
                            color: '#2196f3',
                            backgroundColor: 'rgba(33, 150, 243, 0.08)',
                            '&:hover': {
                              backgroundColor: 'rgba(33, 150, 243, 0.12)',
                            },
                          }),
                        }}
                      />
                                             {/* Mostrar número de cheque cuando el método de pago es CHEQUE */}
                       {factura.metodo_pago === "CHEQUE" && factura.cheque_correlativo && (
                         <Tooltip 
                           title={factura.cheque_monto ? `Monto: ${formatearMonto(factura.cheque_monto)}` : 'Monto no disponible'}
                           arrow
                           placement="bottom"
                         >
                           <Typography 
                             variant="caption" 
                             color="text.secondary" 
                             sx={{ 
                               fontWeight: 500, 
                               fontSize: '0.7rem'
                             }}
                           >
                             #{factura.cheque_correlativo}
                           </Typography>
                         </Tooltip>
                       )}
                    </Box>
                  )}
                  <Tooltip title="Editar método de pago">
                    <IconButton
                      size="small"
                      onClick={() => onEditarPago(factura)}
                      disabled={factura.isUpdating}
                      sx={{
                        position: "absolute",
                        right: -22,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 24,
                        height: 24,
                        color: theme.palette.primary.main,
                        "&:hover": {
                          bgcolor: theme.palette.primary.light,
                          color: theme.palette.primary.contrastText,
                        },
                        "& .MuiSvgIcon-root": {
                          fontSize: "0.875rem",
                        },
                      }}
                    >
                      <PaymentIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>

              {/* Monto con ícono de editar */}
              <TableCell align="center">
                <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {factura.isUpdating ? (
                    <CircularProgress size={16} />
                                     ) : (
                     <Typography variant="caption" fontWeight={500} noWrap sx={{ fontSize: '0.75rem' }}>
                       {formatearMonto(factura.monto)}
                     </Typography>
                   )}
                  <Tooltip title="Editar monto">
                    <IconButton
                      size="small"
                      onClick={() => onEditarMonto(factura)}
                      disabled={factura.isUpdating}
                      sx={{
                        position: "absolute",
                        right: -22,
                        top: "50%",
                        transform: "translateY(-50%)",
                        ml: 3,
                        width: 24,
                        height: 24,
                        color: theme.palette.primary.main,
                        "&:hover": {
                          bgcolor: theme.palette.primary.light,
                          color: theme.palette.primary.contrastText,
                        },
                        "& .MuiSvgIcon-root": {
                          fontSize: "0.875rem",
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>

                             <TableCell align="center">
                 <Typography variant="caption" noWrap sx={{ fontSize: '0.75rem' }}>
                   {new Date(factura.fechaIngreso).toLocaleDateString()}
                 </Typography>
               </TableCell>

                             {/* Fecha de pago con ícono de editar */}
               <TableCell align="center">
                 <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   {factura.isUpdating ? (
                     <CircularProgress size={16} />
                   ) : (
                                           <Stack spacing={0.1} alignItems="center">
                        <Typography variant="caption" fontWeight={500} noWrap sx={{ fontSize: '0.75rem' }}>
                          {factura.fecha_pago ? new Date(factura.fecha_pago).toLocaleDateString() : "No establecida"}
                        </Typography>
                                                {factura.fecha_pago && (
                           <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                             {getDiasRestantesText(factura.fecha_pago, factura.metodo_pago)}
                           </Typography>
                         )}
                      </Stack>
                   )}
                                       {!factura.fecha_pago && (
                      <Tooltip title="Editar fecha de pago">
                        <IconButton
                          size="small"
                          onClick={() => onEditarFechaPago(factura)}
                          disabled={factura.isUpdating}
                          sx={{
                            position: "absolute",
                            right: -22,
                            top: "50%",
                            transform: "translateY(-50%)",
                            ml: 3,
                            width: 24,
                            height: 24,
                            color: theme.palette.primary.main,
                            "&:hover": {
                              bgcolor: theme.palette.primary.light,
                              color: theme.palette.primary.contrastText,
                            },
                            "& .MuiSvgIcon-root": {
                              fontSize: "0.875rem",
                            },
                          }}
                        >
                          <CalendarTodayIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                 </Box>
               </TableCell>

                             {/* Acciones */}
               <TableCell align="center">
                 <FacturaMenuActions
                   factura={factura}
                   onView={onView}
                   onEditarCamposBasicos={onEditarCamposBasicos}
                   onDelete={onDelete}
                 />
               </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
