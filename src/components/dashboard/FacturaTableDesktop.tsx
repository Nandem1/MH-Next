"use client";

import { Paper, Button, Typography, IconButton, Box, CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Stack, Tooltip, Chip } from "@mui/material";
import { useTheme } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Factura } from "@/types/factura";
import { formatearRut } from "@/utils/formatearRut";
import { formatearMonto, getDiasRestantesText } from "@/utils/formatearMonto";

interface FacturaTableDesktopProps {
  facturas: Factura[];
  onView: (factura: Factura) => void;
  onEditarMonto: (factura: Factura) => void;
  onEditarPago: (factura: Factura) => void;
  onEditarFechaPago: (factura: Factura) => void;
}

export function FacturaTableDesktop({
  facturas,
  onView,
  onEditarMonto,
  onEditarPago,
  onEditarFechaPago,
}: FacturaTableDesktopProps) {
  const theme = useTheme();

  const getPagoText = (factura: Factura) => {
    if (!factura.metodo_pago || factura.metodo_pago === "POR_PAGAR") {
      return "POR PAGAR";
    }
    
    // Para cheques, siempre mostrar solo "Cheque" - el correlativo se mostrará en un span separado
    if (factura.metodo_pago === "CHEQUE") {
      return "Cheque";
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



  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "100%",
        mt: 2,
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
              <TableCell align="center">{factura.folio}</TableCell>

              {/* Proveedor + Rut */}
              <TableCell align="center">
                <Stack spacing={0.2} alignItems="center">
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {factura.proveedor}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rut: {formatearRut(factura.rut_proveedor || "")}
                  </Typography>
                </Stack>
              </TableCell>

              {/* Local + Usuario */}
              <TableCell align="center">
                <Stack spacing={0.2} alignItems="center">
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {factura.local}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Subido por: {factura.nombre_usuario}
                  </Typography>
                </Stack>
              </TableCell>

              {/* PAGADO CON con diseño minimalista al estilo Vercel */}
              <TableCell align="center">
                <Box sx={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                  {factura.isUpdating ? (
                    <CircularProgress size={16} />
                  ) : (
                    <>
                      <Chip
                        label={getPagoText(factura)}
                        color={getPagoColor(factura.metodo_pago || "POR_PAGAR")}
                        variant="outlined"
                        size="small"
                        sx={{
                          fontSize: '0.75rem',
                          height: '20px',
                          '& .MuiChip-label': {
                            px: 1,
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
                    </>
                  )}
                  <Tooltip title="Editar método de pago">
                    <IconButton
                      size="small"
                      onClick={() => onEditarPago(factura)}
                      disabled={factura.isUpdating}
                      sx={{
                        position: "absolute",
                        right: -12,
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
                    <Typography variant="body2" fontWeight={500} noWrap>
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
                        right: -12,
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
                <Typography variant="body2" noWrap>
                  {new Date(factura.fechaIngreso).toLocaleDateString()}
                </Typography>
              </TableCell>

                             {/* Fecha de pago con ícono de editar */}
               <TableCell align="center">
                 <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   {factura.isUpdating ? (
                     <CircularProgress size={16} />
                   ) : (
                     <Stack spacing={0.2} alignItems="center">
                       <Typography variant="body2" fontWeight={500} noWrap>
                         {factura.fecha_pago ? new Date(factura.fecha_pago).toLocaleDateString() : "No establecida"}
                       </Typography>
                                               {factura.fecha_pago && (
                          <Typography variant="caption" color="text.secondary">
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
                            right: -12,
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
                 <Button
                   variant="contained"
                   color="primary"
                   size="small"
                   onClick={() => onView(factura)}
                   aria-label="Ver factura"
                 >
                   Ver
                 </Button>
               </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
