"use client";

import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  Grid,
  Button,
  useTheme
} from "@mui/material";
import { 
  People, 
  AccessTime, 
  TrendingUp, 
  Favorite, 
  CardGiftcard, 
  School
} from "@mui/icons-material";

export default function CareersSection() {
  const theme = useTheme();

  const beneficios = [
    {
      icon: AccessTime,
      titulo: "Horarios flexibles",
      descripcion: "Horarios que se adaptan a tu estilo de vida"
    },
    {
      icon: TrendingUp,
      titulo: "Crecimiento profesional",
      descripcion: "Oportunidades reales de desarrollo y ascenso"
    },
    {
      icon: Favorite,
      titulo: "Ambiente familiar",
      descripcion: "Equipo unido con excelente clima laboral"
    },
    {
      icon: CardGiftcard,
      titulo: "Beneficios adicionales",
      descripcion: "Descuentos especiales y bonos por desempeño"
    }
  ];

  const posiciones = [
    {
      titulo: "Cajero/a",
      ubicacion: "Todos los locales",
      tipo: "Tiempo completo/medio tiempo",
      descripcion: "Atención al cliente en cajas registradoras"
    },
    {
      titulo: "Repositor/a",
      ubicacion: "La Cantera, Libertador",
      tipo: "Tiempo completo",
      descripcion: "Mantener productos organizados y abastecidos"
    },
    {
      titulo: "Carnicero/a",
      ubicacion: "Balmaceda",
      tipo: "Tiempo completo",
      descripcion: "Preparación y atención en sección carnicería"
    },
    {
      titulo: "Supervisor/a",
      ubicacion: "Libertador",
      tipo: "Tiempo completo",
      descripcion: "Coordinar operaciones diarias del local"
    }
  ];

  return (
    <Box
      id="trabajo"
      sx={{
        py: { xs: 12, md: 16 },
        backgroundColor: 'background.paper',
        borderTop: `1px solid ${theme.palette.divider}`
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: { xs: 8, md: 12 },
          maxWidth: '800px',
          mx: 'auto'
        }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 3,
              color: 'text.primary',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              letterSpacing: '-0.02em'
            }}
          >
            Trabaja con nosotros
          </Typography>
          <Typography
            variant="h3"
            sx={{
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.6
            }}
          >
            Únete a nuestra familia y forma parte de un equipo comprometido con la excelencia en el servicio
          </Typography>
        </Box>

        {/* Content Grid */}
        <Grid container spacing={6} sx={{ mb: { xs: 8, md: 12 }, justifyContent: 'center' }}>
          {/* Beneficios */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Typography
              variant="h3"
              component="h3"
              sx={{
                fontWeight: 600,
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                fontSize: { xs: '1.5rem', md: '1.75rem' }
              }}
            >
              <School sx={{ color: 'primary.main' }} />
              Nuestros beneficios
            </Typography>
            <Grid container spacing={3}>
              {beneficios.map((beneficio) => (
                <Grid size={{ xs: 12, sm: 6 }} key={beneficio.titulo}>
                  <Box sx={{ display: 'flex', gap: 3, p: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        backgroundColor: 'primary.main',
                        flexShrink: 0
                      }}
                    >
                      <beneficio.icon sx={{ color: 'primary.contrastText', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="h4"
                        component="h4"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: 'text.primary',
                          fontSize: '1rem'
                        }}
                      >
                        {beneficio.titulo}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.6,
                          fontSize: '0.875rem'
                        }}
                      >
                        {beneficio.descripcion}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Posiciones */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Typography
              variant="h3"
              component="h3"
              sx={{
                fontWeight: 600,
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                fontSize: { xs: '1.5rem', md: '1.75rem' }
              }}
            >
              <People sx={{ color: 'primary.main' }} />
              Posiciones disponibles
            </Typography>
            <Box sx={{ space: 2 }}>
              {posiciones.map((posicion) => (
                <Card
                  key={posicion.titulo}
                  sx={{
                    mb: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: 'background.default',
                    transition: 'all 0.2s ease',
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateX(2px)'
                    }
                  }}
                >
                  <CardHeader
                    title={
                      <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1rem' }}>
                        {posicion.titulo}
                      </Typography>
                    }
                    subheader={
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                          📍 {posicion.ubicacion}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                          ⏰ {posicion.tipo}
                        </Typography>
                      </Box>
                    }
                    sx={{ pb: 1, px: 3, pt: 3 }}
                  />
                  <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        mb: 3,
                        lineHeight: 1.6,
                        fontSize: '0.875rem'
                      }}
                    >
                      {posicion.descripcion}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: 'divider',
                        color: 'text.primary',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'primary.main',
                          color: 'primary.contrastText'
                        }
                      }}
                    >
                      Postular
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* CTA */}
        <Box sx={{ textAlign: 'center' }}>
          <Card
            sx={{
              maxWidth: '600px',
              mx: 'auto',
              p: { xs: 4, md: 6 },
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: 'background.default',
              borderRadius: 2
            }}
          >
            <Typography
              variant="h4"
              component="h3"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: 'text.primary',
                fontSize: { xs: '1.5rem', md: '1.75rem' }
              }}
            >
              ¿No encuentras lo que buscas?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 4,
                lineHeight: 1.6
              }}
            >
              Envía tu CV y nos pondremos en contacto contigo cuando surjan nuevas oportunidades
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              Enviar CV espontáneo
            </Button>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
