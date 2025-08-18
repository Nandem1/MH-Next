"use client";

import { 
  Box, 
  Container, 
  Typography, 
  Grid,
  useTheme
} from "@mui/material";
import { 
  LocationOn, 
  Phone, 
  AccessTime
} from "@mui/icons-material";
import Image from "next/image";

export default function LandingFooter() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        borderTop: `1px solid ${theme.palette.divider}`,
        pt: { xs: 8, md: 12 },
        pb: { xs: 4, md: 6 }
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
        {/* Main Footer Content */}
        <Grid container spacing={4} sx={{ mb: { xs: 6, md: 8 }, justifyContent: 'center' }}>
          {/* Brand */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
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
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mb: 3,
                lineHeight: 1.6,
                fontSize: '0.875rem'
              }}
            >
              Tu supermercado de confianza en La Serena y Coquimbo con más de 15 años sirviendo a la comunidad. 
              Calidad, frescura y el mejor servicio en nuestros 3 locales de la región.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ color: 'primary.main', fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                Línea de atención: (+56) 51 2 2000-0000
              </Typography>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              component="h4"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: 'text.primary',
                fontSize: '1rem'
              }}
            >
              Enlaces rápidos
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {[
                { label: 'Nuestros locales', href: '#locales' },
                { label: 'Quiénes somos', href: '#nosotros' },
                { label: 'Ofertas', href: '#productos' },
                { label: 'Trabaja con nosotros', href: '#trabajo' }
              ].map((link) => (
                <Box component="li" key={link.label} sx={{ mb: 2 }}>
                  <Typography
                    component="a"
                    href={link.href}
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: 'primary.main'
                      },
                      transition: 'color 0.2s ease'
                    }}
                  >
                    {link.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Customer Service */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              component="h4"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: 'text.primary',
                fontSize: '1rem'
              }}
            >
              Servicio al cliente
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {[
                'Preguntas frecuentes',
                'Políticas de devolución',
                'Términos y condiciones',
                'Privacidad'
              ].map((item) => (
                <Box component="li" key={item} sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: 'primary.main'
                      },
                      transition: 'color 0.2s ease'
                    }}
                  >
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Locales Info */}
        <Box
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            pt: { xs: 4, md: 6 }
          }}
        >
          <Grid container spacing={4} sx={{ mb: { xs: 4, md: 6 }, justifyContent: 'center' }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography
                  variant="h6"
                  component="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: 'primary.main',
                    fontSize: '1rem'
                  }}
                >
                  SUPERMERCADO MULTIHOUSE
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: { xs: 'center', md: 'flex-start' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ color: 'text.secondary', fontSize: 16 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      Narciso Herrera 2575, La Cantera, Coquimbo
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime sx={{ color: 'text.secondary', fontSize: 16 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      Lun-Dom 8:00 - 22:00
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography
                  variant="h6"
                  component="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: 'primary.main',
                    fontSize: '1rem'
                  }}
                >
                  SUPERMERCADO LAS COMPAÑÍAS
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: { xs: 'center', md: 'flex-start' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ color: 'text.secondary', fontSize: 16 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      Av Libertador 1476, Las Compañías, La Serena
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime sx={{ color: 'text.secondary', fontSize: 16 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      Lun-Dom 7:30 - 23:00
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography
                  variant="h6"
                  component="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: 'primary.main',
                    fontSize: '1rem'
                  }}
                >
                  MULTIMERCADO AZABACHE
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: { xs: 'center', md: 'flex-start' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ color: 'text.secondary', fontSize: 16 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      Av Balmaceda 599, La Serena
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime sx={{ color: 'text.secondary', fontSize: 16 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      Lun-Dom 8:30 - 21:30
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Copyright */}
          <Box
            sx={{
              textAlign: 'center',
              pt: { xs: 3, md: 4 },
              borderTop: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
                mb: 1
              }}
            >
              &copy; 2025 Mercado House SPA. Todos los derechos reservados.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Typography
                component="a"
                href="/politica-privacidad"
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '0.75rem',
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
              >
                Política de Privacidad
              </Typography>
              <Typography
                component="a"
                href="/terminos-condiciones"
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '0.75rem',
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
              >
                Términos y Condiciones
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
