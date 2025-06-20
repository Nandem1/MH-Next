// src/components/layout/Sidebar.tsx
"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import { useRouter, usePathname } from "next/navigation";
import { useMediaQuery } from "@mui/material";
import { drawerWidth } from "@/constants/layout";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export function Sidebar({ mobileOpen, handleDrawerToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width:900px)");
  const { logout, usuario } = useAuth();

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

  const navItems = [
    { text: "Inicio", icon: <DashboardIcon />, path: "/dashboard/inicio" },
    { text: "Facturas", icon: <ReceiptIcon />, path: "/dashboard/facturas" },
    { text: "ZebrAI", icon: <ReceiptIcon />, path: "/dashboard/zebrai" },
    { text: "Usuarios", icon: <PeopleIcon />, path: "/dashboard/usuarios" },
    { text: "Lector DTE", icon: <ReceiptIcon />, path: "/dashboard/lector-dte" },
    { text: "Configuración", icon: <SettingsIcon />, path: "/dashboard/configuracion" },
  ];

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
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => {
                  router.push(item.path);
                  if (isMobile) handleDrawerToggle();
                }}
                selected={pathname === item.path}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "#0a0a0a",
                    "&:hover": { backgroundColor: "#e6c235" },
                  },
                  "&:hover": {
                    bgcolor: "rgba(255, 217, 61, 0.08)",
                    transition: "background-color 0.3s ease",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: pathname === item.path ? "#fff" : "inherit",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
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
