"use client";

import { Divider, Box, Typography, Button, useMediaQuery, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Drawer } from "@mui/material";



import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DescriptionIcon from "@mui/icons-material/Description";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AssessmentIcon from "@mui/icons-material/Assessment";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import StorageIcon from "@mui/icons-material/Storage";
import Image from "next/image";

import { useRouter, usePathname } from "next/navigation";

import { drawerWidth } from "@/constants/layout";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export function Sidebar({ mobileOpen, handleDrawerToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width:900px)");
  const { logout, usuario } = useAuth();
  const [openDTE, setOpenDTE] = useState(false);
  const [openBodega, setOpenBodega] = useState(false);

  const handleSubmenuClick = () => setOpenDTE(!openDTE);
  const handleBodegaClick = () => setOpenBodega(!openBodega);

  const goTo = (path: string) => {
    router.push(path);
    if (isMobile) handleDrawerToggle();
  };

  const getNombreLocal = (id_local: number | null): string => {
    switch (id_local) {
      case 1:
        return "LA CANTERA 3055";
      case 2:
        return "LIBERTADOR 1476";
      case 3:
        return "BALMACEDA 599";
      default:
        return "Local desconocido";
    }
  };

  const drawerContent = (
    <Box display="flex" flexDirection="column" height="100%">
      {/* Logo y header del sidebar */}
      <Box
        sx={{
          px: 2,
          py: 0,
          height: { xs: "auto", md: 64 }, // Altura automática en móvil, fija en desktop
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {/* Logo - Solo visible en desktop */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 120,
            height: 40,
            position: "relative",
            display: { xs: "none", md: "flex" }, // Oculto en móvil, visible en desktop
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src="/assets/multihouse-logo-black.png"
            alt="Mercado House"
            fill
            style={{
              objectFit: "contain",
              objectPosition: "center",
              filter: "brightness(0) invert(1)", // Hace el logo blanco
              transform: "scale(1.3)", // Hace zoom a la imagen
            }}
            priority
          />
        </Box>
        
        {/* Información del usuario solo en mobile */}
        {isMobile && usuario?.nombre && (
          <Box sx={{ 
            textAlign: "left", 
            mt: 2, 
            mb: 2,
            width: "100%",
            px: 0.5 
          }}>
            <Typography variant="body2" fontWeight={500}>
              Hola, {usuario.nombre}
            </Typography>
            {usuario.id_local !== null && (
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                {getNombreLocal(usuario.id_local)}
              </Typography>
            )}
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={logout}
              sx={{ 
                mt: 1, 
                textTransform: "none",
                width: "100%",
                mx: 0,
                display: "block"
              }}
            >
              Cerrar sesión
            </Button>
          </Box>
        )}
      </Box>

      <Divider />
      <Box flexGrow={1}>
        <List>
          {/* INICIO */}
          <ListItem disablePadding>
            <ListItemButton
              selected={pathname === "/dashboard/inicio"}
              onClick={() => goTo("/dashboard/inicio")}
              sx={navButtonStyle()}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Inicio" />
            </ListItemButton>
          </ListItem>

          {/* DTE MH (submenu) */}
          <ListItem disablePadding>
            <ListItemButton onClick={handleSubmenuClick}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary="Documentos" />
              {openDTE ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openDTE} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={pathname === "/dashboard/facturas"}
                onClick={() => goTo("/dashboard/facturas")}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DescriptionIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Facturas Electrónicas" />
              </ListItemButton>

              <ListItemButton
                sx={{ pl: 4 }}
                selected={pathname === "/dashboard/notas-credito"}
                onClick={() => goTo("/dashboard/notas-credito")}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <RotateLeftIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Notas de Crédito" />
              </ListItemButton>

              <ListItemButton
                sx={{ pl: 4 }}
                selected={pathname === "/dashboard/nominas"}
                onClick={() => goTo("/dashboard/nominas")}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <ChecklistIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Nóminas" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* BODEGA (submenu) */}
          <ListItem disablePadding>
            <ListItemButton onClick={handleBodegaClick}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <InventoryIcon />
              </ListItemIcon>
              <ListItemText primary="Bodega" />
              {openBodega ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openBodega} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={pathname === "/dashboard/bodega/inicio"}
                onClick={() => goTo("/dashboard/bodega/inicio")}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <HomeIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Inicio" />
              </ListItemButton>

              <ListItemButton
                sx={{ pl: 4 }}
                selected={pathname === "/dashboard/bodega/nuevo-movimiento"}
                onClick={() => goTo("/dashboard/bodega/nuevo-movimiento")}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <AddIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Nuevo Movimiento" />
              </ListItemButton>

              <ListItemButton
                sx={{ pl: 4 }}
                selected={pathname === "/dashboard/bodega/stock-general"}
                onClick={() => goTo("/dashboard/bodega/stock-general")}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <StorageIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Stock General" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Auditoría de Cartelería */}
          <ListItem disablePadding>
            <ListItemButton
              selected={pathname === "/dashboard/auditoria-carteleria"}
              onClick={() => goTo("/dashboard/auditoria-carteleria")}
              sx={navButtonStyle()}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary="Auditoría de Cartelería" />
            </ListItemButton>
          </ListItem>

          {/* Vencimientos */}
          <ListItem disablePadding>
            <ListItemButton
              selected={pathname === "/dashboard/vencimientos"}
              onClick={() => goTo("/dashboard/vencimientos")}
              sx={navButtonStyle()}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <QrCodeScannerIcon />
              </ListItemIcon>
              <ListItemText primary="Vencimientos" />
            </ListItemButton>
          </ListItem>

          {/* Control de Vencimientos */}
          <ListItem disablePadding>
            <ListItemButton
              selected={pathname === "/dashboard/control-vencimientos"}
              onClick={() => goTo("/dashboard/control-vencimientos")}
              sx={navButtonStyle()}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary="Control de Vencimientos" />
            </ListItemButton>
          </ListItem>

          {/* ZebrAI */}
          <ListItem disablePadding>
            <ListItemButton
              selected={pathname === "/dashboard/zebrai"}
              onClick={() => goTo("/dashboard/zebrai")}
              sx={navButtonStyle()}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary="ZebrAI" />
            </ListItemButton>
          </ListItem>

          {/* Lector DTE */}
          <ListItem disablePadding>
            <ListItemButton
              selected={pathname === "/dashboard/lector-dte"}
              onClick={() => goTo("/dashboard/lector-dte")}
              sx={navButtonStyle()}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary="Lector DTE" />
            </ListItemButton>
          </ListItem>

          {/* Usuarios */}
          <ListItem disablePadding>
            <ListItemButton
              selected={pathname === "/dashboard/usuarios"}
              onClick={() => goTo("/dashboard/usuarios")}
              sx={navButtonStyle()}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Usuarios" />
            </ListItemButton>
          </ListItem>

          {/* Configuración */}
          <ListItem disablePadding>
            <ListItemButton
              selected={pathname === "/dashboard/configuracion"}
              onClick={() => goTo("/dashboard/configuracion")}
              sx={navButtonStyle()}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Configuración" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Divider />
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 1,
          textAlign: "center",
          fontSize: "0.8rem",
          color: "text.secondary",
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        Desarrollado por{" "}
        <Typography
          component="a"
          href="https://github.com/Nandem1"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ 
            color: "primary.main", 
            fontWeight: 500,
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline"
            }
          }}
        >
          Nandev
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={isMobile ? handleDrawerToggle : undefined}
      ModalProps={isMobile ? { keepMounted: true } : undefined}
      sx={{
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "background.paper",
        },
        [`& .MuiDrawer-docked`]: {
          ...(isMobile ? {} : { width: 0 }),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

function navButtonStyle() {
  return {
    "&.Mui-selected": {
      backgroundColor: "primary.main",
      color: "#0a0a0a",
      "&:hover": { backgroundColor: "#e6c235" },
    },
    "&:hover": {
      bgcolor: "rgba(255, 217, 61, 0.08)",
      transition: "background-color 0.3s ease",
    },
  };
}
