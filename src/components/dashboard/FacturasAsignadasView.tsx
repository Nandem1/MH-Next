import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  useTheme,
} from '@mui/material';
import {
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from '@mui/icons-material';
import { FacturaAsignada } from '@/types/nominaCheque';
import { formatearMontoPesos } from '@/utils/formatearMonto';

interface FacturasAsignadasViewProps {
  facturas: FacturaAsignada[];
  onFacturaClick: (factura: FacturaAsignada) => void;
}

export function FacturasAsignadasView({ facturas, onFacturaClick }: FacturasAsignadasViewProps) {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  if (!facturas || facturas.length === 0) {
    return (
             <Box sx={{ 
         p: 4, 
         textAlign: "center", 
         bgcolor: "background.default", 
         borderRadius: "12px",
         border: `2px dashed ${theme.palette.divider}`
       }}>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
          No hay facturas asignadas
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Puedes asignar facturas usando el botón &quot;Asignar Facturas&quot;.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header con botones de cambio de vista */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" fontWeight={600} sx={{ color: "text.primary" }}>
            Facturas Asignadas
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {facturas.length} facturas
          </Typography>
        </Box>
        
        {/* Botones de cambio de vista */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant={viewMode === 'cards' ? 'contained' : 'outlined'}
            size="small"
            startIcon={<ViewModuleIcon />}
            onClick={() => setViewMode('cards')}
            sx={{
              minWidth: 'auto',
              px: 2,
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
            }}
          >
            Tarjetas
          </Button>
          <Button
            variant={viewMode === 'table' ? 'contained' : 'outlined'}
            size="small"
            startIcon={<ViewListIcon />}
            onClick={() => setViewMode('table')}
            sx={{
              minWidth: 'auto',
              px: 2,
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
            }}
          >
            Tabla
          </Button>
        </Box>
      </Box>

      {/* Contenido según el modo de vista */}
             {viewMode === 'table' ? (
         // Vista de tabla
         <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
           <Table>
             <TableHead>
               <TableRow sx={{ bgcolor: 'background.default' }}>
                 <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Folio</TableCell>
                 <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Proveedor</TableCell>
                 <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Fecha Asignación</TableCell>
                 <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Estado Cheque</TableCell>
                 <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Correlativo Cheque</TableCell>
                 <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Monto</TableCell>
               </TableRow>
             </TableHead>
             <TableBody>
               {facturas
                 .sort((a, b) => a.folio.localeCompare(b.folio))
                 .map((factura) => {
                   const chequeAsociado = factura.cheque_asignado ? {
                     id: factura.cheque_asignado.id.toString(),
                     correlativo: factura.cheque_asignado.correlativo,
                     monto: typeof factura.cheque_asignado.monto === 'string' ? parseFloat(factura.cheque_asignado.monto) : factura.cheque_asignado.monto,
                     montoAsignado: typeof factura.cheque_asignado.monto === 'string' ? parseFloat(factura.cheque_asignado.monto) : factura.cheque_asignado.monto,
                     fechaAsignacion: factura.cheque_asignado.fecha_asignacion_cheque,
                     idUsuario: factura.cheque_asignado.id.toString(),
                     nombreUsuario: factura.cheque_asignado.nombre_usuario_cheque
                   } : null;

                   return (
                     <TableRow 
                       key={factura.id}
                       sx={{ 
                         '&:hover': { 
                           bgcolor: 'action.hover',
                           cursor: 'pointer'
                         } 
                       }}
                       onClick={() => onFacturaClick(factura)}
                     >
                       <TableCell sx={{ fontWeight: 500, color: 'text.primary' }}>
                         #{factura.folio}
                       </TableCell>
                       <TableCell sx={{ color: 'text.primary' }}>
                         {factura.proveedor}
                       </TableCell>
                       <TableCell sx={{ color: 'text.primary' }}>
                         {factura.fechaAsignacion ? new Date(factura.fechaAsignacion).toLocaleDateString() : '-'}
                       </TableCell>
                       <TableCell>
                         <Chip
                           label={chequeAsociado ? "Asignado" : "Sin Asignar"}
                           color={chequeAsociado ? "success" : "warning"}
                           size="small"
                           sx={{ 
                             fontWeight: 600,
                             borderRadius: "8px",
                             textTransform: "capitalize"
                           }}
                         />
                       </TableCell>
                       <TableCell sx={{ color: 'text.primary' }}>
                         {chequeAsociado ? chequeAsociado.correlativo : '-'}
                       </TableCell>
                       <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>
                         {formatearMontoPesos(factura.montoAsignado)}
                       </TableCell>
                     </TableRow>
                   );
                 })}
             </TableBody>
           </Table>
         </TableContainer>
      ) : (
        // Vista de tarjetas
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, 
          gap: 2 
        }}>
          {facturas
            .sort((a, b) => a.folio.localeCompare(b.folio))
            .map((factura) => {
              const chequeAsociado = factura.cheque_asignado ? {
                id: factura.cheque_asignado.id.toString(),
                correlativo: factura.cheque_asignado.correlativo,
                monto: typeof factura.cheque_asignado.monto === 'string' ? parseFloat(factura.cheque_asignado.monto) : factura.cheque_asignado.monto,
                montoAsignado: typeof factura.cheque_asignado.monto === 'string' ? parseFloat(factura.cheque_asignado.monto) : factura.cheque_asignado.monto,
                fechaAsignacion: factura.cheque_asignado.fecha_asignacion_cheque,
                idUsuario: factura.cheque_asignado.id.toString(),
                nombreUsuario: factura.cheque_asignado.nombre_usuario_cheque
              } : null;

              return (
                <Box
                  key={factura.id}
                                     sx={{
                     p: 3,
                     bgcolor: "background.default",
                     borderRadius: "12px",
                     border: `1px solid ${theme.palette.divider}`,
                     transition: "all 0.3s ease-in-out",
                     cursor: "pointer",
                     position: "relative",
                     overflow: "hidden",
                     "&:hover": {
                       borderColor: theme.palette.primary.main,
                       bgcolor: "background.paper",
                       transform: "translateY(-2px)",
                       boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                     },
                   }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget;
                    const content = target.querySelector('.factura-content') as HTMLElement;
                    const chequeContent = target.querySelector('.cheque-content') as HTMLElement;
                    if (content && chequeContent) {
                      content.style.opacity = '0';
                      chequeContent.style.opacity = '1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget;
                    const content = target.querySelector('.factura-content') as HTMLElement;
                    const chequeContent = target.querySelector('.cheque-content') as HTMLElement;
                    if (content && chequeContent) {
                      content.style.opacity = '1';
                      chequeContent.style.opacity = '0';
                    }
                                     }}
                   onClick={() => onFacturaClick(factura)}
                 >
                  {/* Contenido de la factura (visible por defecto) */}
                  <Box className="factura-content" sx={{ transition: "opacity 0.3s ease-in-out" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Typography variant="h6" fontWeight={600} sx={{ color: "text.primary" }}>
                        #{factura.folio}
                      </Typography>
                      <Typography variant="h6" fontWeight={700} sx={{ color: "text.primary" }}>
                        {formatearMontoPesos(factura.montoAsignado)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: 600 }}>
                          Monto Asignado
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
                          {formatearMontoPesos(factura.montoAsignado)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: 600 }}>
                          Proveedor
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
                          {factura.proveedor}
                        </Typography>
                      </Box>
                      
                      {factura.fechaAsignacion && (
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: 600 }}>
                            Fecha Asignación
                          </Typography>
                          <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
                            {new Date(factura.fechaAsignacion).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}
                      
                      {/* Indicador de estado del cheque */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: 600 }}>
                          Estado Cheque
                        </Typography>
                        <Chip
                          label={chequeAsociado ? "Asignado" : "Sin Asignar"}
                          color={chequeAsociado ? "success" : "warning"}
                          size="small"
                          sx={{ 
                            fontWeight: 600,
                            borderRadius: "8px",
                            textTransform: "capitalize"
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                  
                  {/* Contenido del cheque (oculto por defecto, visible en hover) */}
                  <Box 
                    className="cheque-content" 
                    sx={{ 
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      p: 3,
                      bgcolor: "background.paper",
                      borderRadius: "12px",
                      border: `1px solid ${theme.palette.primary.main}`,
                      opacity: 0,
                      transition: "opacity 0.3s ease-in-out",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    {chequeAsociado ? (
                      <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                          <Typography variant="h6" fontWeight={600} sx={{ color: "text.primary" }}>
                            Cheque #{chequeAsociado.correlativo}
                          </Typography>
                          <Typography variant="h6" fontWeight={700} sx={{ color: "text.primary" }}>
                            {formatearMontoPesos(chequeAsociado.montoAsignado)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: 600 }}>
                              Monto Cheque
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
                              {formatearMontoPesos(chequeAsociado.monto)}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: 600 }}>
                              Monto Asignado
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
                              {formatearMontoPesos(chequeAsociado.montoAsignado)}
                            </Typography>
                          </Box>
                          
                          {chequeAsociado.fechaAsignacion && (
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", fontWeight: 600 }}>
                                Fecha Asignación
                              </Typography>
                              <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
                                {new Date(chequeAsociado.fechaAsignacion).toLocaleDateString()}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h6" sx={{ color: "text.secondary", mb: 2, fontWeight: 600 }}>
                          Sin Cheque Asignado
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                          Esta factura no tiene un cheque asignado
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
        </Box>
      )}
    </Box>
  );
}
