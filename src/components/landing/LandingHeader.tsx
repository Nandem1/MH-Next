"use client";

import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box, 
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useScrollTrigger,
  Slide
} from "@mui/material";
import { 
  Menu as MenuIcon
} from "@mui/icons-material";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Props {
  window?: () => Window;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function LandingHeader(props: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: 'Locales', href: '#locales' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Ofertas', href: '#productos' },
    { label: 'Trabaja con nosotros', href: '#trabajo' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', py: 2 }}>
             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
         <Box sx={{ position: 'relative', width: 120, height: 40 }}>
           <Image
             src="/assets/multihouse-logo-black.png"
             alt="Mercadohouse"
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
       </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton 
              sx={{ textAlign: 'center', py: 2 }}
              component="a"
              href={item.href}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <HideOnScroll {...props}>
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{ 
            backgroundColor: 'background.paper',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
            <Toolbar sx={{ 
              minHeight: 64,
              justifyContent: 'space-between',
              px: 0
            }}>
                             {/* Logo */}
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                 <Box sx={{ position: 'relative', width: 120, height: 40 }}>
                   <Image
                     src="/assets/multihouse-logo-black.png"
                     alt="Mercadohouse"
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
               </Box>

              {/* Desktop Navigation */}
              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {navItems.map((item) => (
                    <Button
                      key={item.label}
                      component="a"
                      href={item.href}
                      sx={{
                        color: 'text.secondary',
                        px: 2,
                        py: 1,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        '&:hover': {
                          color: 'text.primary',
                          backgroundColor: 'transparent'
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Box>
              )}

              {/* Desktop Actions */}
              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    component={Link}
                    href="/login"
                    sx={{
                      color: 'text.secondary',
                      px: 2,
                      py: 1,
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      '&:hover': {
                        color: 'text.primary',
                        backgroundColor: 'transparent'
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      px: 3,
                      py: 1,
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      borderRadius: 1,
                      textTransform: 'none',
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none'
                      }
                    }}
                  >
                    Contacto
                  </Button>
                </Box>
              )}

              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  onClick={handleDrawerToggle}
                  sx={{ 
                    color: 'text.primary',
                    p: 1
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            backgroundColor: 'background.paper',
            borderRight: `1px solid ${theme.palette.divider}`
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
