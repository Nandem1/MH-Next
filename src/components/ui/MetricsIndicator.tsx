"use client";

import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import { useMetrics } from "@/hooks/useMetrics";
import { useBotMetrics } from "@/hooks/useBotMetrics";

export function MetricsIndicator() {
  const { metrics: nodeMetrics } = useMetrics();
  const { metrics: botMetrics } = useBotMetrics();
  const theme = useTheme();

  if (!nodeMetrics) return null;

  const getDatabaseColor = (activeConnections: number) => {
    if (activeConnections > 0) return theme.palette.success.main;
    return theme.palette.error.main;
  };

  const getCacheColor = (connected: boolean) => {
    if (connected) return theme.palette.success.main;
    return theme.palette.error.main;
  };

  const getWhatsAppColor = (status: string) => {
    if (status === 'connected') return theme.palette.success.main;
    if (status === 'connecting') return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Box
      sx={{
        display: { xs: "none", lg: "flex" },
        alignItems: "center",
        gap: 2,
        mr: 2,
      }}
    >
      {/* Database Status */}
      <Tooltip title={`Database: ${nodeMetrics.database.activeConnections > 0 ? 'Online' : 'Offline'} • ${nodeMetrics.database.activeConnections} connections`}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: getDatabaseColor(nodeMetrics.database.activeConnections),
              boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            }}
          />
          <Typography variant="caption" sx={{ color: "white", fontSize: "0.75rem", fontWeight: 500 }}>
            DB
          </Typography>
        </Box>
      </Tooltip>

      {/* Redis Status */}
      <Tooltip title={`Redis: ${nodeMetrics.cache.connected ? 'Online' : 'Offline'} • ${nodeMetrics.cache.totalKeys} keys`}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: getCacheColor(nodeMetrics.cache.connected),
              boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            }}
          />
          <Typography variant="caption" sx={{ color: "white", fontSize: "0.75rem", fontWeight: 500 }}>
            Redis
          </Typography>
        </Box>
      </Tooltip>

      {/* WhatsApp Status - Siempre mostrar ya que es crítico */}
      <Tooltip title={`WhatsApp: ${botMetrics?.whatsapp?.status === 'connected' ? 'Connected' : 'Disconnected'} • ${botMetrics?.whatsapp?.clients?.active || 0}/${botMetrics?.whatsapp?.clients?.total || 0} clients`}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: getWhatsAppColor(botMetrics?.whatsapp?.status || 'disconnected'),
              boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            }}
          />
                      <Typography variant="caption" sx={{ color: "white", fontSize: "0.75rem", fontWeight: 500 }}>
              Bot
            </Typography>
        </Box>
      </Tooltip>

      {/* Errors */}
      {nodeMetrics.requests.errors && nodeMetrics.requests.errors.length > 0 && (
        <Tooltip title={`${nodeMetrics.requests.errors.length} errors detected`}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: theme.palette.error.main,
                boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                animation: "pulse 2s infinite",
              }}
            />
            <Typography variant="caption" sx={{ color: "white", fontSize: "0.75rem", fontWeight: 500 }}>
              {nodeMetrics.requests.errors.length}
            </Typography>
          </Box>
        </Tooltip>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  );
} 