"use client";

import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import { useMetrics } from "@/hooks/useMetrics";

export function MetricsIndicator() {
  const { metrics } = useMetrics();
  const theme = useTheme();

  if (!metrics) return null;

  const getDatabaseColor = (activeConnections: number) => {
    if (activeConnections > 0) return theme.palette.success.main;
    return theme.palette.error.main;
  };

  const getCacheColor = (connected: boolean) => {
    if (connected) return theme.palette.success.main;
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
      <Tooltip title={`Database: ${metrics.database.activeConnections > 0 ? 'Online' : 'Offline'} • ${metrics.database.activeConnections} connections`}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: getDatabaseColor(metrics.database.activeConnections),
              boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            }}
          />
          <Typography variant="caption" sx={{ color: "white", fontSize: "0.75rem", fontWeight: 500 }}>
            DB
          </Typography>
        </Box>
      </Tooltip>

      {/* Redis Status */}
      <Tooltip title={`Redis: ${metrics.cache.connected ? 'Online' : 'Offline'} • ${metrics.cache.totalKeys} keys`}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: getCacheColor(metrics.cache.connected),
              boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            }}
          />
          <Typography variant="caption" sx={{ color: "white", fontSize: "0.75rem", fontWeight: 500 }}>
            Redis
          </Typography>
        </Box>
      </Tooltip>

      {/* Errors */}
      {metrics.requests.errors && metrics.requests.errors.length > 0 && (
        <Tooltip title={`${metrics.requests.errors.length} errors detected`}>
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
              {metrics.requests.errors.length}
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