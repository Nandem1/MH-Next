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
  IconButton,
  Collapse,
  Box,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import PrintIcon from "@mui/icons-material/Print";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { NotaCredito } from "@/types/notaCredito";
import { formatearRut } from "@/utils/formatearRut";
import { useState } from "react";

interface NotaCreditoTableDesktopProps {
  notasCredito: NotaCredito[];
  onView: (notaCredito: NotaCredito) => void;
  onChangeEstado: (id: string) => void;
  onViewFacturaAsociada: (
    facturaAsociada: NotaCredito["facturaAsociada"]
  ) => void;
  onPrint: (notaCredito: NotaCredito) => void;
  onPrintFacturaAsociada: (
    facturaAsociada: NotaCredito["facturaAsociada"]
  ) => void;
}

export function NotaCreditoTableDesktop({
  notasCredito,
  onView,
  onChangeEstado,
  onViewFacturaAsociada,
  onPrint,
  onPrintFacturaAsociada,
}: NotaCreditoTableDesktopProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleRowClick = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const isExpanded = (id: string) => expandedRows.has(id);

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
      <Table size="small" aria-label="Tabla de notas de crédito">
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ width: 50 }}></TableCell>
            <TableCell align="center">Folio</TableCell>
            <TableCell align="center">Proveedor</TableCell>
            <TableCell align="center">Local</TableCell>
            <TableCell align="center">Estado</TableCell>
            <TableCell align="center">Fecha Ingreso</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {notasCredito.map((notaCredito) => (
            <>
              <TableRow
                key={notaCredito.id}
                hover
                sx={{
                  cursor: notaCredito.facturaAsociada ? "pointer" : "default",
                  "&:hover": {
                    backgroundColor: notaCredito.facturaAsociada
                      ? "action.hover"
                      : undefined,
                  },
                }}
                onClick={() =>
                  notaCredito.facturaAsociada && handleRowClick(notaCredito.id)
                }
              >
                {/* Columna de expandir */}
                <TableCell align="center" sx={{ width: 50 }}>
                  {notaCredito.facturaAsociada && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(notaCredito.id);
                      }}
                    >
                      {isExpanded(notaCredito.id) ? (
                        <ExpandLessIcon fontSize="small" />
                      ) : (
                        <ExpandMoreIcon fontSize="small" />
                      )}
                    </IconButton>
                  )}
                </TableCell>

                <TableCell align="center">{notaCredito.folio}</TableCell>

                {/* Proveedor + Rut */}
                <TableCell align="center">
                  <Stack spacing={0.2} alignItems="center">
                    <Typography variant="body2" fontWeight={500} noWrap>
                      {notaCredito.proveedor}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Rut: {formatearRut(notaCredito.rut_proveedor || "")}
                    </Typography>
                  </Stack>
                </TableCell>

                {/* Local + Usuario */}
                <TableCell align="center">
                  <Stack spacing={0.2} alignItems="center">
                    <Typography variant="body2" fontWeight={500} noWrap>
                      {notaCredito.local}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Subido por: {notaCredito.nombre_usuario}
                    </Typography>
                  </Stack>
                </TableCell>

                <TableCell align="center">
                  <Typography variant="body2" noWrap>
                    {notaCredito.estado}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography variant="body2" noWrap>
                    {new Date(notaCredito.fechaIngreso).toLocaleDateString()}
                  </Typography>
                </TableCell>

                {/* Acciones */}
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChangeEstado(notaCredito.id);
                      }}
                      aria-label="Cambiar estado"
                    >
                      <DoneIcon fontSize="small" />
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(notaCredito);
                      }}
                      aria-label="Ver nota de crédito"
                    >
                      Ver
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPrint(notaCredito);
                      }}
                      aria-label="Imprimir nota de crédito"
                    >
                      <PrintIcon fontSize="small" />
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>

              {/* Row expandible con factura asociada */}
              {notaCredito.facturaAsociada && (
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={7}
                  >
                    <Collapse
                      in={isExpanded(notaCredito.id)}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ margin: 1, py: 2 }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          component="div"
                          color="primary"
                        >
                          📄 Factura Asociada
                        </Typography>
                        <Table size="small" aria-label="factura asociada">
                          <TableHead>
                            <TableRow>
                              <TableCell align="center">Folio</TableCell>
                              <TableCell align="center">Proveedor</TableCell>
                              <TableCell align="center">Estado</TableCell>
                              <TableCell align="center">Fecha</TableCell>
                              <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow sx={{ backgroundColor: "action.hover" }}>
                              <TableCell align="center">
                                <Typography variant="body2" fontWeight={500}>
                                  {notaCredito.facturaAsociada.folio}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2" fontWeight={500}>
                                  {notaCredito.facturaAsociada.proveedor}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2">
                                  {notaCredito.facturaAsociada.estado}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2">
                                  {new Date(
                                    notaCredito.facturaAsociada.fechaIngreso
                                  ).toLocaleDateString()}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  justifyContent="center"
                                >
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => {
                                      onViewFacturaAsociada(
                                        notaCredito.facturaAsociada
                                      );
                                    }}
                                  >
                                    Ver
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (notaCredito.facturaAsociada) {
                                        onPrintFacturaAsociada(notaCredito.facturaAsociada);
                                      }
                                    }}
                                    aria-label="Imprimir factura asociada"
                                  >
                                    <PrintIcon fontSize="small" />
                                  </Button>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
