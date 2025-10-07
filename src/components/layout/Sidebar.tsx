"use client";

import { Divider, Box, Typography, Button, useMediaQuery, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Drawer, Link, Chip } from "@mui/material";



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
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HistoryIcon from "@mui/icons-material/History";
import Image from "next/image";

import { useRouter, usePathname } from "next/navigation";

import { drawerWidth } from "@/constants/layout";
import { useAuth } from "@/hooks/useAuth";
// import { canAccessRoute } from "@/utils/permissions";
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
  const [openCajaChica, setOpenCajaChica] = useState(false);

  const handleSubmenuClick = () => setOpenDTE(!openDTE);
  const handleBodegaClick = () => setOpenBodega(!openBodega);
  const handleCajaChicaClick = () => setOpenCajaChica(!openCajaChica);

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

  // Acceso a rutas condicionado por reglas por ruta
  // const canSeeBodega = [
  //   "/dashboard/bodega/inicio",
  //   "/dashboard/bodega/nuevo-movimiento",
  //   "/dashboard/bodega/stock-general",
  // ].some((path) => canAccessRoute(path, usuario || undefined));

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
                <DashboardIcon sx={iconStyle()} />
              </ListItemIcon>
              <ListItemText 
                primary="Inicio" 
                primaryTypographyProps={{ sx: textStyle() }}
              />
            </ListItemButton>
          </ListItem>

          {/* DTE MH (submenu) */}
          <ListItem disablePadding>
            <ListItemButton onClick={handleSubmenuClick}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <ReceiptIcon sx={iconStyle()} />
              </ListItemIcon>
              <ListItemText 
                primary="Documentos" 
                primaryTypographyProps={{ sx: textStyle() }}
              />
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
                    <DescriptionIcon sx={{ fontSize: '1rem' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Facturas Electrónicas" 
                    primaryTypographyProps={{ sx: { fontSize: '0.8rem' } }}
                  />
              </ListItemButton>

              <ListItemButton
                sx={{ pl: 4 }}
                selected={pathname === "/dashboard/notas-credito"}
                onClick={() => goTo("/dashboard/notas-credito")}
              >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <RotateLeftIcon sx={{ fontSize: '1rem' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Notas de Crédito" 
                    primaryTypographyProps={{ sx: { fontSize: '0.8rem' } }}
                  />
              </ListItemButton>

              <ListItemButton
                sx={{ pl: 4 }}
                selected={pathname === "/dashboard/nominas"}
                onClick={() => goTo("/dashboard/nominas")}
              >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <ChecklistIcon sx={{ fontSize: '1rem' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Nóminas" 
                    primaryTypographyProps={{ sx: { fontSize: '0.8rem' } }}
                  />
              </ListItemButton>

              <ListItemButton
                sx={{ pl: 4 }}
                selected={pathname === "/dashboard/ingresoFactura"}
                onClick={() => goTo("/dashboard/ingresoFactura")}
              >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <AddIcon sx={{ fontSize: '1rem' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Ingreso Factura" 
                    primaryTypographyProps={{ sx: { fontSize: '0.8rem' } }}
                  />
              </ListItemButton>
            </List>
          </Collapse>

          {/* CAJA CHICA (submenu) */}
          <ListItem disablePadding>
            <ListItemButton onClick={handleCajaChicaClick}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AccountBalanceWalletIcon sx={iconStyle()} />
              </ListItemIcon>
              <ListItemText 
                primary="Caja Chica" 
                primaryTypographyProps={{ sx: textStyle() }}
              />
              {openCajaChica ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openCajaChica} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                selected={pathname === "/dashboard/caja-chica"}
                onClick={() => goTo("/dashboard/caja-chica")}
              >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <AttachMoneyIcon sx={{ fontSize: '1rem' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Nóminas de Gastos" 
                    primaryTypographyProps={{ sx: { fontSize: '0.8rem' } }}
                  />
              </ListItemButton>

              <ListItemButton
                sx={{ pl: 4 }}
                selected={pathname === "/dashboard/rinde-gastos"}
                onClick={() => goTo("/dashboard/rinde-gastos")}
              >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <HistoryIcon sx={{ fontSize: '1rem' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Rinde Gastos" 
                    primaryTypographyProps={{ sx: { fontSize: '0.8rem' } }}
                  />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Usuarios */}
          <ListItem disablePadding>
            <ListItemButton
              selected={pathname === "/dashboard/usuarios"}
              onClick={() => goTo("/dashboard/usuarios")}
              sx={navButtonStyle()}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <PeopleIcon sx={iconStyle()} />
              </ListItemIcon>
              <ListItemText 
                primary="Usuarios" 
                primaryTypographyProps={{ sx: textStyle() }}
              />
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
                <SettingsIcon sx={iconStyle()} />
              </ListItemIcon>
              <ListItemText 
                primary="Configuración" 
                primaryTypographyProps={{ sx: textStyle() }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Separador para módulos en Hibernación */}
      <Divider sx={{ my: 2 }}>
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            px: 2, 
            bgcolor: 'background.paper',
            textDecoration: 'underline',
            textDecorationColor: 'primary.main',
            textUnderlineOffset: 4
          }}
        >
          Módulos en Hibernación (Demo)
        </Typography>
      </Divider>

      {/* Módulos en Hibernación */}
      <Box>
        <List>
          {/* BODEGA (submenu) - DEMO */}
          <ListItem disablePadding>
            <ListItemButton onClick={handleBodegaClick}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <InventoryIcon sx={iconStyle()} />
              </ListItemIcon>
              <ListItemText 
                primary="Bodega" 
                primaryTypographyProps={{ sx: textStyle() }}
              />
              <Chip 
                label="Demo" 
                size="small" 
                color="info" 
                variant="outlined"
                sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
              />
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
                    <HomeIcon sx={{ fontSize: '1rem' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Inicio" 
                    primaryTypographyProps={{ sx: { fontSize: '0.8rem' } }}
                  />
              </ListItemButton>

              <ListItemButton
                sx={{ pl: 4 }}
                selected={pathname === "/dashboard/bodega/nuevo-movimiento"}
                onClick={() => goTo("/dashboard/bodega/nuevo-movimiento")}
              >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <AddIcon sx={{ fontSize: '1rem' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Nuevo Movimiento" 
                    primaryTypographyProps={{ sx: { fontSize: '0.8rem' } }}
                  />
              </ListItemButton>

              <ListItemButton
                sx={{ pl: 4 }}
                selected={pathname === "/dashboard/bodega/stock-general"}
                onClick={() => goTo("/dashboard/bodega/stock-general")}
              >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <StorageIcon sx={{ fontSize: '1rem' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Stock General" 
                    primaryTypographyProps={{ sx: { fontSize: '0.8rem' } }}
                  />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Auditoría de Cartelería - DEMO */}
          <ListItem disablePadding>
            <ListItemButton
              selected={pathname === "/dashboard/auditoria-carteleria"}
              onClick={() => goTo("/dashboard/auditoria-carteleria")}
              sx={navButtonStyle()}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AssessmentIcon sx={iconStyle()} />
              </ListItemIcon>
              <ListItemText 
                primary="Auditoría de Cartelería" 
                primaryTypographyProps={{ sx: textStyle() }}
              />
              <Chip 
                label="Demo" 
                size="small" 
                color="info" 
                variant="outlined"
                sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
              />
            </ListItemButton>
          </ListItem>

          {/* Vencimientos - DEMO */}
          <ListItem disablePadding>
            <ListItemButton
              selected={pathname === "/dashboard/vencimientos"}
              onClick={() => goTo("/dashboard/vencimientos")}
              sx={navButtonStyle()}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <QrCodeScannerIcon sx={iconStyle()} />
              </ListItemIcon>
              <ListItemText 
                primary="Vencimientos" 
                primaryTypographyProps={{ sx: textStyle() }}
              />
              <Chip 
                label="Demo" 
                size="small" 
                color="info" 
                variant="outlined"
                sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
              />
            </ListItemButton>
          </ListItem>

          {/* Control de Vencimientos - DEMO */}
          <ListItem disablePadding>
            <ListItemButton
              selected={pathname === "/dashboard/control-vencimientos"}
              onClick={() => goTo("/dashboard/control-vencimientos")}
              sx={navButtonStyle()}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AssessmentIcon sx={iconStyle()} />
              </ListItemIcon>
              <ListItemText 
                primary="Control de Vencimientos" 
                primaryTypographyProps={{ sx: textStyle() }}
              />
              <Chip 
                label="Demo" 
                size="small" 
                color="info" 
                variant="outlined"
                sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
              />
            </ListItemButton>
          </ListItem>

          {/* Lector DTE - DEMO */}
          <ListItem disablePadding>
            <ListItemButton
              selected={pathname === "/dashboard/lector-dte"}
              onClick={() => goTo("/dashboard/lector-dte")}
              sx={navButtonStyle()}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <ReceiptIcon sx={iconStyle()} />
              </ListItemIcon>
              <ListItemText 
                primary="Lector DTE" 
                primaryTypographyProps={{ sx: textStyle() }}
              />
              <Chip 
                label="Demo" 
                size="small" 
                color="info" 
                variant="outlined"
                sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
              />
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
        <Link
          href="https://github.com/Nandem1"
          target="_blank"
          underline="hover"
        >
          Nandev
        </Link>
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

function iconStyle() {
  return { fontSize: '1.1rem' };
}

function textStyle() {
  return { fontSize: '0.875rem' };
}
