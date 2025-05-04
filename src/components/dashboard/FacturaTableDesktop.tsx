"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { Factura } from "@/types/factura";
import { formatearRut } from "@/utils/formatearRut";

interface FacturaTableDesktopProps {
  facturas: Factura[];
  onView: (factura: Factura) => void;
  onChangeEstado: (id: string) => void;
}

export function FacturaTableDesktop({
  facturas,
  onView,
  onChangeEstado,
}: FacturaTableDesktopProps) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "100%",
        mt: 2,
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflowX: "auto",
      }}
    >
      <Table size="small" aria-label="Tabla de facturas">
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
          {facturas.map((factura) => (
            <TableRow key={factura.id} hover>
              <TableCell align="center">{factura.folio}</TableCell>

              {/* Proveedor + Rut */}
              <TableCell align="center">
                <Stack spacing={0.2} alignItems="center">
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {factura.proveedor}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rut: {formatearRut(factura.rut_proveedor || "")}
                  </Typography>
                </Stack>
              </TableCell>

              {/* Local + Usuario */}
              <TableCell align="center">
                <Stack spacing={0.2} alignItems="center">
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {factura.local}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Subido por: {factura.nombre_usuario}
                  </Typography>
                </Stack>
              </TableCell>

              <TableCell align="center">
                <Typography variant="body2" noWrap>
                  {factura.estado}
                </Typography>
              </TableCell>

              <TableCell align="center">
                <Typography variant="body2" noWrap>
                  {new Date(factura.fechaIngreso).toLocaleDateString()}
                </Typography>
              </TableCell>

              {/* Acciones */}
              <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => onChangeEstado(factura.id)}
                    aria-label="Cambiar estado"
                  >
                    <DoneIcon fontSize="small" />
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => onView(factura)}
                    aria-label="Ver factura"
                  >
                    Ver
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
