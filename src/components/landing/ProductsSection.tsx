"use client";

import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  Chip,
  Button,
  TextField,
  useTheme
} from "@mui/material";
import Image from "next/image";
import { 
  LocationOn, 
  Percent, 
  AccessTime,
  Email
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useInViewAnimations } from "@/hooks/useAnimations";

export default function ProductsSection() {
  const theme = useTheme();

  // Animaciones individuales por elemento cuando entran en vista
  const { ref: headerRef, ...headerInView } = useInViewAnimations({ threshold: 0.3 });
  
  // Hooks para cada local (llamados al inicio del componente)
  const { ref: local1Ref, ...local1InView } = useInViewAnimations({ threshold: 0.2 });
  const { ref: local2Ref, ...local2InView } = useInViewAnimations({ threshold: 0.2 });
  const { ref: local3Ref, ...local3InView } = useInViewAnimations({ threshold: 0.2 });
  
  // Hooks para cada fila de productos (llamados al inicio del componente)
  const { ref: productos1Ref, ...productos1InView } = useInViewAnimations({ threshold: 0.2 });
  const { ref: productos2Ref, ...productos2InView } = useInViewAnimations({ threshold: 0.2 });
  const { ref: productos3Ref, ...productos3InView } = useInViewAnimations({ threshold: 0.2 });
  
  // Hooks para el newsletter (llamado al inicio del componente)
  const { ref: newsletterRef, ...newsletterInView } = useInViewAnimations({ threshold: 0.3 });

  const ofertasPorLocal = [
    {
      local: "SUPERMERCADO MULTIHOUSE",
      ubicacion: "Narciso Herrera 2575, La Cantera, Coquimbo",
      ofertas: [
        {
          producto: "CAJA DE 24 UNID REFRESKIDS AMBROSOLI 180ML",
          precioOriginal: 4680,
          precioOferta: 4200,
          descuento: 10,
          imagen: "/assets/blank-white-7sn5o1woonmklx1h.jpg",
          categoria: "Bebidas"
        },
        {
          producto: "HELADOS DE INVIERNO 10UNID",
          precioOriginal: 2490,
          precioOferta: 1790,
          descuento: 28,
          imagen: "/assets/blank-white-7sn5o1woonmklx1h.jpg",
          categoria: "Congelados"
        },
        {
          producto: "MANGA DE PAPAS MOMS LISA 10UNID",
          precioOriginal: 1990,
          precioOferta: 1690,
          descuento: 15,
          imagen: "/assets/blank-white-7sn5o1woonmklx1h.jpg",
          categoria: "Snacks"
        },
        {
          producto: "DISPLAY DE CEREAL BAR 20UNID",
          precioOriginal: 3600,
          precioOferta: 2990,
          descuento: 17,
          imagen: "/assets/blank-white-7sn5o1woonmklx1h.jpg",
          categoria: "Cereales"
        },
        {
          producto: "DETERGENTE LÍQUIDO ARIEL 1.8LT",
          precioOriginal: 8390,
          precioOferta: 6990,
          descuento: 17,
          imagen: "/assets/blank-white-7sn5o1woonmklx1h.jpg",
          categoria: "Limpieza"
        },
        {
          producto: "TÉ MILDRED 100 BOLSAS",
          precioOriginal: 3690,
          precioOferta: 2690,
          descuento: 27,
          imagen: "/assets/blank-white-7sn5o1woonmklx1h.jpg",
          categoria: "Bebidas"
        },
        {
          producto: "FIDEOS CAROZZI 400G",
          precioOriginal: 990,
          precioOferta: 890,
          descuento: 10,
          imagen: "/assets/blank-white-7sn5o1woonmklx1h.jpg",
          categoria: "Pastas"
        },
        {
          producto: "BEBIDAS PIRI 3LT",
          precioOriginal: 1190,
          precioOferta: 990,
          descuento: 17,
          imagen: "/assets/blank-white-7sn5o1woonmklx1h.jpg",
          categoria: "Bebidas"
        }
      ]
    },
    {
      local: "SUPERMERCADO LAS COMPAÑÍAS",
      ubicacion: "Av Libertador 1476, Las Compañías, La Serena",
      ofertas: [
        {
          producto: "SALMÓN FRESCO FILETE 1KG",
          precioOriginal: 12990,
          precioOferta: 8990,
          descuento: 31,
          imagen: "/assets/blank-white-7sn5o1woonmklx1h.jpg",
          categoria: "Pescadería"
        },
        {
          producto: "ACEITE DE OLIVA EXTRA VIRGEN",
          precioOriginal: 4990,
          precioOferta: 3490,
          descuento: 30,
          imagen: "/assets/blank-white-7sn5o1woonmklx1h.jpg",
          categoria: "Abarrotes"
        },
        {
          producto: "QUESO MANCHEGO CURADO",
          precioOriginal: 8990,
          precioOferta: 6990,
          descuento: 22,
          imagen: "/assets/blank-white-7sn5o1woonmklx1h.jpg",
          categoria: "Lácteos"
        },
        {
          producto: "TOMATES CHERRY ORGÁNICOS",
          precioOriginal: 2490,
          precioOferta: 1790,
          descuento: 28,
          imagen: "/assets/blank-white-7sn5o1woonmklx1h.jpg",
          categoria: "Frutas y Verduras"
        }
      ]
    },
    {
      local: "MULTIMERCADO AZABACHE",
      ubicacion: "Av Balmaceda 599, La Serena",
      ofertas: [
        {
          producto: "LOMO VETADO PREMIUM 1KG",
          precioOriginal: 15990,
          precioOferta: 11990,
          descuento: 25,
          imagen: "/assets/blank-white-7sn5o1woonmklx1h.jpg",
          categoria: "Carnicería"
        },
        {
          producto: "MIEL DE ABEJA PURA 500G",
          precioOriginal: 3990,
          precioOferta: 2990,
          descuento: 25,
          imagen: "/assets/blank-white-7sn5o1woonmklx1h.jpg",
          categoria: "Abarrotes"
        },
        {
          producto: "CAMARONES JUMBO 500G",
          precioOriginal: 9990,
          precioOferta: 7490,
          descuento: 25,
          imagen: "/assets/blank-white-7sn5o1woonmklx1h.jpg",
          categoria: "Pescadería"
        },
        {
          producto: "CROISSANTS ARTESANALES X6",
          precioOriginal: 3490,
          precioOferta: 2490,
          descuento: 29,
          imagen: "/assets/blank-white-7sn5o1woonmklx1h.jpg",
          categoria: "Panadería"
        }
      ]
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Box
      id="productos"
      sx={{
        py: { xs: 12, md: 16 },
        backgroundColor: 'background.default'
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
            Nuestras ofertas mensuales
          </Typography>
          <Typography
            variant="h3"
            sx={{
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
              mb: 2,
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.6
            }}
          >
            Descubre las mejores ofertas de cada local con productos frescos y de calidad a precios especiales en La Serena y Coquimbo
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <AccessTime sx={{ color: 'primary.main', fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              Ofertas válidas hasta fin de mes
            </Typography>
          </Box>
            </Box>
        </motion.div>

        {/* Ofertas por Local */}
        <Box sx={{ space: 3 }}>
          {ofertasPorLocal.map((localData, localIndex) => {
            // Usar los hooks predefinidos según el índice
            const localRefs = [local1Ref, local2Ref, local3Ref];
            const localInViews = [local1InView, local2InView, local3InView];
            
            return (
              <motion.div
                key={localData.local}
                ref={localRefs[localIndex]}
                {...localInViews[localIndex]}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Box sx={{ mb: { xs: 8, md: 12 } }}>
                  {/* Local Header */}
                  <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography
                      variant="h3"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: 'primary.main',
                        fontSize: { xs: '1.5rem', md: '2rem' }
                      }}
                    >
                      {localData.local}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <LocationOn sx={{ color: 'text.secondary', fontSize: 18 }} />
                      <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                        {localData.ubicacion}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Productos Grid */}
                  <motion.div
                    ref={[productos1Ref, productos2Ref, productos3Ref][localIndex]}
                    {...[productos1InView, productos2InView, productos3InView][localIndex]}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
                      {localData.ofertas.map((oferta, index) => (
                        <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
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
                                overflow: 'hidden',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  boxShadow: `0 12px 40px rgba(0, 0, 0, 0.15)`
                                }
                              }}
                            >
                      <Box sx={{ position: 'relative', height: 200 }}>
                        <Image
                          src={oferta.imagen}
                          alt={oferta.producto}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          style={{
                            objectFit: 'cover',
                            transition: 'transform 0.2s ease',
                          }}
                          loading="lazy"
                        />
                        <Chip
                          icon={<Percent />}
                          label={`-${oferta.descuento}%`}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            fontWeight: 600,
                            fontSize: '0.75rem'
                          }}
                        />
                        <Chip
                          label={oferta.categoria}
                          variant="outlined"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            borderColor: 'divider',
                            color: 'text.secondary',
                            backgroundColor: 'background.paper',
                            fontSize: '0.75rem'
                          }}
                        />
                      </Box>

                      <CardContent sx={{ p: 3 }}>
                        <Typography
                          variant="h4"
                          component="h4"
                          sx={{
                            fontWeight: 600,
                            mb: 2,
                            color: 'text.primary',
                            lineHeight: 1.3,
                            fontSize: '1rem'
                          }}
                        >
                          {oferta.producto}
                        </Typography>

                        <Box sx={{ space: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'text.secondary',
                                textDecoration: 'line-through',
                                fontSize: '0.875rem'
                              }}
                            >
                              {formatPrice(oferta.precioOriginal)}
                            </Typography>
                            <Typography
                              variant="h4"
                              sx={{
                                fontWeight: 700,
                                color: 'primary.main',
                                fontSize: '1.125rem'
                              }}
                            >
                              {formatPrice(oferta.precioOferta)}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              fontSize: '0.75rem'
                            }}
                          >
                            Ahorro: {formatPrice(oferta.precioOriginal - oferta.precioOferta)}
                          </Typography>
                        </Box>
                      </CardContent>
                            </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </motion.div>
                </Box>
              </motion.div>
            );
          })}
        </Box>

        {/* Newsletter */}
        <motion.div
          ref={newsletterRef}
          {...newsletterInView}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Box sx={{ mt: { xs: 8, md: 12 }, textAlign: 'center' }}>
            <Card
            sx={{
              maxWidth: '600px',
              mx: 'auto',
              p: { xs: 4, md: 6 },
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: 'background.paper',
              borderRadius: 2
            }}
          >
            <Typography
              variant="h4"
              component="h3"
              sx={{
                fontWeight: 600,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                fontSize: { xs: '1.5rem', md: '1.75rem' }
              }}
            >
              <Percent sx={{ color: 'primary.main' }} />
              ¿Quieres más ofertas?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 4,
                lineHeight: 1.6
              }}
            >
              Suscríbete a nuestro boletín y recibe las mejores ofertas directamente en tu email
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, maxWidth: '400px', mx: 'auto' }}>
              <TextField
                type="email"
                placeholder="Tu email"
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              <Button
                variant="contained"
                startIcon={<Email />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none'
                  }
                }}
              >
                Suscribirse
              </Button>
            </Box>
          </Card>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
