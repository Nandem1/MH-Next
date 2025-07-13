"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import { VencimientoEstadoData } from "@/types/vencimientos";
import { useHistorialEstados } from "@/hooks/useVencimientosEstados";
import { useTheme, useMediaQuery } from "@mui/material";

interface HistorialEstadosVencimientoProps {
  open: boolean;
  onClose: () => void;
  vencimientoId: number;
  nombreProducto?: string;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount: string | number) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(Number(amount));
};

export function HistorialEstadosVencimiento({
  open,
  onClose,
  vencimientoId,
  nombreProducto,
}: HistorialEstadosVencimientoProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { data, isLoading, error, isFetching } = useHistorialEstados(vencimientoId);
  const historial = data?.data as VencimientoEstadoData[] || [];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={isMobile}
      sx={{
        '& .MuiDialog-paper': {
          margin: isMobile ? 0 : '32px',
          maxHeight: isMobile ? '100%' : 'calc(100% - 64px)',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1, px: isMobile ? 2 : 3 }}>
        <Typography variant={isMobile ? "h6" : "h6"} component="h2" sx={{ fontWeight: 600, mb: 0.5 }}>
          Historial de cambios
        </Typography>
        {nombreProducto && (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
            {nombreProducto}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent sx={{ px: isMobile ? 2 : 3, pb: isMobile ? 2 : 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error al cargar el historial: {error.message}
          </Alert>
        )}

        {(isLoading || isFetching) ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={4} gap={2}>
            <CircularProgress size={24} />
            <Typography variant="body2" color="text.secondary">
              {isLoading ? "Cargando historial..." : "Actualizando historial..."}
            </Typography>
          </Box>
        ) : historial.length === 0 ? (
          <Alert severity="info">
            No hay historial de estados para este vencimiento.
          </Alert>
        ) : (
          <Box display="flex" flexDirection="column" gap={0}>
            {/* Resumen del historial */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Resumen del historial
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip
                  label={`${historial.length} cambio${historial.length > 1 ? 's' : ''}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.75rem" }}
                />
                <Chip
                  label={`Último: ${formatDate(historial[0]?.created_at || '')}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.75rem" }}
                />
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />
            
            {/* Título de la sección de cambios */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Cambios realizados
              </Typography>
            </Box>
            
            {historial.map((estado, index) => (
              <Box key={estado.id}>
                <Box display="flex" gap={isMobile ? 1.5 : 2} sx={{ py: 2 }}>
                  {/* Punto del estado */}
                  <Box
                    sx={{
                      width: isMobile ? "20px" : "24px",
                      height: isMobile ? "20px" : "24px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: estado.estado === "vendido" ? "#15803d" : 
                                     estado.estado === "rebajado" ? "#d97706" : "#374151",
                      flexShrink: 0,
                      alignSelf: "flex-start",
                      mt: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: isMobile ? "6px" : "8px",
                        height: isMobile ? "6px" : "8px",
                        borderRadius: "50%",
                        backgroundColor: "white",
                      }}
                    />
                  </Box>
                  
                  {/* Contenido */}
                  <Box flex={1} sx={{ minWidth: 0 }}>
                    {/* Header con estado y fecha */}
                    <Box 
                      display="flex" 
                      justifyContent="space-between" 
                      alignItems="flex-start" 
                      mb={1.5}
                      flexDirection={isMobile ? "column" : "row"}
                      gap={isMobile ? 1 : 0}
                    >
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        <Chip
                          label={estado.estado.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: estado.estado === "vendido" ? "#15803d" : 
                                           estado.estado === "rebajado" ? "#d97706" : "#374151",
                            color: "white",
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            "&:hover": {
                              backgroundColor: estado.estado === "vendido" ? "#16a34a" : 
                                             estado.estado === "rebajado" ? "#ea580c" : "#4b5563",
                            },
                          }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {estado.cantidad_afectada} unid.
                        </Typography>
                      </Box>
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{ 
                          fontSize: "0.75rem",
                          alignSelf: isMobile ? "flex-start" : "flex-end"
                        }}
                      >
                        {formatDate(estado.created_at)}
                      </Typography>
                    </Box>
                    
                    {/* Detalles */}
                    <Box display="flex" flexDirection="column" gap={1}>
                      {estado.precio_rebaja && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                            Precio de rebaja
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {formatCurrency(estado.precio_rebaja)}
                          </Typography>
                        </Box>
                      )}
                      
                      {estado.motivo && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                            Motivo
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word" }}>
                            {estado.motivo}
                          </Typography>
                        </Box>
                      )}
                      
                      {estado.usuario_nombre && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                            Actualizado por
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {estado.usuario_nombre}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
                
                {/* Divider entre elementos (excepto el último) */}
                {index < historial.length - 1 && (
                  <Divider sx={{ my: 1 }} />
                )}
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: isMobile ? 2 : 3, pb: isMobile ? 2 : 3 }}>
        <Button onClick={onClose} variant="contained" fullWidth={isMobile}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
} 