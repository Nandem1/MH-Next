"use client";

import { 
  Box, 
  Container, 
  Typography, 
  Grid,
  useTheme
} from "@mui/material";
import { 
  People, 
  EmojiEvents, 
  LocalShipping, 
  Favorite
} from "@mui/icons-material";

export default function AboutSection() {
  const theme = useTheme();

  const valores = [
    {
      icon: Favorite,
      titulo: "Calidad",
      descripcion: "Productos frescos y de la mejor calidad seleccionados cuidadosamente para satisfacer las necesidades de nuestros clientes"
    },
    {
      icon: People,
      titulo: "Comunidad",
      descripcion: "Comprometidos con servir a nuestras familias y vecinos, creando lazos fuertes con la comunidad local"
    },
    {
      icon: LocalShipping,
      titulo: "Accesibilidad",
      descripcion: "3 ubicaciones estratégicas en La Serena y Coquimbo para estar siempre cerca de ti"
    },
    {
      icon: EmojiEvents,
      titulo: "Experiencia",
      descripcion: "Más de 15 años brindando el mejor servicio y atención personalizada a nuestros clientes"
    }
  ];

  return (
    <Box
      id="nosotros"
      sx={{
        py: { xs: 12, md: 16 },
        backgroundColor: 'background.paper',
        borderTop: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`
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
            Quiénes somos
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.6,
              fontSize: { xs: '1rem', md: '1.125rem' }
            }}
          >
            Somos Mercadohouse, una empresa familiar que nació con la misión de ofrecer productos de calidad 
            a precios justos en La Serena y Coquimbo. Durante más de una década hemos crecido junto a nuestras comunidades, 
            convirtiéndonos en el supermercado de confianza de miles de familias de la región.
          </Typography>
        </Box>

        {/* Valores Grid */}
        <Grid container spacing={4} sx={{ mb: { xs: 8, md: 12 }, justifyContent: 'center' }}>
          {valores.map((valor) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={valor.titulo}>
              <Box sx={{ textAlign: 'center', px: 2 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    backgroundColor: 'primary.main',
                    mb: 3,
                    '&:hover': {
                      transform: 'scale(1.05)',
                      transition: 'transform 0.2s ease'
                    }
                  }}
                >
                  <valor.icon 
                    sx={{ 
                      fontSize: 28,
                      color: 'primary.contrastText'
                    }} 
                  />
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: 'text.primary',
                    fontSize: '1.125rem'
                  }}
                >
                  {valor.titulo}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.6,
                    fontSize: '0.875rem'
                  }}
                >
                  {valor.descripcion}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Stats */}
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 4, md: 8 },
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: 'primary.main',
                  fontSize: { xs: '2.5rem', md: '3rem' }
                }}
              >
                15+
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  letterSpacing: 1,
                  fontSize: '0.75rem'
                }}
              >
                Años de experiencia
              </Typography>
            </Box>
            
            <Box
              sx={{
                width: { xs: '40px', md: '1px' },
                height: { xs: '1px', md: '40px' },
                backgroundColor: 'divider'
              }}
            />
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: 'primary.main',
                  fontSize: { xs: '2.5rem', md: '3rem' }
                }}
              >
                3
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  letterSpacing: 1,
                  fontSize: '0.75rem'
                }}
              >
                Locales en la región
              </Typography>
            </Box>
            
            <Box
              sx={{
                width: { xs: '40px', md: '1px' },
                height: { xs: '1px', md: '40px' },
                backgroundColor: 'divider'
              }}
            />
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: 'primary.main',
                  fontSize: { xs: '2.5rem', md: '3rem' }
                }}
              >
                5000+
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  letterSpacing: 1,
                  fontSize: '0.75rem'
                }}
              >
                Familias atendidas
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
