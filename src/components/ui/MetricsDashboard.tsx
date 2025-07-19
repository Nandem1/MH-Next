"use client";

import { Box, Paper, Typography, LinearProgress, useTheme, List, ListItem, ListItemText } from "@mui/material";
import { useMetrics } from "@/hooks/useMetrics";
import SpeedIcon from "@mui/icons-material/Speed";
import StorageIcon from "@mui/icons-material/Storage";
import DatabaseIcon from "@mui/icons-material/Storage";
import TimelineIcon from "@mui/icons-material/Timeline";
import MemoryIcon from "@mui/icons-material/Memory";
import QueryStatsIcon from "@mui/icons-material/QueryStats";

export function MetricsDashboard() {
  const { metrics, isLoading, error } = useMetrics();
  const theme = useTheme();

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
          System Metrics
        </Typography>
        <LinearProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Loading metrics...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
          System Metrics
        </Typography>
        <Box sx={{ 
          p: 3, 
          border: `1px solid ${theme.palette.error.light}`, 
          borderRadius: 1, 
          bgcolor: theme.palette.error.light + '10',
          textAlign: 'center'
        }}>
          <Typography variant="body1" color="error.main" sx={{ mb: 1, fontWeight: 500 }}>
            Unable to load metrics
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Check if the monitoring server is running and accessible
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!metrics) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
          System Metrics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No metrics data available
        </Typography>
      </Box>
    );
  }

  const getPerformanceColor = (responseTime: number) => {
    if (responseTime < 200) return theme.palette.success.main;
    if (responseTime < 500) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getCacheColor = (hitRate: number, connected: boolean) => {
    if (connected) return theme.palette.success.main;
    return theme.palette.error.main;
  };

  const getDatabaseColor = (activeConnections: number) => {
    if (activeConnections > 0) return theme.palette.success.main;
    return theme.palette.error.main;
  };

  const getMemoryColor = (memoryUsage: string) => {
    const memoryMB = parseFloat(memoryUsage.replace(' MB', ''));
    if (memoryMB < 100) return theme.palette.success.main;
    if (memoryMB < 200) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime > 3600) return theme.palette.success.main; // > 1 hora
    if (uptime > 1800) return theme.palette.warning.main; // > 30 min
    return theme.palette.info.main;
  };

  const formatUptime = (uptime: number) => {
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
        System Metrics
      </Typography>
      
      <Box sx={{ 
        display: "grid", 
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
        gap: 2 
      }}>
        {/* Performance */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            bgcolor: "background.paper",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: theme.palette.primary.main,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <SpeedIcon sx={{ color: getPerformanceColor(metrics.performance.avgResponseTime), mr: 1, fontSize: "1.2rem" }} />
            <Typography variant="body2" fontWeight={600} color="text.primary">
              Performance
            </Typography>
          </Box>
          
          <Typography variant="h5" sx={{ color: getPerformanceColor(metrics.performance.avgResponseTime), mb: 0.5, fontWeight: 700 }}>
            {Math.round(metrics.performance.avgResponseTime)}ms
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Average response time
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Max: {Math.round(metrics.performance.maxResponseTime)}ms
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Min: {Math.round(metrics.performance.minResponseTime)}ms
            </Typography>
          </Box>
        </Paper>

        {/* Cache */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            bgcolor: "background.paper",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: theme.palette.primary.main,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <StorageIcon sx={{ color: getCacheColor(metrics.cache.hitRate, metrics.cache.connected), mr: 1, fontSize: "1.2rem" }} />
            <Typography variant="body2" fontWeight={600} color="text.primary">
              Redis
            </Typography>
          </Box>
          
          <Typography variant="h5" sx={{ color: getCacheColor(metrics.cache.hitRate, metrics.cache.connected), mb: 0.5, fontWeight: 700 }}>
            {metrics.cache.connected ? 'Online' : 'Offline'}
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Connection status
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography variant="caption" color="text.secondary">
              {metrics.cache.totalKeys.toLocaleString()} keys
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {(metrics.cache.hitRate * 100).toFixed(1)}% hit rate
            </Typography>
          </Box>
        </Paper>

        {/* Database */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            bgcolor: "background.paper",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: theme.palette.primary.main,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <DatabaseIcon sx={{ color: getDatabaseColor(metrics.database.activeConnections), mr: 1, fontSize: "1.2rem" }} />
            <Typography variant="body2" fontWeight={600} color="text.primary">
              Database
            </Typography>
          </Box>
          
          <Typography variant="h5" sx={{ color: getDatabaseColor(metrics.database.activeConnections), mb: 0.5, fontWeight: 700 }}>
            {metrics.database.activeConnections > 0 ? 'Online' : 'Offline'}
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Connection status
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography variant="caption" color="text.secondary">
              {metrics.database.activeConnections} connections
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {metrics.database.totalQueries.toLocaleString()} queries
            </Typography>
          </Box>
        </Paper>

        {/* System */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            bgcolor: "background.paper",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: theme.palette.primary.main,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <MemoryIcon sx={{ color: getMemoryColor(metrics.system.memoryUsage), mr: 1, fontSize: "1.2rem" }} />
            <Typography variant="body2" fontWeight={600} color="text.primary">
              System
            </Typography>
          </Box>
          
          <Typography variant="h5" sx={{ color: getMemoryColor(metrics.system.memoryUsage), mb: 0.5, fontWeight: 700 }}>
            {metrics.system.memoryUsage}MB
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Memory usage
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography variant="caption" color="text.secondary">
              CPU: {metrics.system.cpuUsage}
            </Typography>
          </Box>
        </Paper>

        {/* Uptime */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            bgcolor: "background.paper",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: theme.palette.primary.main,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <TimelineIcon sx={{ color: getUptimeColor(metrics.system.uptime), mr: 1, fontSize: "1.2rem" }} />
            <Typography variant="body2" fontWeight={600} color="text.primary">
              Uptime
            </Typography>
          </Box>
          
          <Typography variant="h5" sx={{ color: getUptimeColor(metrics.system.uptime), mb: 0.5, fontWeight: 700 }}>
            {formatUptime(metrics.system.uptime)}
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Server runtime
          </Typography>
        </Paper>

        {/* Requests */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            bgcolor: "background.paper",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: theme.palette.primary.main,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <QueryStatsIcon sx={{ color: theme.palette.info.main, mr: 1, fontSize: "1.2rem" }} />
            <Typography variant="body2" fontWeight={600} color="text.primary">
              Requests
            </Typography>
          </Box>
          
          <Typography variant="h5" sx={{ color: theme.palette.info.main, mb: 0.5, fontWeight: 700 }}>
            {metrics.requests.total.toLocaleString()}
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Total requests
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography variant="caption" color="text.secondary">
              {metrics.requests.errors.length} errors
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {metrics.requests.slowRequests.length} slow
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Detalles adicionales */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="body1" gutterBottom sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
          Details
        </Typography>
        
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2 
        }}>
          {/* Endpoints más usados */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Top Endpoints
            </Typography>
            <List dense sx={{ py: 0 }}>
              {Object.entries(metrics.requests.byEndpoint)
                .sort(([,a], [,b]) => b.count - a.count)
                .slice(0, 5)
                .map(([endpoint, data]) => (
                  <ListItem key={endpoint} sx={{ px: 0, py: 0.5 }}>
                    <ListItemText
                      primary={endpoint}
                      secondary={`${data.count} requests • ${Math.round(data.avgTime)}ms avg`}
                      primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: "0.7rem" }}
                    />
                  </ListItem>
                ))}
            </List>
          </Paper>

          {/* Errores recientes */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Recent Errors
            </Typography>
            {metrics.requests.errors.length > 0 ? (
              <List dense sx={{ py: 0 }}>
                {metrics.requests.errors.slice(0, 5).map((error, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                    <ListItemText
                      primary={`${error.endpoint} (${error.statusCode})`}
                      secondary={new Date(error.timestamp).toLocaleString()}
                      primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 500, color: "error.main" }}
                      secondaryTypographyProps={{ fontSize: "0.7rem" }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="caption" color="text.secondary">
                No recent errors
              </Typography>
            )}
          </Paper>

          {/* Redis Keys por Prefijo */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Redis Keys
            </Typography>
            <List dense sx={{ py: 0 }}>
              {Object.entries(metrics.cache.byPrefix)
                .sort(([,a], [,b]) => b - a)
                .map(([prefix, count]) => (
                  <ListItem key={prefix} sx={{ px: 0, py: 0.5 }}>
                    <ListItemText
                      primary={prefix}
                      secondary={`${count} keys`}
                      primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: "0.7rem" }}
                    />
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Box>
      </Box>

      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          Last updated: {new Date(metrics.timestamp).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
} 