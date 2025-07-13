"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CarteleriaAuditResult } from "@/types/carteleria";

interface CarteleriaPreviewProps {
  item: CarteleriaAuditResult;
}

export function CarteleriaPreview({ item }: CarteleriaPreviewProps) {
  const formatPriceNumber = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      minimumFractionDigits: 0,
    }).format(price);
  };

  const nombreProducto = 
    item.carteleria.producto || 
    item.carteleria.nombre_producto || 
    item.carteleria.nombre || 
    item.carteleria.nombre_pack ||
    item.carteleria.nombre_articulo ||
    "Producto de prueba";

  const descripcionProducto = 
    item.carteleria.descripcion || 
    item.carteleria.tipo_carteleria || 
    "Y SU GRAMAJE";

  return (
    <Box
      sx={{
        width: 900,
        height: 700,
        bgcolor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "80px 1fr",
          gridTemplateRows: "80px 60px 200px 80px 100px",
          width: 800,
          height: 600,
          bgcolor: "#fff",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Banner gris - Columna 1, filas 1-5 */}
        <Box
          sx={{
            gridColumn: "1",
            gridRow: "1 / 6",
            bgcolor: "#F2F2F2",
            border: "2px solid #000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Calibri, sans-serif",
              fontSize: 70,
              fontWeight: 700,
              color: "#FF0000",
              transform: "rotate(-90deg)",
            }}
          >
            ¡OFERTA!
          </Typography>
        </Box>

        {/* Contenedor principal del contenido con borde externo */}
        <Box
          sx={{
            gridColumn: "2",
            gridRow: "1 / 6",
            border: "2px solid #000",
            display: "grid",
            gridTemplateRows: "80px 60px 200px 80px 100px",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {/* Título principal - Fila 1 */}
          <Box
            sx={{
              gridRow: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Arial Rounded MT Bold', Arial, sans-serif",
                fontSize: 36,
                fontWeight: 900,
                lineHeight: 1.2,
                color: "#000",
                px: 2,
              }}
            >
              {nombreProducto}
            </Typography>
          </Box>

          {/* Subtítulo - Fila 2 */}
          <Box
            sx={{
              gridRow: "2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Arial Rounded MT Bold', Arial, sans-serif",
                fontSize: 36,
                fontWeight: 900,
                lineHeight: 1.2,
                color: "#000",
              }}
            >
              {descripcionProducto}
            </Typography>
          </Box>

          {/* Precio grande - Fila 3 */}
          <Box
            sx={{
              gridRow: "3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                gap: 1,
              }}
            >
              {/* Signo peso */}
              <Typography
                component="span"
                sx={{
                  fontFamily: "Calibri, sans-serif",
                  fontSize: 48,
                  fontWeight: 900,
                  color: "#000",
                }}
              >
                $
              </Typography>

              {/* Número */}
              <Typography
                component="span"
                sx={{
                  fontFamily: "Calibri, sans-serif",
                  fontSize: 160,
                  fontWeight: 900,
                  color: "#FF0000",
                  lineHeight: 1,
                }}
              >
                {formatPriceNumber(item.carteleria.carteleria_precio_detalle ?? 0)}
              </Typography>

              {/* Sufijo C/U */}
              <Typography
                component="span"
                sx={{
                  fontFamily: "Calibri, sans-serif",
                  fontSize: 48,
                  fontWeight: 900,
                  color: "#000",
                }}
              >
                C/U
              </Typography>
            </Box>
          </Box>

          {/* Leyenda "PRECIO ÚNICO" - Fila 4 */}
          <Box
            sx={{
              gridRow: "4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Calibri, sans-serif",
                fontSize: 50,
                fontWeight: 900,
                lineHeight: 1.2,
                color: "#000",
              }}
            >
              PRECIO ÚNICO
            </Typography>
          </Box>

          {/* Logo - Fila 5 */}
          <Box
            sx={{
              gridRow: "5 / 6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              outline: "none",
              height: "100%",
            }}
          >
            <Box
              component="img"
              src="/assets/multihouse-logo.jpg"
              alt="Multihouse"
              sx={{
                height: 80,
                width: "auto",
                objectFit: "contain",
                border: "none",
                outline: "none",
                display: "block",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
} 