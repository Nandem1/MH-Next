import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import { Producto } from "../../services/productoService";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";

interface ProductoInfoProps {
  producto: Producto | null;
  isLoading: boolean;
  error: string | null;
}

export function ProductoInfo({ producto, isLoading, error }: ProductoInfoProps) {
  if (isLoading) {
    return (
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 2, 
        p: 2, 
        bgcolor: "background.paper",
        borderRadius: 1,
        border: 1,
        borderColor: "divider"
      }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Verificando producto...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 2, 
        p: 2, 
        bgcolor: "background.paper",
        borderRadius: 1,
        border: 1,
        borderColor: "divider"
      }}>
        <WarningIcon color="warning" fontSize="small" />
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!producto) {
    return null;
  }

  const tieneVencimientos = producto.fechas_vencimiento && producto.fechas_vencimiento.length > 0;
  const totalVencimientos = tieneVencimientos ? producto.fechas_vencimiento.length : 0;

  return (
    <Box sx={{ 
      p: 2, 
      bgcolor: "background.paper",
      borderRadius: 1,
      border: 1,
      borderColor: "divider"
    }}>
      {/* Confirmación de lectura */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <CheckCircleIcon color="success" fontSize="small" />
        <Typography variant="body2" fontWeight={500}>
          Producto encontrado
        </Typography>
      </Box>

      {/* Información básica */}
      <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
        {producto.nombre}
      </Typography>
      
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        <Chip 
          label={producto.codigo} 
          size="small" 
          variant="outlined" 
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Estado de vencimientos */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {tieneVencimientos ? (
          <>
            <InfoIcon color="info" fontSize="small" />
            <Box>
              <Typography variant="body2" fontWeight={500} color="info.main">
                Tiene {totalVencimientos} fecha{totalVencimientos > 1 ? 's' : ''} de vencimiento registrada{totalVencimientos > 1 ? 's' : ''}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {producto.fechas_vencimiento.map((v) => 
                  `${new Date(v.fecha_vencimiento).toLocaleDateString('es-ES')} (${v.cantidad} ${producto.unidad})`
                ).join(', ')}
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <InfoIcon color="warning" fontSize="small" />
            <Typography variant="body2" fontWeight={500} color="warning.main">
              Sin fechas de vencimiento registradas
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
} 