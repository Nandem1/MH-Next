"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import { Factura, ActualizarCamposBasicosRequest } from "@/types/factura";
import { Usuario, Proveedor } from "@/services/usuarioService";
import { getUsuarios, getProveedores } from "@/services/usuarioService";

interface EditarCamposBasicosModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ActualizarCamposBasicosRequest) => Promise<void>;
  factura: Factura | null;
  loading: boolean;
}

interface LocalOption {
  id: number;
  nombre: string;
}

const locales: LocalOption[] = [
  { id: 1, nombre: "LA CANTERA 3055" },
  { id: 2, nombre: "LIBERTADOR 1476" },
  { id: 3, nombre: "BALMACEDA 599" },
];

export function EditarCamposBasicosModal({
  open,
  onClose,
  onSubmit,
  factura,
  loading,
}: EditarCamposBasicosModalProps) {
  const theme = useTheme();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [folio, setFolio] = useState("");
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [selectedLocal, setSelectedLocal] = useState<LocalOption | null>(null);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open, factura]);

  // Actualizar valores seleccionados cuando se cargan los datos
  useEffect(() => {
    if (factura && usuarios.length > 0 && proveedores.length > 0) {
      setFolio(factura.folio);
      // Buscar usuario actual
      const usuarioActual = usuarios.find(u => u.nombre === factura.nombre_usuario);
      setSelectedUsuario(usuarioActual || null);
      // Buscar local actual
      const localActual = locales.find(l => l.nombre === factura.local);
      setSelectedLocal(localActual || null);
      // Buscar proveedor actual
      const proveedorActual = proveedores.find(p => p.nombre === factura.proveedor);
      setSelectedProveedor(proveedorActual || null);
    }
  }, [factura, usuarios, proveedores]);

  const loadData = async () => {
    setLoadingData(true);
    setError(null);
    try {
      const [usuariosData, proveedoresData] = await Promise.all([
        getUsuarios(),
        getProveedores(),
      ]);
      setUsuarios(usuariosData);
      setProveedores(proveedoresData);
    } catch (error) {
      setError("Error al cargar los datos");
      console.error("Error cargando datos:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async () => {
    if (!factura) return;

    const data: ActualizarCamposBasicosRequest = {
      id: factura.id,
      ...(folio !== factura.folio && { folio }),
      ...(selectedLocal && selectedLocal.nombre !== factura.local && { id_local: selectedLocal.id }),
      ...(selectedUsuario && selectedUsuario.nombre !== factura.nombre_usuario && { id_usuario: selectedUsuario.id }),
      ...(selectedProveedor && selectedProveedor.nombre !== factura.proveedor && { id_proveedor: selectedProveedor.id }),
    };

    // Verificar que al menos un campo haya cambiado
    if (Object.keys(data).length === 1) {
      setError("Debe modificar al menos un campo");
      return;
    }

    try {
      await onSubmit(data);
      onClose();
    } catch {
      // El error se maneja en el componente padre
    }
  };

  const handleClose = () => {
    setError(null);
    setFolio("");
    setSelectedUsuario(null);
    setSelectedLocal(null);
    setSelectedProveedor(null);
    onClose();
  };

  if (!factura) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          pb: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <SettingsIcon sx={{ color: theme.palette.primary.main }} />
        <Typography variant="h6" component="div">
          Configurar Factura
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

                 {/* Información de la factura */}
         <Box sx={{ 
           mt: 2,
           mb: 3, 
           p: 3, 
           bgcolor: "background.default", 
           borderRadius: "12px",
           border: `1px solid ${theme.palette.divider}`,
           transition: "all 0.3s ease-in-out",
           "&:hover": {
             borderColor: theme.palette.primary.main,
             bgcolor: "background.paper",
           }
         }}>
           <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }} gutterBottom>
             Factura #{factura.folio}
           </Typography>
           <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
             {factura.proveedor} • {factura.local}
           </Typography>
           <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
             Monto: ${factura.monto?.toLocaleString() || "0"}
           </Typography>
         </Box>

        {loadingData ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                         {/* Folio */}
             <TextField
               label="Folio"
               value={folio}
               onChange={(e) => setFolio(e.target.value)}
               fullWidth
               size="small"
               variant="outlined"
               placeholder="Ingrese el nuevo folio"
               sx={{
                 "& .MuiOutlinedInput-root": {
                   borderRadius: "8px",
                   color: theme.palette.text.primary,
                   "& fieldset": {
                     borderColor: theme.palette.divider,
                   },
                   "&:hover fieldset": {
                     borderColor: theme.palette.text.primary,
                   },
                   "&.Mui-focused fieldset": {
                     borderColor: theme.palette.primary.main,
                   },
                 },
                 "& .MuiInputLabel-root": {
                   color: theme.palette.text.secondary,
                   "&.Mui-focused": {
                     color: theme.palette.primary.main,
                   },
                 },
                 input: {
                   color: theme.palette.text.primary,
                 },
               }}
             />

                         {/* Local */}
             <Autocomplete
               options={locales}
               getOptionLabel={(option) => option.nombre}
               value={selectedLocal}
               onChange={(_, newValue) => setSelectedLocal(newValue)}
               renderInput={(params) => (
                 <TextField
                   {...params}
                   label="Local"
                   size="small"
                   variant="outlined"
                   placeholder="Seleccione un local"
                   sx={{
                     "& .MuiOutlinedInput-root": {
                       borderRadius: "8px",
                       color: theme.palette.text.primary,
                       "& fieldset": {
                         borderColor: theme.palette.divider,
                       },
                       "&:hover fieldset": {
                         borderColor: theme.palette.text.primary,
                       },
                       "&.Mui-focused fieldset": {
                         borderColor: theme.palette.primary.main,
                       },
                     },
                     "& .MuiInputLabel-root": {
                       color: theme.palette.text.secondary,
                       "&.Mui-focused": {
                         color: theme.palette.primary.main,
                       },
                     },
                     input: {
                       color: theme.palette.text.primary,
                     },
                   }}
                 />
               )}
               renderOption={(props, option) => (
                 <Box component="li" {...props}>
                   <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>{option.nombre}</Typography>
                 </Box>
               )}
               renderTags={(value, getTagProps) =>
                 value.map((option, index) => (
                   <Chip
                     {...getTagProps({ index })}
                     key={option.id}
                     label={option.nombre}
                     size="small"
                     variant="outlined"
                     sx={{
                       borderRadius: "8px",
                       borderColor: theme.palette.primary.main,
                       color: theme.palette.primary.main,
                       backgroundColor: "transparent",
                       "&:hover": {
                         backgroundColor: theme.palette.primary.light,
                         color: theme.palette.primary.contrastText,
                       },
                     }}
                   />
                 ))
               }
             />

                         {/* Usuario */}
             <Autocomplete
               options={usuarios}
               getOptionLabel={(option) => option.nombre}
               value={selectedUsuario}
               onChange={(_, newValue) => setSelectedUsuario(newValue)}
               renderInput={(params) => (
                 <TextField
                   {...params}
                   label="Usuario"
                   size="small"
                   variant="outlined"
                   placeholder="Seleccione un usuario"
                   sx={{
                     "& .MuiOutlinedInput-root": {
                       borderRadius: "8px",
                       color: theme.palette.text.primary,
                       "& fieldset": {
                         borderColor: theme.palette.divider,
                       },
                       "&:hover fieldset": {
                         borderColor: theme.palette.text.primary,
                       },
                       "&.Mui-focused fieldset": {
                         borderColor: theme.palette.primary.main,
                       },
                     },
                     "& .MuiInputLabel-root": {
                       color: theme.palette.text.secondary,
                       "&.Mui-focused": {
                         color: theme.palette.primary.main,
                       },
                     },
                     input: {
                       color: theme.palette.text.primary,
                     },
                   }}
                 />
               )}
               renderOption={(props, option) => (
                 <Box component="li" {...props}>
                   <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>{option.nombre}</Typography>
                   {option.nombre_local && (
                     <Typography variant="caption" sx={{ ml: 1, color: theme.palette.text.secondary }}>
                       • {option.nombre_local}
                     </Typography>
                   )}
                 </Box>
               )}
               renderTags={(value, getTagProps) =>
                 value.map((option, index) => (
                   <Chip
                     {...getTagProps({ index })}
                     key={option.id}
                     label={option.nombre}
                     size="small"
                     variant="outlined"
                     sx={{
                       borderRadius: "8px",
                       borderColor: theme.palette.primary.main,
                       color: theme.palette.primary.main,
                       backgroundColor: "transparent",
                       "&:hover": {
                         backgroundColor: theme.palette.primary.light,
                         color: theme.palette.primary.contrastText,
                       },
                     }}
                   />
                 ))
               }
             />

                         {/* Proveedor */}
             <Autocomplete
               options={proveedores}
               getOptionLabel={(option) => option.nombre}
               value={selectedProveedor}
               onChange={(_, newValue) => setSelectedProveedor(newValue)}
               filterOptions={(options, { inputValue }) => {
                 const searchTerm = inputValue.toLowerCase();
                 return options.filter((option) => {
                   const nombreMatch = option.nombre.toLowerCase().includes(searchTerm);
                   const rutMatch = option.rut ? option.rut.replace(/[.-]/g, '').toLowerCase().includes(searchTerm.replace(/[.-]/g, '')) : false;
                   return nombreMatch || rutMatch;
                 });
               }}
               renderInput={(params) => (
                 <TextField
                   {...params}
                   label="Proveedor"
                   size="small"
                   variant="outlined"
                   placeholder="Seleccione un proveedor"
                   sx={{
                     "& .MuiOutlinedInput-root": {
                       borderRadius: "8px",
                       color: theme.palette.text.primary,
                       "& fieldset": {
                         borderColor: theme.palette.divider,
                       },
                       "&:hover fieldset": {
                         borderColor: theme.palette.text.primary,
                       },
                       "&.Mui-focused fieldset": {
                         borderColor: theme.palette.primary.main,
                       },
                     },
                     "& .MuiInputLabel-root": {
                       color: theme.palette.text.secondary,
                       "&.Mui-focused": {
                         color: theme.palette.primary.main,
                       },
                     },
                     input: {
                       color: theme.palette.text.primary,
                     },
                   }}
                 />
               )}
               renderOption={(props, option) => (
                 <Box component="li" {...props}>
                   <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>{option.nombre}</Typography>
                   {option.rut && (
                     <Typography variant="caption" sx={{ ml: 1, color: theme.palette.text.secondary }}>
                       • {option.rut}
                     </Typography>
                   )}
                 </Box>
               )}
               renderTags={(value, getTagProps) =>
                 value.map((option, index) => (
                   <Chip
                     {...getTagProps({ index })}
                     key={option.id}
                     label={option.nombre}
                     size="small"
                     variant="outlined"
                     sx={{
                       borderRadius: "8px",
                       borderColor: theme.palette.primary.main,
                       color: theme.palette.primary.main,
                       backgroundColor: "transparent",
                       "&:hover": {
                         backgroundColor: theme.palette.primary.light,
                         color: theme.palette.primary.contrastText,
                       },
                     }}
                   />
                 ))
               }
             />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          sx={{
            borderRadius: "8px",
            color: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
            "&:hover": {
              borderColor: theme.palette.text.primary,
              color: theme.palette.text.primary,
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || loadingData}
          startIcon={loading ? <CircularProgress size={16} /> : null}
          sx={{
            borderRadius: "8px",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
            "&:disabled": {
              backgroundColor: theme.palette.action.disabledBackground,
              color: theme.palette.action.disabled,
            },
          }}
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
