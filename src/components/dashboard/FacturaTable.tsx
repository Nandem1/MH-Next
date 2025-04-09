"use client";

import { useFacturas } from "@/hooks/useFacturas";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import styles from "./FacturaTable.module.css";
import { formatearRut } from "@/utils/formatearRut";

export function FacturaTable() {
  const { data, isLoading, error } = useFacturas();
  const isMobile = useMediaQuery("(max-width:600px)");

  if (isLoading)
    return (
      <div className="flex justify-center p-4">
        <CircularProgress />
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-500">Error cargando facturas</div>
    );

  if (isMobile) {
    // Vista para móviles: Cards
    return (
      <div className="p-4 space-y-4">
        {data?.map((factura) => (
          <Card
            key={factura.id}
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 2,
              boxShadow: 3,
            }}
            className={styles.facturaCard}
          >
            <CardMedia
              component="img"
              height="180"
              image={factura.image_url}
              alt={`Factura ${factura.folio}`}
              sx={{
                objectFit: "cover",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
              className={styles.facturaCardMedia}
            />
            <CardContent sx={{ p: 2 }} className={styles.facturaCardContent}>
              <div className="text-sm space-y-2">
                <Typography variant="subtitle1" fontWeight="bold">
                  {factura.proveedor}
                </Typography>
                <Typography>
                  <strong>Folio:</strong> {factura.folio}
                </Typography>
                <Typography>
                  <strong>Local:</strong> {factura.local}
                </Typography>
                <Typography>
                  <strong>Estado:</strong> {factura.estado}
                </Typography>
                <Typography>
                  <strong>Fecha:</strong>{" "}
                  {new Date(factura.fechaIngreso).toLocaleDateString()}
                </Typography>
              </div>
              <Button
                onClick={() => window.open(factura.image_url, "_blank")}
                size="small"
                variant="contained"
                sx={{ marginTop: 2 }}
                fullWidth
                className={styles.facturaButton}
              >
                Ver Factura
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Vista para Desktop: Tabla
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Folio</TableCell>
            <TableCell>Proveedor</TableCell>
            <TableCell>Local</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Fecha Ingreso</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((factura) => (
            <TableRow key={factura.id}>
              <TableCell>{factura.folio}</TableCell>
              <TableCell>
                <div>
                  <Typography variant="body1">{factura.proveedor}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Rut: {formatearRut(factura.rut_proveedor || '')}
                  </Typography>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <Typography variant="body1">{factura.local}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Subido por: {factura.usuario || "undefined"}
                  </Typography>
                </div>
              </TableCell>
              <TableCell>{factura.estado}</TableCell>
              <TableCell>
                {new Date(factura.fechaIngreso).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => window.open(factura.image_url, "_blank")}
                >
                  Ver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
