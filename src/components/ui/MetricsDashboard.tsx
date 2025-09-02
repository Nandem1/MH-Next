"use client";

import { Box, Paper, Typography, LinearProgress, useTheme, List, ListItem, ListItemText } from "@mui/material";
import { useMetrics } from "@/hooks/useMetrics";
import { useGoMetrics } from "@/hooks/useGoMetrics";
import { useBotMetrics } from "@/hooks/useBotMetrics";
import type { MetricsData } from "@/types/metrics";
import SpeedIcon from "@mui/icons-material/Speed";
import StorageIcon from "@mui/icons-material/Storage";
import TimelineIcon from "@mui/icons-material/Timeline";
import MemoryIcon from "@mui/icons-material/Memory";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import CodeIcon from "@mui/icons-material/Code";
import LanguageIcon from "@mui/icons-material/Language";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export function MetricsDashboard() {
  const { metrics: nodeMetrics, isLoading: nodeLoading, error: nodeError } = useMetrics();
  const { metrics: goMetrics, isLoading: goLoading, error: goError } = useGoMetrics();
  const { metrics: botMetrics, isLoading: botLoading, error: botError } = useBotMetrics();
  const theme = useTheme();

  // Funciones helper para colores
  const getPerformanceColor = (responseTime: number) => {
    if (responseTime < 200) return theme.palette.success.main;
    if (responseTime < 500) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getCacheColor = (connected: boolean) => {
    if (connected) return theme.palette.success.main;
    return theme.palette.error.main;
  };

  const getDatabaseColor = (activeConnections: number) => {
    if (activeConnections > 0) return theme.palette.success.main;
    return theme.palette.error.main;
  };

  const getMemoryColor = (memoryUsage: string) => {
    const memoryMB = parseFloat(memoryUsage);
    if (memoryMB < 100) return theme.palette.success.main;
    if (memoryMB < 200) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime > 3600) return theme.palette.success.main; // > 1 hora
    if (uptime > 1800) return theme.palette.warning.main; // > 30 min
    return theme.palette.info.main;
  };

  const getWhatsAppColor = (status: string) => {
    if (status === 'connected') return theme.palette.success.main;
    if (status === 'connecting') return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const formatUptime = (uptime: number) => {
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  // Componente para mostrar métricas de un servidor específico
  const ServerMetricsSection = ({ 
    title, 
    icon, 
    metrics, 
    isLoading, 
    error
  }: { 
    title: string; 
    icon: React.ReactNode; 
    metrics: MetricsData | null; 
    isLoading: boolean; 
    error: string | null; 
  }) => {
    if (isLoading) {
      return (
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {icon}
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 600, color: "text.primary" }}>
              {title}
            </Typography>
          </Box>
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {icon}
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 600, color: "text.primary" }}>
              {title}
            </Typography>
          </Box>
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {icon}
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 600, color: "text.primary" }}>
              {title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            No metrics data available
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 600, color: "text.primary" }}>
            {title}
          </Typography>
        </Box>
        
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
              {metrics.performance.avg_response_time_ms}
            </Typography>
            
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
              Average response time
            </Typography>
            
            <Box sx={{ display: "flex", gap: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Max: {metrics.performance.max_response_time_ms}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Min: {metrics.performance.min_response_time_ms}
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
              <StorageIcon sx={{ color: getCacheColor(metrics.cache.connected), mr: 1, fontSize: "1.2rem" }} />
              <Typography variant="body2" fontWeight={600} color="text.primary">
                Redis
              </Typography>
            </Box>
            
            <Typography variant="h5" sx={{ color: getCacheColor(metrics.cache.connected), mb: 0.5, fontWeight: 700 }}>
              {metrics.cache.connected ? 'Online' : 'Offline'}
            </Typography>
            
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
              Connection status
            </Typography>
            
            <Box sx={{ display: "flex", gap: 2 }}>
              <Typography variant="caption" color="text.secondary">
                {metrics.cache.totalKeys} keys
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {metrics.cache.hit_rate_percentage} hit rate
              </Typography>
            </Box>
          </Paper>

          {/* Database - Solo para servidores, no para el bot */}
          {title !== "WhatsApp Bot" && (
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
                <StorageIcon sx={{ color: getDatabaseColor(metrics.database.activeConnections), mr: 1, fontSize: "1.2rem" }} />
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
                  {metrics.database.active_connections || metrics.database.activeConnections} connections
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {metrics.database.totalQueries} queries
                </Typography>
              </Box>
            </Paper>
          )}

          {/* WhatsApp - Solo para el bot */}
          {title === "WhatsApp Bot" && (
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
                <WhatsAppIcon sx={{ color: getWhatsAppColor(metrics.whatsapp?.status || 'disconnected'), mr: 1, fontSize: "1.2rem" }} />
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  WhatsApp
                </Typography>
              </Box>
              
              <Typography variant="h5" sx={{ color: getWhatsAppColor(metrics.whatsapp?.status || 'disconnected'), mb: 0.5, fontWeight: 700 }}>
                {metrics.whatsapp?.status === 'connected' ? 'Connected' : 'Disconnected'}
              </Typography>
              
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                Connection status
              </Typography>
              
              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {metrics.whatsapp?.clients?.active || 0}/{metrics.whatsapp?.clients?.total || 0} clients
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {metrics.whatsapp?.messages?.total_received || 0} received
                </Typography>
              </Box>
            </Paper>
          )}

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
              {metrics.system.memory.heapUsed || metrics.system.memoryUsage}
            </Typography>
            
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
              Memory usage
            </Typography>
            
            <Box sx={{ display: "flex", gap: 2 }}>
              <Typography variant="caption" color="text.secondary">
                CPU: {metrics.system.cpu.usage_percentage || metrics.system.cpuUsage}
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
              {(metrics.requests.total_requests || metrics.requests.total || 0).toLocaleString()}
            </Typography>
            
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
              Total requests
            </Typography>
            
            <Box sx={{ display: "flex", gap: 2 }}>
              <Typography variant="caption" color="text.secondary">
                {metrics.requests.errors_count || (metrics.requests.errors ? metrics.requests.errors.length : 0)} errors
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {metrics.requests.slow_requests_count || (metrics.requests.slowRequests ? metrics.requests.slowRequests.length : 0)} slow
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Detalles adicionales - Solo para servidores, no para el bot */}
        {title !== "WhatsApp Bot" && (
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
                  {(metrics.requests.top_endpoints && metrics.requests.top_endpoints.length > 0) ? (
                    metrics.requests.top_endpoints.slice(0, 5).map((endpoint, index) => {
                      // Type guard para verificar si es un endpoint válido
                      const isValidEndpoint = endpoint && typeof endpoint === 'object' && 'endpoint' in endpoint;
                      if (!isValidEndpoint) return null;
                      
                      const endpointData = endpoint as { endpoint: string; count?: number; avg_time_ms?: string };
                      return (
                        <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                          <ListItemText
                            primary={endpointData.endpoint}
                            secondary={`${endpointData.count || 0} requests • ${endpointData.avg_time_ms || '0ms'} avg`}
                            primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 500 }}
                            secondaryTypographyProps={{ fontSize: "0.7rem" }}
                          />
                        </ListItem>
                      );
                    })
                  ) : (
                                         Object.entries(metrics.requests.byEndpoint || {})
                       .sort(([,a], [,b]) => {
                         const aCount = (a as { count?: number })?.count || 0;
                         const bCount = (b as { count?: number })?.count || 0;
                         return bCount - aCount;
                       })
                       .slice(0, 5)
                       .map(([endpoint, data]) => {
                         const endpointData = data as { count?: number; avgTime?: number };
                        return (
                          <ListItem key={endpoint} sx={{ px: 0, py: 0.5 }}>
                            <ListItemText
                              primary={endpoint}
                              secondary={`${endpointData.count || 0} requests • ${Math.round(endpointData.avgTime || 0)}ms avg`}
                              primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 500 }}
                              secondaryTypographyProps={{ fontSize: "0.7rem" }}
                            />
                          </ListItem>
                        );
                      })
                  )}
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
                {metrics.requests.errors && metrics.requests.errors.length > 0 ? (
                  <List dense sx={{ py: 0 }}>
                    {metrics.requests.errors.slice(0, 5).map((error, index) => (
                      <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                        <ListItemText
                          primary={`${error.endpoint || 'Unknown'} (${error.statusCode || 0})`}
                          secondary={error.timestamp ? new Date(error.timestamp).toLocaleString() : 'No timestamp'}
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
                  {Object.entries(metrics.cache.byPrefix || {})
                    .sort(([,a], [,b]) => ((b as number) || 0) - ((a as number) || 0))
                    .map(([prefix, count]) => (
                      <ListItem key={prefix} sx={{ px: 0, py: 0.5 }}>
                        <ListItemText
                          primary={prefix}
                          secondary={`${count || 0} keys`}
                          primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 500 }}
                          secondaryTypographyProps={{ fontSize: "0.7rem" }}
                        />
                      </ListItem>
                    ))}
                </List>
              </Paper>
            </Box>
          </Box>
        )}

        {/* Detalles de WhatsApp - Solo para el bot */}
        {title === "WhatsApp Bot" && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body1" gutterBottom sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
              WhatsApp Details
            </Typography>
            
            <Box sx={{ 
              display: "grid", 
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 2 
            }}>
              {/* Estado de conexión */}
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
                  Connection Status
                </Typography>
                <List dense sx={{ py: 0 }}>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemText
                      primary="State"
                      secondary={metrics.whatsapp?.connection?.state || 'N/A'}
                      primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: "0.7rem" }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemText
                      primary="Last Seen"
                      secondary={metrics.whatsapp?.connection?.lastSeen ? new Date(metrics.whatsapp.connection.lastSeen).toLocaleString() : 'N/A'}
                      primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: "0.7rem" }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemText
                      primary="Uptime"
                      secondary={metrics.whatsapp?.connection?.uptime_hours || 'N/A'}
                      primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: "0.7rem" }}
                    />
                  </ListItem>
                </List>
              </Paper>

              {/* Mensajes */}
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
                  Messages
                </Typography>
                <List dense sx={{ py: 0 }}>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemText
                      primary="Total Received"
                      secondary={metrics.whatsapp?.messages?.total_received || 0}
                      primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: "0.7rem" }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemText
                      primary="Total Sent"
                      secondary={metrics.whatsapp?.messages?.total_sent || 0}
                      primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: "0.7rem" }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemText
                      primary="Last Message"
                      secondary={metrics.whatsapp?.messages?.last_message_ago || 'N/A'}
                      primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: "0.7rem" }}
                    />
                  </ListItem>
                </List>
              </Paper>

              {/* Clientes y QR */}
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
                  Clients & QR
                </Typography>
                <List dense sx={{ py: 0 }}>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemText
                      primary="Active Clients"
                      secondary={`${metrics.whatsapp?.clients?.active || 0}/${metrics.whatsapp?.clients?.total || 0}`}
                      primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: "0.7rem" }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemText
                      primary="QR Generated"
                      secondary={metrics.whatsapp?.qr?.generated ? 'Yes' : 'No'}
                      primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: "0.7rem" }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemText
                      primary="Errors"
                      secondary={metrics.whatsapp?.errors?.count || 0}
                      primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: "0.7rem" }}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Box>
          </Box>
        )}

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Last updated: {metrics.timestamp ? new Date(metrics.timestamp).toLocaleString() : 'No timestamp'}
          </Typography>
          {metrics.version && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
              v{metrics.version} • {metrics.generated_by || 'Monitoring System'}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
        System Metrics
      </Typography>

      {/* WhatsApp Bot - Siempre mostrar ya que es crítico */}
      <ServerMetricsSection
        title="WhatsApp Bot"
        icon={<WhatsAppIcon sx={{ color: theme.palette.success.main }} />}
        metrics={botMetrics}
        isLoading={botLoading}
        error={botError}
      />

      {/* Servidor Node/Express */}
      <ServerMetricsSection
        title="Node/Express Server"
        icon={<CodeIcon sx={{ color: theme.palette.primary.main }} />}
        metrics={nodeMetrics}
        isLoading={nodeLoading}
        error={nodeError}
      />

      {/* Servidor Go */}
      <ServerMetricsSection
        title="Go Server"
        icon={<LanguageIcon sx={{ color: theme.palette.secondary.main }} />}
        metrics={goMetrics as unknown as MetricsData}
        isLoading={goLoading}
        error={goError}
      />

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
        All services update every 10 seconds | Bot: /health | Node: /api-beta/monitoring/metrics | Go: /monitoring/metrics
      </Typography>
    </Box>
  );
} 