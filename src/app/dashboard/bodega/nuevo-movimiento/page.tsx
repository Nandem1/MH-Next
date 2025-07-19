"use client";

import { useState } from "react";
import { Box, Typography, Paper, Tabs, Tab, useTheme } from "@mui/material";
import { NuevoMovimientoContent } from "@/components/bodega/NuevoMovimientoContent";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`movimiento-tabpanel-${index}`}
      aria-labelledby={`movimiento-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function NuevoMovimientoPage() {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 3 } }}>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          fontWeight: 700,
          fontSize: { xs: "1.5rem", md: "1.75rem" },
          mb: 0.5,
          color: "text.primary"
        }}
      >
        Nuevo Movimiento
      </Typography>

      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ mb: 4, fontSize: "0.875rem" }}
      >
        Registra entradas y salidas de stock
      </Typography>

      <Paper 
        elevation={0} 
        sx={{ 
          border: 1, 
          borderColor: "divider",
          borderRadius: 1.5,
          overflow: "hidden",
          minWidth: 800, // Ancho mínimo fijo
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="movimiento tabs"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              minHeight: 48,
              px: 4,
              "&.Mui-selected": {
                color: theme.palette.primary.main,
              },
            },
            "& .MuiTabs-indicator": {
              height: 2,
              bgcolor: theme.palette.primary.main,
            },
          }}
        >
          <Tab 
            label="Entrada" 
            id="movimiento-tab-0"
            aria-controls="movimiento-tabpanel-0"
          />
          <Tab 
            label="Salida" 
            id="movimiento-tab-1"
            aria-controls="movimiento-tabpanel-1"
          />
        </Tabs>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <TabPanel value={tabValue} index={0}>
            <NuevoMovimientoContent tipo="entrada" />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <NuevoMovimientoContent tipo="salida" />
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
} 