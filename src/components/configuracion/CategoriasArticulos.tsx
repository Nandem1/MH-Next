"use client";

import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Snackbar,
  Alert,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useCategorias, useCreateCategoria, useUpdateCategoria, useDeleteCategoria } from "@/hooks/useCategorias";
import { Categoria } from "@/services/categoriaService";
import { CategoriaMenuActions } from "./CategoriaMenuActions";

export function CategoriasArticulos() {
  const { categorias, isLoading, isError } = useCategorias();
  const createMutation = useCreateCategoria();
  const updateMutation = useUpdateCategoria();
  const deleteMutation = useDeleteCategoria();

  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info">("success");

  // Estados para formularios
  const [nombre, setNombre] = useState("");
  const [errorNombre, setErrorNombre] = useState("");
  
  // Estado para el placeholder inline
  const [nuevoNombreInline, setNuevoNombreInline] = useState("");
  const [isCreatingInline, setIsCreatingInline] = useState(false);

  const handleCrearCategoria = () => {
    setNombre("");
    setErrorNombre("");
    setModalCrearOpen(true);
  };

  const handleEditarCategoria = (categoria: Categoria) => {
    setCategoriaSeleccionada(categoria);
    setNombre(categoria.nombre);
    setErrorNombre("");
    setModalEditarOpen(true);
  };

  const handleEliminarCategoria = async (categoria: Categoria) => {
    if (!window.confirm(`¿Está seguro de eliminar la categoría "${categoria.nombre}"?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(categoria.id);
      setSnackbarMessage("Categoría eliminada exitosamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al eliminar la categoría";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCerrarModales = () => {
    setModalCrearOpen(false);
    setModalEditarOpen(false);
    setCategoriaSeleccionada(null);
    setNombre("");
    setErrorNombre("");
  };

  const handleSubmitCrear = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validaciones
    if (!nombre.trim()) {
      setErrorNombre("El nombre es obligatorio");
      return;
    }

    setErrorNombre("");

    try {
      await createMutation.mutateAsync({ nombre: nombre.trim() });
      setSnackbarMessage("Categoría creada exitosamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      handleCerrarModales();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al crear la categoría";
      setErrorNombre(errorMessage);
    }
  };

  const handleCrearInline = async () => {
    if (!nuevoNombreInline.trim()) {
      return;
    }

    setIsCreatingInline(true);
    try {
      await createMutation.mutateAsync({ nombre: nuevoNombreInline.trim() });
      setSnackbarMessage("Categoría creada exitosamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setNuevoNombreInline("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al crear la categoría";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsCreatingInline(false);
    }
  };

  const handleCancelarInline = () => {
    setNuevoNombreInline("");
  };

  const handleKeyPressInline = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && nuevoNombreInline.trim()) {
      handleCrearInline();
    } else if (e.key === "Escape") {
      handleCancelarInline();
    }
  };

  const handleSubmitEditar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!categoriaSeleccionada) return;

    // Validaciones
    if (!nombre.trim()) {
      setErrorNombre("El nombre es obligatorio");
      return;
    }

    setErrorNombre("");

    try {
      await updateMutation.mutateAsync({
        id: categoriaSeleccionada.id,
        data: { nombre: nombre.trim() },
      });
      setSnackbarMessage("Categoría actualizada exitosamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      handleCerrarModales();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar la categoría";
      setErrorNombre(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error al cargar las categorías. Por favor, intenta nuevamente.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" fontWeight="bold">
          Categorías de Artículos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCrearCategoria}
        >
          Nueva Categoría
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          mt: 0,
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflowX: "auto",
        }}
      >
        <Table size="small" aria-label="Tabla de categorías">
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    No hay categorías registradas
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {categorias.map((categoria) => (
                  <TableRow key={categoria.id} hover>
                    <TableCell align="center">
                      <Typography variant="caption" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                        {categoria.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                        {categoria.nombre}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <CategoriaMenuActions
                        categoria={categoria}
                        onEdit={handleEditarCategoria}
                        onDelete={handleEliminarCategoria}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {/* Fila placeholder para agregar nueva categoría */}
                <TableRow 
                  sx={{ 
                    backgroundColor: 'action.hover',
                    '&:hover': {
                      backgroundColor: 'action.selected',
                    }
                  }}
                >
                  <TableCell align="center">
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      -
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Escribe el nombre de la nueva categoría..."
                      value={nuevoNombreInline}
                      onChange={(e) => setNuevoNombreInline(e.target.value)}
                      onKeyDown={handleKeyPressInline}
                      disabled={isCreatingInline || createMutation.isPending}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AddIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: nuevoNombreInline.trim() ? (
                          <InputAdornment position="end">
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton
                                size="small"
                                onClick={handleCrearInline}
                                disabled={isCreatingInline || createMutation.isPending}
                                color="primary"
                                sx={{ p: 0.5 }}
                              >
                                {isCreatingInline || createMutation.isPending ? (
                                  <CircularProgress size={16} />
                                ) : (
                                  <CheckIcon fontSize="small" />
                                )}
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={handleCancelarInline}
                                disabled={isCreatingInline || createMutation.isPending}
                                sx={{ p: 0.5 }}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </InputAdornment>
                        ) : null,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.75rem',
                          height: '32px',
                          '& fieldset': {
                            borderStyle: 'dashed',
                            borderColor: 'divider',
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused fieldset': {
                            borderStyle: 'solid',
                            borderColor: 'primary.main',
                          },
                        },
                        '& .MuiInputBase-input': {
                          py: 0.5,
                          px: 1,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      -
                    </Typography>
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Crear Categoría */}
      <Dialog
        open={modalCrearOpen}
        onClose={handleCerrarModales}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <form onSubmit={handleSubmitCrear}>
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold">
              Crear Categoría
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Nombre"
                  fullWidth
                  required
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    setErrorNombre("");
                  }}
                  error={!!errorNombre}
                  helperText={errorNombre}
                  disabled={createMutation.isPending}
                  autoFocus
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCerrarModales}
              disabled={createMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending}
              startIcon={createMutation.isPending ? <CircularProgress size={20} /> : null}
            >
              {createMutation.isPending ? "Creando..." : "Crear"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal Editar Categoría */}
      <Dialog
        open={modalEditarOpen}
        onClose={handleCerrarModales}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <form onSubmit={handleSubmitEditar}>
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold">
              Editar Categoría
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Nombre"
                  fullWidth
                  required
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    setErrorNombre("");
                  }}
                  error={!!errorNombre}
                  helperText={errorNombre}
                  disabled={updateMutation.isPending}
                  autoFocus
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCerrarModales}
              disabled={updateMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={updateMutation.isPending}
              startIcon={updateMutation.isPending ? <CircularProgress size={20} /> : null}
            >
              {updateMutation.isPending ? "Actualizando..." : "Actualizar"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

