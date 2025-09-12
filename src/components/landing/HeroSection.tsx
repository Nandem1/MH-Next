"use client";

import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Grid,
  useTheme
} from "@mui/material";
import { 
  LocationOn, 
  AccessTime, 
  Phone,
  Visibility
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useInViewAnimations } from "@/hooks/useAnimations";

export default function HeroSection() {
  const theme = useTheme();

  // Animaciones individuales por elemento cuando entran en vista
  const { ref: titleRef, ...titleInView } = useInViewAnimations({ threshold: 0.3 });
  const { ref: subtitleRef, ...subtitleInView } = useInViewAnimations({ threshold: 0.3 });
  const { ref: buttonRef, ...buttonInView } = useInViewAnimations({ threshold: 0.3 });
  
  // Hooks para las cards de locales (llamados al inicio del componente)
  const { ref: card1Ref, ...card1InView } = useInViewAnimations({ threshold: 0.2 });
  const { ref: card2Ref, ...card2InView } = useInViewAnimations({ threshold: 0.2 });
  const { ref: card3Ref, ...card3InView } = useInViewAnimations({ threshold: 0.2 });

  const locales = [
    {
      nombre: "SUPERMERCADO MULTIHOUSE",
      direccion: "Narciso Herrera 2575, La Cantera, Coquimbo",
      horario: "Lun-Dom 8:00 - 22:00",
      telefono: "(+56) 51 2 234-5678"
    },
    {
      nombre: "SUPERMERCADO LAS COMPAÑÍAS",
      direccion: "Av Libertador 1476, Las Compañías, La Serena",
      horario: "Lun-Dom 7:30 - 23:00",
      telefono: "(+56) 51 2 345-6789"
    },
    {
      nombre: "MULTIMERCADO AZABACHE",
      direccion: "Av Balmaceda 599, La Serena",
      horario: "Lun-Dom 8:30 - 21:30",
      telefono: "(+56) 51 2 456-7890"
    }
  ];

  return (
    <Box
      id="locales"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'background.default',
        py: { xs: 8, md: 12 }
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        {/* Hero Content */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: { xs: 8, md: 12 },
          maxWidth: '900px',
          mx: 'auto'
        }}>
          <motion.div
            ref={titleRef}
            {...titleInView}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
                lineHeight: 1.1,
                color: 'text.primary',
                letterSpacing: '-0.02em'
              }}
            >
              Tu Supermercado de confianza
            </Typography>
          </motion.div>
          
          <motion.div
            ref={subtitleRef}
            {...subtitleInView}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Typography
              variant="h3"
              sx={{
                color: 'text.secondary',
                mb: 4,
                maxWidth: '700px',
                mx: 'auto',
                fontWeight: 400,
                lineHeight: 1.5,
                fontSize: { xs: '1.125rem', md: '1.25rem' }
              }}
            >
              Encuentra todo lo que necesitas en nuestros 3 locales estratégicamente ubicados en La Serena y Coquimbo. Productos frescos, calidad y el mejor servicio.
            </Typography>
          </motion.div>
          
          <motion.div
            ref={buttonRef}
            {...buttonInView}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              Ver catálogo
            </Button>
          </motion.div>
        </Box>

        {/* Locales Grid */}
        <Box sx={{ maxWidth: '1600px', mx: 'auto' }}>
          <Grid container spacing={5} sx={{ justifyContent: 'center' }}>
            {locales.map((local, index) => {
              // Usar los hooks predefinidos según el índice
              const cardRefs = [card1Ref, card2Ref, card3Ref];
              const cardInViews = [card1InView, card2InView, card3InView];
              
              return (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={local.nombre}>
                  <motion.div
                    ref={cardRefs[index]}
                    {...cardInViews[index]}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                  <Card
                    component={motion.div}
                    whileHover={{ 
                      y: -8,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                    sx={{
                      height: '100%',
                      transition: 'all 0.2s ease',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      backgroundColor: 'background.paper',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: `0 12px 40px rgba(0, 0, 0, 0.15)`
                      }
                    }}
                  >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h3"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        mb: 3,
                        color: 'text.primary',
                        textAlign: 'center',
                        fontSize: { xs: '1.125rem', md: '1.25rem' }
                      }}
                    >
                      {local.nombre}
                    </Typography>
                    
                    <Box sx={{ space: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <LocationOn sx={{ color: 'primary.main', mt: 0.5, flexShrink: 0, fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                          {local.direccion}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <AccessTime sx={{ color: 'primary.main', flexShrink: 0, fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {local.horario}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                        <Phone sx={{ color: 'primary.main', flexShrink: 0, fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {local.telefono}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      fullWidth
                      sx={{
                        borderColor: 'divider',
                        color: 'text.primary',
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'primary.main',
                          color: 'primary.contrastText'
                        }
                      }}
                    >
                      Ver ubicación
                    </Button>
                  </CardContent>
                  </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
