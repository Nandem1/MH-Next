"use client";

import { Paper, Button, Typography, IconButton, Box, CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Stack, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material";


import DoneIcon from "@mui/icons-material/Done";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import { Factura } from "@/types/factura";
import { formatearRut } from "@/utils/formatearRut";
import { formatearMonto } from "@/utils/formatearMonto";

interface FacturaTableDesktopProps {
  facturas: Factura[];
  onView: (factura: Factura) => void;
  onChangeEstado: (id: string) => void;
  onPrint: (factura: Factura) => void;
  onEditarMonto: (factura: Factura) => void;
}

export function FacturaTableDesktop({
  facturas,
  onView,
  onChangeEstado,
  onPrint,
  onEditarMonto,
}: FacturaTableDesktopProps) {
  const theme = useTheme();

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
            <TableCell align="center">Monto</TableCell>
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

              {/* Monto con ícono de editar */}
              <TableCell align="center">
                <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {factura.isUpdating ? (
                    <CircularProgress size={16} />
                  ) : (
                    <Typography variant="body2" fontWeight={500} noWrap>
                      {formatearMonto(factura.monto)}
                    </Typography>
                  )}
                  <Tooltip title="Editar monto">
                    <IconButton
                      size="small"
                      onClick={() => onEditarMonto(factura)}
                      disabled={factura.isUpdating}
                      sx={{
                        position: "absolute",
                        right: -12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        ml: 3,
                        width: 24,
                        height: 24,
                        color: theme.palette.primary.main,
                        "&:hover": {
                          bgcolor: theme.palette.primary.light,
                          color: theme.palette.primary.contrastText,
                        },
                        "& .MuiSvgIcon-root": {
                          fontSize: "0.875rem",
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
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
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => onPrint(factura)}
                    aria-label="Imprimir factura"
                  >
                    <PrintIcon fontSize="small" />
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
