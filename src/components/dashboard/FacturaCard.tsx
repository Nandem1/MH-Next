"use client";

import { Typography, Button, Box, Divider, IconButton, CircularProgress, Card, CardContent, Stack, Tooltip, useTheme, Chip } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Factura } from "@/types/factura";
import { formatearRut } from "@/utils/formatearRut";
import { formatearMonto, getDiasRestantesText } from "@/utils/formatearMonto";

interface FacturaCardProps {
  factura: Factura;
  onView: () => void;
  onEditarMonto: () => void;
  onEditarPago: () => void;
  onEditarFechaPago: () => void;
}

export function FacturaCard({
  factura,
  onView,
  onEditarMonto,
  onEditarPago,
  onEditarFechaPago,
}: FacturaCardProps) {
  const theme = useTheme();

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
    <Card
      sx={{
        width: "100%",
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "relative", height: 200, overflow: "hidden" }}>
        <OptimizedImage
          src={factura.image_url_cloudinary}
          alt={`Factura ${factura.folio}`}
          fill
          variant="card"
          lazy={true}
          quality={60}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{
            objectFit: "cover",
            aspectRatio: "4/3", // Aspect ratio fijo para evitar CLS
          }}
        />
      </Box>
      <CardContent sx={{ p: 2 }}>
        <Stack spacing={2}>
          {/* Header */}
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Folio: {factura.folio}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {factura.proveedor}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Rut: {formatearRut(factura.rut_proveedor || "")}
            </Typography>
          </Box>

          <Divider />

          {/* Información */}
          <Stack spacing={1}>
                         <Box display="flex" alignItems="center">
               <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                 Local:
               </Typography>
               <Typography variant="caption" fontWeight={500} sx={{ ml: 1, fontSize: '0.75rem' }}>
                 {factura.local}
               </Typography>
             </Box>

                         {/* Nómina + Estado of tracking */}
             <Box display="flex" alignItems="center">
               <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                 Nómina:
               </Typography>
               <Box sx={{ ml: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.1 }}>
                 <Typography variant="caption" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
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
              </Box>
            </Box>

                         {/* PAGADO CON con diseño minimalista */}
             <Box display="flex" alignItems="center">
               <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                 Pagado con:
               </Typography>
                             {factura.isUpdating ? (
                 <CircularProgress size={16} sx={{ ml: 1 }} />
               ) : (
                 <Box sx={{ ml: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.1 }}>
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
                     <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, alignSelf: "flex-start", fontSize: '0.7rem' }}>
                       #{factura.cheque_correlativo}
                     </Typography>
                   )}
                 </Box>
               )}
              <Tooltip title="Editar método de pago">
                <IconButton
                  size="small"
                  onClick={onEditarPago}
                  disabled={factura.isUpdating}
                  sx={{
                    ml: 1,
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

                         {/* Monto con ícono de editar */}
             <Box display="flex" alignItems="center">
               <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                 Monto:
               </Typography>
               {factura.isUpdating ? (
                 <CircularProgress size={16} sx={{ ml: 1 }} />
               ) : (
                 <Typography variant="caption" fontWeight={500} sx={{ ml: 1, fontSize: '0.75rem' }}>
                   {formatearMonto(factura.monto)}
                 </Typography>
               )}
              <Tooltip title="Editar monto">
                <IconButton
                  size="small"
                  onClick={onEditarMonto}
                  disabled={factura.isUpdating}
                  sx={{
                    ml: 1,
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

                         <Box display="flex" alignItems="center">
               <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                 Fecha:
               </Typography>
               <Typography variant="caption" fontWeight={500} sx={{ ml: 1, fontSize: '0.75rem' }}>
                 {new Date(factura.fechaIngreso).toLocaleDateString()}
               </Typography>
             </Box>

                                       {/* Fecha de pago con ícono de editar */}
              <Box display="flex" alignItems="center">
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Fecha de pago:
                </Typography>
                {factura.isUpdating ? (
                  <CircularProgress size={16} sx={{ ml: 1 }} />
                ) : (
                  <Typography variant="caption" fontWeight={500} sx={{ ml: 1, fontSize: '0.75rem' }}>
                    {factura.fecha_pago ? new Date(factura.fecha_pago).toLocaleDateString() : "No establecida"}
                  </Typography>
                )}
                               {!factura.fecha_pago && (
                  <Tooltip title="Editar fecha de pago">
                    <IconButton
                      size="small"
                      onClick={onEditarFechaPago}
                      disabled={factura.isUpdating}
                      sx={{
                        ml: 1,
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
                           {factura.fecha_pago && (
                <Box display="flex" alignItems="center">
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    Estado:
                  </Typography>
                                    <Typography variant="caption" fontWeight={500} sx={{ ml: 1, fontSize: '0.75rem' }}>
                     {getDiasRestantesText(factura.fecha_pago, factura.metodo_pago)}
                   </Typography>
                </Box>
              )}

                         <Box display="flex" alignItems="center">
               <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                 Subido por:
               </Typography>
               <Typography variant="caption" fontWeight={500} sx={{ ml: 1, fontSize: '0.75rem' }}>
                 {factura.nombre_usuario}
               </Typography>
             </Box>
          </Stack>

          <Divider />

                     {/* Acciones */}
           <Button
             variant="contained"
             color="primary"
             fullWidth
             onClick={onView}
             sx={{ textTransform: "none" }}
           >
             Ver Factura
           </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
