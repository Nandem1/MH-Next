"use client";

import { useState } from "react";
import { Box, Typography, Paper, Tabs, Tab, useTheme } from "@mui/material";
import { MovimientosContent } from "@/components/bodega/MovimientosContent";

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
      id={`movimientos-tabpanel-${index}`}
      aria-labelledby={`movimientos-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function MovimientosPage() {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", p: { xs: 2, md: 3 } }}>
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
        Historial de Movimientos
      </Typography>

      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ mb: 4, fontSize: "0.875rem" }}
      >
        Consulta el historial completo de entradas y salidas de stock
      </Typography>

      <Paper 
        elevation={0} 
        sx={{ 
          border: 1, 
          borderColor: "divider",
          borderRadius: 1.5,
          overflow: "hidden",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="movimientos tabs"
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
            label="Todos los Movimientos" 
            id="movimientos-tab-0"
            aria-controls="movimientos-tabpanel-0"
          />
          <Tab 
            label="Entradas" 
            id="movimientos-tab-1"
            aria-controls="movimientos-tabpanel-1"
          />
          <Tab 
            label="Salidas" 
            id="movimientos-tab-2"
            aria-controls="movimientos-tabpanel-2"
          />
        </Tabs>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <TabPanel value={tabValue} index={0}>
            <MovimientosContent tipo="todos" />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <MovimientosContent tipo="entrada" />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <MovimientosContent tipo="salida" />
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
} 