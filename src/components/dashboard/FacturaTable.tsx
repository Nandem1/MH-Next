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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
import { useMediaQuery } from "@mui/material";
import styles from "./FacturaTable.module.css";
import { formatearRut } from "@/utils/formatearRut";
import DoneIcon from "@mui/icons-material/Done";

export function FacturaTable() {
  const { data, isLoading, error } = useFacturas();
  const isMobile = useMediaQuery("(max-width:600px)");

  // Modal para confirmar cambio de estado
  const [open, setOpen] = useState(false);
  const [selectedFacturaId, setSelectedFacturaId] = useState<string | null>(
    null
  );

  const handleOpenModal = (id: string) => {
    setSelectedFacturaId(id);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedFacturaId(null);
  };

  const handleConfirmChange = () => {
    console.log(`Cambiar estado de factura ID: ${selectedFacturaId}`);
    handleCloseModal();
  };

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
                <Typography variant="caption" color="textSecondary">
                  Rut: {formatearRut(factura.rut_proveedor || "")}
                </Typography>
                <Typography>
                  <strong>Folio:</strong> {factura.folio}
                </Typography>
                <Typography>
                  <strong>Local:</strong> {factura.local}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Subido por: {factura.nombre_usuario}
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
    <>
      <TableContainer component={Paper} sx={{ maxWidth: '99%', margin: 'auto', boxShadow: 3, marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Folio</TableCell>
              <TableCell align="center">Proveedor</TableCell>
              <TableCell align="center">Local</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Fecha Ingreso</TableCell>
              <TableCell align="center">Acciones</TableCell>
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
                      Rut: {formatearRut(factura.rut_proveedor || "")}
                    </Typography>
                  </div>
                </TableCell>
                <TableCell align="center">
                  <div>
                    <Typography variant="body1">{factura.local}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Subido por: {factura.nombre_usuario}
                    </Typography>
                  </div>
                </TableCell>
                <TableCell align="center">{factura.estado}</TableCell>
                <TableCell align="center">
                  {new Date(factura.fechaIngreso).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", justifyContent: "center" }}>
                  <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleOpenModal(factura.id)}
                    >
                      <DoneIcon />
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => window.open(factura.image_url, "_blank")}
                    >
                      Ver
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de confirmación */}
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Confirmar Cambio de Estado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas cambiar el estado de esta factura?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button
            onClick={handleConfirmChange}
            variant="contained"
            color="primary"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
