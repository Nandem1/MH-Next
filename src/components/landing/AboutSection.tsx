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
import { motion } from "framer-motion";
import { useInViewAnimations } from "@/hooks/useAnimations";

export default function AboutSection() {
  const theme = useTheme();

  // Animaciones individuales por elemento cuando entran en vista
  const { ref: headerRef, ...headerInView } = useInViewAnimations({ threshold: 0.3 });
  
  // Hooks para los valores (llamados al inicio del componente)
  const { ref: valor1Ref, ...valor1InView } = useInViewAnimations({ threshold: 0.2 });
  const { ref: valor2Ref, ...valor2InView } = useInViewAnimations({ threshold: 0.2 });
  const { ref: valor3Ref, ...valor3InView } = useInViewAnimations({ threshold: 0.2 });
  const { ref: valor4Ref, ...valor4InView } = useInViewAnimations({ threshold: 0.2 });
  
  // Hooks para las estadísticas (llamados al inicio del componente)
  const { ref: stat1Ref, ...stat1InView } = useInViewAnimations({ threshold: 0.3 });
  const { ref: stat2Ref, ...stat2InView } = useInViewAnimations({ threshold: 0.3 });
  const { ref: stat3Ref, ...stat3InView } = useInViewAnimations({ threshold: 0.3 });

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
        <motion.div
          ref={headerRef}
          {...headerInView}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
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
              variant="h3"
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
        </motion.div>

        {/* Valores Grid */}
        <Grid container spacing={4} sx={{ mb: { xs: 8, md: 12 }, justifyContent: 'center' }}>
          {valores.map((valor, index) => {
            // Usar los hooks predefinidos según el índice
            const valorRefs = [valor1Ref, valor2Ref, valor3Ref, valor4Ref];
            const valorInViews = [valor1InView, valor2InView, valor3InView, valor4InView];
            
            return (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={valor.titulo}>
                <motion.div
                  ref={valorRefs[index]}
                  {...valorInViews[index]}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <Box sx={{ textAlign: 'center', px: 2 }}>
                    <motion.div
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        transition: { duration: 0.2, ease: "easeOut" }
                      }}
                    >
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
                          transition: 'transform 0.2s ease'
                        }}
                      >
                        <valor.icon 
                          sx={{ 
                            fontSize: 28,
                            color: 'primary.contrastText'
                          }} 
                        />
                      </Box>
                    </motion.div>
                    <Typography
                      variant="h3"
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
                </motion.div>
              </Grid>
            );
          })}
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
            <>
              <motion.div
                ref={stat1Ref}
                {...stat1InView}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                    <Box sx={{ textAlign: 'center' }}>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      >
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
                  </motion.div>
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
              </motion.div>
              
              <Box
                sx={{
                  width: { xs: '40px', md: '1px' },
                  height: { xs: '1px', md: '40px' },
                  backgroundColor: 'divider'
                }}
              />
              
                  <motion.div
                    ref={stat2Ref}
                    {...stat2InView}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      >
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
                  </motion.div>
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
              </motion.div>
              
              <Box
                sx={{
                  width: { xs: '40px', md: '1px' },
                  height: { xs: '1px', md: '40px' },
                  backgroundColor: 'divider'
                }}
              />
              
                  <motion.div
                    ref={stat3Ref}
                    {...stat3InView}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      >
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
                  </motion.div>
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
              </motion.div>
            </>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
