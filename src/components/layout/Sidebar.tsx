"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
  Divider,
  Box,
  Typography,
  Button,
  Link as MuiLink,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DescriptionIcon from "@mui/icons-material/Description";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import ChecklistIcon from "@mui/icons-material/Checklist";

import { useRouter, usePathname } from "next/navigation";
import { useMediaQuery } from "@mui/material";
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

  const handleSubmenuClick = () => setOpenDTE(!openDTE);

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
      {!isMobile && <Toolbar />}
      {isMobile && usuario?.nombre && (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
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
            fullWidth
            sx={{ mt: 1, textTransform: "none" }}
          >
            Cerrar sesión
          </Button>
        </Box>
      )}

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
        <MuiLink
          href="https://github.com/Nandem1"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ color: "primary.main", fontWeight: 500 }}
        >
          Nandev
        </MuiLink>
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
