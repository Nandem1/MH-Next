"use client";

import { useState, ChangeEvent } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  Grid,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import FileCopyIcon from "@mui/icons-material/FileCopy";

// Tipos para la estructura del DTE
type DteDetalle = {
  nroLinDet: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  montoItem: number;
  valorUnidad: number;
  pvDetalle: number;
  pvMayor: number;
};

type DteHeader = {
  folio: string;
  fechaEmision: string;
  terminoPago: string;
  rutEmisor: string;
  nombreEmisor: string;
  rutReceptor: string;
  nombreReceptor: string;
  montoNeto: number;
  iva: number;
  montoTotal: number;
};

type DteData = {
  encabezado: DteHeader;
  detalles: DteDetalle[];
};

// Tipo para los detalles sin los valores comerciales calculados
type DteDetalleRaw = Omit<DteDetalle, "valorUnidad" | "pvDetalle" | "pvMayor">;

export function XMLUploader() {
  const [dteData, setDteData] = useState<DteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0); // Para forzar el reset del input

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const xmlString = e.target?.result as string;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");

        const parserErrors = xmlDoc.getElementsByTagName("parsererror");
        if (parserErrors.length > 0) {
          throw new Error("El archivo XML no es válido");
        }

        const dte = parseDteXml(xmlDoc);
        setDteData(calculateCommercialValues(dte));
      } catch (err) {
        setError(
          `Error al procesar el DTE: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Error al leer el archivo");
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  const handleClear = () => {
    setDteData(null);
    setFileName(null);
    setError(null);
    setFileInputKey((prev) => prev + 1); // Forzar el reset del input
  };

  const parseDteXml = (
    xmlDoc: Document
  ): { encabezado: DteHeader; detalles: DteDetalleRaw[] } => {
    const ns = "http://www.sii.cl/SiiDte";

    // Extraer datos del encabezado
    const encabezadoNode = xmlDoc.getElementsByTagNameNS(ns, "Encabezado")[0];
    if (!encabezadoNode)
      throw new Error("No se encontró el encabezado del DTE");

    const idDocNode = encabezadoNode.getElementsByTagNameNS(ns, "IdDoc")[0];
    const emisorNode = encabezadoNode.getElementsByTagNameNS(ns, "Emisor")[0];
    const receptorNode = encabezadoNode.getElementsByTagNameNS(
      ns,
      "Receptor"
    )[0];
    const totalesNode = encabezadoNode.getElementsByTagNameNS(ns, "Totales")[0];

    const encabezado: DteHeader = {
      folio: getTextContent(idDocNode, ns, "Folio") || "",
      fechaEmision: getTextContent(idDocNode, ns, "FchEmis") || "",
      terminoPago: getTextContent(idDocNode, ns, "TermPagoGlosa") || "",
      rutEmisor: getTextContent(emisorNode, ns, "RUTEmisor") || "",
      nombreEmisor: getTextContent(emisorNode, ns, "RznSoc") || "",
      rutReceptor: getTextContent(receptorNode, ns, "RUTRecep") || "",
      nombreReceptor: getTextContent(receptorNode, ns, "RznSocRecep") || "",
      montoNeto: parseInt(getTextContent(totalesNode, ns, "MntNeto") || "0"),
      iva: parseInt(getTextContent(totalesNode, ns, "IVA") || "0"),
      montoTotal: parseInt(getTextContent(totalesNode, ns, "MntTotal") || "0"),
    };

    // Extraer detalles
    const detalles: DteDetalleRaw[] = [];
    const detalleNodes = xmlDoc.getElementsByTagNameNS(ns, "Detalle");

    for (let i = 0; i < detalleNodes.length; i++) {
      const detalleNode = detalleNodes[i];
      const cdgItemNode = detalleNode.getElementsByTagNameNS(ns, "CdgItem")[0];

      detalles.push({
        nroLinDet: getTextContent(detalleNode, ns, "NroLinDet") || "",
        codigo: cdgItemNode
          ? getTextContent(cdgItemNode, ns, "VlrCodigo") || ""
          : "",
        nombre: getTextContent(detalleNode, ns, "NmbItem") || "",
        descripcion: getTextContent(detalleNode, ns, "DscItem") || "",
        cantidad: parseFloat(getTextContent(detalleNode, ns, "QtyItem") || "0"),
        precioUnitario: parseFloat(
          getTextContent(detalleNode, ns, "PrcItem") || "0"
        ),
        montoItem: parseFloat(
          getTextContent(detalleNode, ns, "MontoItem") || "0"
        ),
      });
    }

    return { encabezado, detalles };
  };

  const calculateCommercialValues = (dte: {
    encabezado: DteHeader;
    detalles: DteDetalleRaw[];
  }): DteData => {
    const detallesCompletos: DteDetalle[] = dte.detalles.map((detalle) => {
      // Calcular valor por unidad (total / cantidad)
      const valorUnidad = detalle.montoItem / detalle.cantidad;

      // Calcular PV Detalle (valorUnidad * 1.19 / 0.67) - 33% margen
      const pvDetalleRaw = (valorUnidad * 1.19) / 0.67;

      // Calcular PV Mayor (valorUnidad * 1.19 / 0.77) - 23% margen
      const pvMayorRaw = (valorUnidad * 1.19) / 0.77;

      return {
        ...detalle,
        valorUnidad,
        pvDetalle: smartRoundTo90(pvDetalleRaw),
        pvMayor: smartRoundTo90(pvMayorRaw),
      };
    });

    return {
      encabezado: dte.encabezado,
      detalles: detallesCompletos,
    };
  };

  /**
   * Redondea a los números que terminan en 90
   * (… 1490, 1590, 1690 …).
   * – Si el valor está a < 40 unidades del X90 inferior ➜ baja.
   * – Si está a ≥ 40 unidades                      ➜ sube.
   */
  const smartRoundTo90 = (value: number): number => {
    // 1) Candidato inferior que termina en 90
    const lower = Math.floor((value - 90) / 100) * 100 + 90;

    // 2) Distancia a ese candidato
    const diff = value - lower;

    // 3) Decide según el umbral de 40
    return diff < 40 ? lower : lower + 100;
  };

  const getTextContent = (
    parent: Element | undefined,
    ns: string,
    tagName: string
  ): string | null => {
    if (!parent) return null;
    const nodes = parent.getElementsByTagNameNS(ns, tagName);
    return nodes.length > 0 ? nodes[0].textContent : null;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatRut = (rut: string): string => {
    if (!rut) return "";
    return rut.replace(/(\d{1,2})(\d{3})(\d{3})([\dkK])/, "$1.$2.$3-$4");
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CL");
  };

  const CopyTableButton = ({ tableData }: { tableData: DteDetalle[] }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
      // Creamos un array bidimensional que representa las filas y columnas de Excel
      const excelData = tableData.flatMap((item) => [
        [
          item.codigo,
          item.nombre,
          item.descripcion,
          "",
          "",
          item.montoItem,
          "",
          "",
          item.cantidad,
        ], // Fila con datos
      ]);

      // Convertimos a texto TSV (tabulaciones entre columnas, saltos de línea entre filas)
      const tsvData = excelData.map((row) => row.join("\t")).join("\n");

      navigator.clipboard
        .writeText(tsvData)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => console.error("Error al copiar: ", err));
    };

    return (
      <Button
        variant="outlined"
        onClick={copyToClipboard}
        startIcon={copied ? "✓" : <FileCopyIcon />}
        sx={{ mb: 2 }}
      >
        {copied ? "Copiado!" : "Copiar tabla para Excel"}
      </Button>
    );
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Lector de DTE (Factura Electrónica)
      </Typography>

      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Subir archivo XML de DTE
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            disabled={isLoading}
          >
            Seleccionar XML
            <input
              key={fileInputKey}
              type="file"
              accept=".xml"
              hidden
              onChange={handleFileUpload}
            />
          </Button>

          {fileName && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body1">{fileName}</Typography>
              <IconButton onClick={handleClear} size="small">
                <CancelIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          {isLoading && <CircularProgress size={24} />}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Card>

      {dteData && <CopyTableButton tableData={dteData.detalles} />}

      {dteData && (
        <Box>
          {/* Encabezado de la factura */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información de la Factura
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1">Emisor</Typography>
                <Typography>{dteData.encabezado.nombreEmisor}</Typography>
                <Typography variant="body2" color="text.secondary">
                  RUT: {formatRut(dteData.encabezado.rutEmisor)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1">Receptor</Typography>
                <Typography>{dteData.encabezado.nombreReceptor}</Typography>
                <Typography variant="body2" color="text.secondary">
                  RUT: {formatRut(dteData.encabezado.rutReceptor)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 6, md: 3 }}>
                <Typography variant="subtitle1">Folio</Typography>
                <Chip label={dteData.encabezado.folio} color="primary" />
              </Grid>

              <Grid size={{ xs: 6, md: 3 }}>
                <Typography variant="subtitle1">Fecha Emisión</Typography>
                <Typography>
                  {formatDate(dteData.encabezado.fechaEmision)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 6, md: 3 }}>
                <Typography variant="subtitle1">Término de Pago</Typography>
                <Typography>{dteData.encabezado.terminoPago}</Typography>
              </Grid>

              <Grid size={{ xs: 6, md: 3 }}>
                <Typography variant="subtitle1">Total</Typography>
                <Typography variant="h6">
                  {formatCurrency(dteData.encabezado.montoTotal)}
                </Typography>
                <Typography variant="caption" display="block">
                  Neto: {formatCurrency(dteData.encabezado.montoNeto)} + IVA:{" "}
                  {formatCurrency(dteData.encabezado.iva)}
                </Typography>
              </Grid>
            </Grid>
          </Card>

          {/* Detalle de la factura */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Detalle de Productos/Servicios
            </Typography>

            <TableContainer
              component={Paper}
              sx={{ maxHeight: 600, overflow: "auto" }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Valor Unidad</TableCell>
                    <TableCell>PV Detalle (33%)</TableCell>
                    <TableCell>PV Mayor (23%)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dteData.detalles.map((detalle) => (
                    <TableRow key={detalle.nroLinDet}>
                      <TableCell>{detalle.codigo}</TableCell>
                      <TableCell>
                        <Typography>{detalle.nombre}</Typography>
                        <Typography variant="caption">{detalle.descripcion}</Typography>
                      </TableCell>
                      <TableCell>{detalle.cantidad}</TableCell>
                      <TableCell>{formatCurrency(detalle.montoItem)}</TableCell>
                      <TableCell>
                        {formatCurrency(detalle.valorUnidad)}
                      </TableCell>
                      <TableCell>{formatCurrency(detalle.pvDetalle)}</TableCell>
                      <TableCell>{formatCurrency(detalle.pvMayor)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      )}
    </Box>
  );
}
