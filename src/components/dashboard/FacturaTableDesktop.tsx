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
} from "@mui/material";
import { Factura } from "@/types/factura";
import { formatearRut } from "@/utils/formatearRut";
import DoneIcon from "@mui/icons-material/Done";

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
      sx={{ width: "100%", boxShadow: 3, mt: 2 }}
    >
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
          {facturas.map((factura) => {
            return (
              <TableRow key={factura.id}>
                <TableCell align="center">{factura.folio}</TableCell>

                {/* Proveedor + Rut */}
                <TableCell align="center">
                  <div>
                    <Typography variant="body1">{factura.proveedor}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Rut: {formatearRut(factura.rut_proveedor || "")}
                    </Typography>
                  </div>
                </TableCell>

                {/* Local + Usuario */}
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

                {/* Acciones */}
                <TableCell align="center">
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => onChangeEstado(factura.id)}
                    >
                      <DoneIcon />
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => onView(factura)}
                    >
                      Ver
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
