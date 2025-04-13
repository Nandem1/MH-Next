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
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import { useRouter, usePathname } from "next/navigation";
import { useMediaQuery } from "@mui/material";

const drawerWidth = 240;

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export function Sidebar({ mobileOpen, handleDrawerToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width:900px)");

  const navItems = [
    { text: "Inicio", icon: <DashboardIcon />, path: "/dashboard/inicio" },
    { text: "Facturas", icon: <ReceiptIcon />, path: "/dashboard/facturas" },
    { text: "Usuarios", icon: <PeopleIcon />, path: "/dashboard/usuarios" },
    {
      text: "Configuración",
      icon: <SettingsIcon />,
      path: "/dashboard/configuracion",
    },
  ];

  const drawer = (
    <>
      <Toolbar />
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                router.push(item.path);
                if (isMobile) handleDrawerToggle(); // 📱 Cierra solo en mobile
              }}
              selected={pathname === item.path}
              sx={{
                "&.Mui-selected": {
                  transition: "background-color 0.3s ease",
                  backgroundColor: "primary.main",
                  color: "#0a0a0a",
                  "&:hover": {
                    backgroundColor: "#e6c235",
                  },
                },
                "&:hover": {
                  bgcolor: "rgba(255, 217, 61, 0.08)", // 🎨 Muted Yellow 8% opacidad
                  transition: "background-color 0.3s ease",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: pathname === item.path ? "#fff" : "inherit",
                  minWidth: "40px",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "background.paper",
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "background.paper",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
}
