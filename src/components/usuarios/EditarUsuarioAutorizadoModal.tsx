"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useUpdateUsuarioAutorizado } from "@/hooks/useUsuariosAutorizados";
import { UsuarioAutorizado } from "@/services/usuarioService";
import { getLocalesActivos } from "@/constants/locales";

interface EditarUsuarioAutorizadoModalProps {
  open: boolean;
  onClose: () => void;
  usuario: UsuarioAutorizado | null;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function EditarUsuarioAutorizadoModal({
  open,
  onClose,
  usuario,
  onSuccess,
  onError,
}: EditarUsuarioAutorizadoModalProps) {
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [localId, setLocalId] = useState<number | "">("");
  const [errorNombre, setErrorNombre] = useState("");
  const [errorRut, setErrorRut] = useState("");
  const [errorLocal, setErrorLocal] = useState("");

  const updateMutation = useUpdateUsuarioAutorizado();
  const locales = getLocalesActivos();

  // Cargar datos del usuario cuando se abre el modal
  useEffect(() => {
    if (usuario && open) {
      setNombre(usuario.nombre);
      setRut(usuario.rut);
      setLocalId(usuario.id_local);
      setErrorNombre("");
      setErrorRut("");
      setErrorLocal("");
    }
  }, [usuario, open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!usuario) return;

    // Validaciones
    let hasErrors = false;

    if (!nombre.trim()) {
      setErrorNombre("El nombre es obligatorio");
      hasErrors = true;
    } else {
      setErrorNombre("");
    }

    if (!rut.trim()) {
      setErrorRut("El RUT es obligatorio");
      hasErrors = true;
    } else {
      setErrorRut("");
    }

    if (!localId || localId === "") {
      setErrorLocal("Debe seleccionar un local");
      hasErrors = true;
    } else {
      setErrorLocal("");
    }

    if (hasErrors) return;

    try {
      await updateMutation.mutateAsync({
        id: usuario.id,
        data: {
          nombre: nombre.trim(),
          rut: rut.trim(),
          local: {
            id: localId as number,
          },
        },
      });

      onSuccess("Usuario autorizado actualizado exitosamente");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al actualizar el usuario autorizado";
      onError(errorMessage);
    }
  };

  const handleClose = () => {
    if (!updateMutation.isPending) {
      setNombre("");
      setRut("");
      setLocalId("");
      setErrorNombre("");
      setErrorRut("");
      setErrorLocal("");
      onClose();
    }
  };

  if (!usuario) return null;

  return (
    <Modal open={open} onClose={handleClose} keepMounted>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          maxWidth: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Editar Usuario Autorizado
        </Typography>

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
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="RUT"
              fullWidth
              required
              value={rut}
              onChange={(e) => {
                setRut(e.target.value);
                setErrorRut("");
              }}
              error={!!errorRut}
              helperText={errorRut}
              disabled={updateMutation.isPending}
              placeholder="12345678-9"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth required error={!!errorLocal}>
              <InputLabel>Local</InputLabel>
              <Select
                value={localId}
                label="Local"
                onChange={(e) => {
                  setLocalId(e.target.value as number);
                  setErrorLocal("");
                }}
                disabled={updateMutation.isPending}
              >
                {locales.map((local) => (
                  <MenuItem key={local.id} value={local.id}>
                    {local.nombre}
                  </MenuItem>
                ))}
              </Select>
              {errorLocal && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {errorLocal}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={handleClose}
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
        </Box>
      </Box>
    </Modal>
  );
}

