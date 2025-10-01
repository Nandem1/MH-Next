"use client";

import { 
  Box, 
  Typography, 
  Paper, 
  LinearProgress, 
  Alert,
  useTheme
} from "@mui/material";
import { 
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  Assignment as AssignmentIcon,
  AttachMoney as AttachMoneyIcon,
  CreditCard as CreditCardIcon,
  Store as StoreIcon,
  Today as TodayIcon
} from "@mui/icons-material";
import { useEstadisticasFacturas } from "@/hooks/useEstadisticasFacturas";

export function EstadisticasFacturasDashboard() {
  const { estadisticas, loading, error } = useEstadisticasFacturas();
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
          Estadísticas de Facturas
        </Typography>
        <LinearProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Cargando estadísticas...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
          Estadísticas de Facturas
        </Typography>
        <Alert severity="error" sx={{ borderRadius: 1 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!estadisticas) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
          Estadísticas de Facturas
        </Typography>
        <Alert severity="info" sx={{ borderRadius: 1 }}>
          No hay datos de estadísticas disponibles
        </Alert>
      </Box>
    );
  }

  const { historico } = estadisticas.data;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
        Facturas Statistics
      </Typography>

      <Box sx={{ 
        display: "grid", 
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
        gap: 2 
      }}>
        {/* Total Facturas */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            bgcolor: "background.paper",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: theme.palette.primary.main,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              transform: "translateY(-4px)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <ReceiptIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: "1.2rem" }} />
            <Typography variant="body2" fontWeight={600} color="text.primary">
              Total Facturas
            </Typography>
          </Box>
          
          <Typography variant="h5" sx={{ color: theme.palette.primary.main, mb: 0.5, fontWeight: 700 }}>
            {historico.total_facturas.toLocaleString()}
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Registradas
          </Typography>
        </Paper>

        {/* Total Cheques */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            bgcolor: "background.paper",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: theme.palette.secondary.main,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              transform: "translateY(-4px)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <AccountBalanceIcon sx={{ color: theme.palette.secondary.main, mr: 1, fontSize: "1.2rem" }} />
            <Typography variant="body2" fontWeight={600} color="text.primary">
              Total Cheques
            </Typography>
          </Box>
          
          <Typography variant="h5" sx={{ color: theme.palette.secondary.main, mb: 0.5, fontWeight: 700 }}>
            {historico.total_cheques.toLocaleString()}
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Registrados
          </Typography>
        </Paper>

        {/* Facturas en Nóminas */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            bgcolor: "background.paper",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: theme.palette.success.main,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              transform: "translateY(-4px)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <AssignmentIcon sx={{ color: theme.palette.success.main, mr: 1, fontSize: "1.2rem" }} />
            <Typography variant="body2" fontWeight={600} color="text.primary">
              En Nóminas
            </Typography>
          </Box>
          
          <Typography variant="h5" sx={{ color: theme.palette.success.main, mb: 0.5, fontWeight: 700 }}>
            {historico.facturas_en_nominas.toLocaleString()}
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Asignadas
          </Typography>
        </Paper>

        {/* Facturas con Monto */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            bgcolor: "background.paper",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: theme.palette.warning.main,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              transform: "translateY(-4px)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <AttachMoneyIcon sx={{ color: theme.palette.warning.main, mr: 1, fontSize: "1.2rem" }} />
            <Typography variant="body2" fontWeight={600} color="text.primary">
              Con Monto
            </Typography>
          </Box>
          
          <Typography variant="h5" sx={{ color: theme.palette.warning.main, mb: 0.5, fontWeight: 700 }}>
            {historico.facturas_con_monto.toLocaleString()}
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Configuradas
          </Typography>
        </Paper>

        {/* Notas de Crédito */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            bgcolor: "background.paper",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: theme.palette.info.main,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              transform: "translateY(-4px)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <CreditCardIcon sx={{ color: theme.palette.info.main, mr: 1, fontSize: "1.2rem" }} />
            <Typography variant="body2" fontWeight={600} color="text.primary">
              Notas de Crédito
            </Typography>
          </Box>
          
          <Typography variant="h5" sx={{ color: theme.palette.info.main, mb: 0.5, fontWeight: 700 }}>
            {historico.total_notas_credito.toLocaleString()}
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Registradas
          </Typography>
        </Paper>

        {/* Primera Factura */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            bgcolor: "background.paper",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: theme.palette.primary.main,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              transform: "translateY(-4px)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <TodayIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: "1.2rem" }} />
            <Typography variant="body2" fontWeight={600} color="text.primary">
              Primera Factura
            </Typography>
          </Box>
          
          <Typography variant="h5" sx={{ color: theme.palette.primary.main, mb: 0.5, fontWeight: 700 }}>
            {new Date(historico.primera_factura_fecha).toLocaleDateString('es-CL', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Registro inicial
          </Typography>
        </Paper>
      </Box>

      {/* Facturas por Local */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="body1" gutterBottom sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
          Facturas por Local
        </Typography>
        
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
          gap: 2 
        }}>
          {historico.facturas_por_local.map((local) => (
            <Paper
              key={local.id}
              elevation={0}
              sx={{
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                bgcolor: "background.paper",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                <StoreIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: "1.2rem" }} />
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  {local.nombre_local}
                </Typography>
              </Box>
              
              <Typography variant="h5" sx={{ color: theme.palette.primary.main, mb: 0.5, fontWeight: 700 }}>
                {local.cantidad_facturas.toLocaleString()}
              </Typography>
              
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                facturas registradas
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
        Última actualización: {new Date(estadisticas.timestamp).toLocaleString('es-CL')} | API: /api-beta/estadisticas/facturas
      </Typography>
    </Box>
  );
}
