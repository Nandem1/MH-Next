"use client";

import { Box, Typography, Chip, IconButton, Collapse, useTheme, useMediaQuery } from "@mui/material";



import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import { useState } from "react";

interface Vencimiento {
  fecha_vencimiento: string;
  cantidad: number;
  lote?: string | null;
}

interface VencimientosSectionProps {
  fechas_vencimiento?: Vencimiento[];
}

export function VencimientosSection({ fechas_vencimiento }: VencimientosSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleToggleExpanded = () => {
    setExpanded(!expanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysUntilExpiry = (dateString: string) => {
    const today = new Date();
    const expiryDate = new Date(dateString);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (dateString: string) => {
    const daysUntilExpiry = getDaysUntilExpiry(dateString);
    
    if (daysUntilExpiry < 0) {
      return { status: "vencido", color: "error" as const, icon: <WarningIcon /> };
    } else if (daysUntilExpiry <= 30) {
      return { status: "proximo", color: "warning" as const, icon: <WarningIcon /> };
    } else {
      return { status: "ok", color: "success" as const, icon: <InfoIcon /> };
    }
  };

  const getTotalQuantity = () => {
    if (!fechas_vencimiento) return 0;
    return fechas_vencimiento.reduce((total, v) => total + v.cantidad, 0);
  };

  const getExpiringSoonCount = () => {
    if (!fechas_vencimiento) return 0;
    return fechas_vencimiento.filter(v => getDaysUntilExpiry(v.fecha_vencimiento) <= 30).length;
  };

  const getExpiredCount = () => {
    if (!fechas_vencimiento) return 0;
    return fechas_vencimiento.filter(v => getDaysUntilExpiry(v.fecha_vencimiento) < 0).length;
  };

  if (!fechas_vencimiento || fechas_vencimiento.length === 0) {
    return (
      <Box sx={{ mt: 0, mb: 0, minHeight: "32px", display: "flex", alignItems: "center" }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }}>
          Sin información de vencimientos
        </Typography>
      </Box>
    );
  }

  const totalQuantity = getTotalQuantity();
  const expiringSoonCount = getExpiringSoonCount();
  const expiredCount = getExpiredCount();

  return (
    <Box sx={{ mt: 0, mb: 0 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ 
          cursor: "pointer",
          minHeight: isMobile ? "32px" : "40px",
          py: isMobile ? 0.25 : 0.5
        }}
        onClick={handleToggleExpanded}
      >
        <Box display="flex" alignItems="center" gap={isMobile ? 0.5 : 1} flexWrap="wrap">
          <Typography 
            variant="subtitle2" 
            color="text.secondary"
            sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
          >
            Vencimientos
          </Typography>
          <Chip
            label={`${fechas_vencimiento.length} lote${fechas_vencimiento.length > 1 ? 's' : ''}`}
            size={isMobile ? "small" : "small"}
            variant="outlined"
            sx={{ 
              fontSize: isMobile ? '0.65rem' : '0.75rem',
              height: isMobile ? '20px' : '24px'
            }}
          />
          <Chip
            label={`${totalQuantity} unid.`}
            size={isMobile ? "small" : "small"}
            variant="outlined"
            sx={{ 
              fontSize: isMobile ? '0.65rem' : '0.75rem',
              height: isMobile ? '20px' : '24px'
            }}
          />
        </Box>
        <Box display="flex" alignItems="center" gap={isMobile ? 0.5 : 1}>
          {expiredCount > 0 && (
            <Chip
              label={`${expiredCount} vencido${expiredCount > 1 ? 's' : ''}`}
              size={isMobile ? "small" : "small"}
              color="error"
              sx={{ 
                fontSize: isMobile ? '0.65rem' : '0.75rem',
                height: isMobile ? '20px' : '24px'
              }}
            />
          )}
          {expiringSoonCount > 0 && expiredCount === 0 && (
            <Chip
              label={`${expiringSoonCount} próximo${expiringSoonCount > 1 ? 's' : ''}`}
              size={isMobile ? "small" : "small"}
              color="warning"
              sx={{ 
                fontSize: isMobile ? '0.65rem' : '0.75rem',
                height: isMobile ? '20px' : '24px'
              }}
            />
          )}
          <IconButton size={isMobile ? "small" : "small"} sx={{ padding: isMobile ? '2px' : '4px' }}>
            {expanded ? <ExpandLessIcon fontSize={isMobile ? "small" : "small"} /> : <ExpandMoreIcon fontSize={isMobile ? "small" : "small"} />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ mt: 0.5 }}>
          {fechas_vencimiento.map((vencimiento, index) => {
            const { status, color, icon } = getExpiryStatus(vencimiento.fecha_vencimiento);
            const daysUntilExpiry = getDaysUntilExpiry(vencimiento.fecha_vencimiento);
            
            return (
              <Box
                key={index}
                sx={{
                  p: isMobile ? 0.75 : 1,
                  mb: isMobile ? 0.5 : 1,
                  border: 1,
                  borderColor: `${color}.light`,
                  borderRadius: 1,
                  backgroundColor: `${color}.50`,
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      fontWeight="medium"
                      sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                    >
                      {formatDate(vencimiento.fecha_vencimiento)}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: isMobile ? '0.65rem' : '0.75rem' }}
                    >
                      Cantidad: {vencimiento.cantidad} unid.
                      {vencimiento.lote && ` | Lote: ${vencimiento.lote}`}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {icon}
                    <Typography
                      variant="caption"
                      color={`${color}.main`}
                      fontWeight="medium"
                      sx={{ fontSize: isMobile ? '0.65rem' : '0.75rem' }}
                    >
                      {status === "vencido" && `${Math.abs(daysUntilExpiry)} días vencido`}
                      {status === "proximo" && `${daysUntilExpiry} días`}
                      {status === "ok" && `${daysUntilExpiry} días`}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
} 