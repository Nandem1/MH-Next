"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Modal,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { useCreateUsuarioAutorizado } from "@/hooks/useUsuariosAutorizados";

interface CrearUsuarioAutorizadoModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function CrearUsuarioAutorizadoModal({
  open,
  onClose,
  onSuccess,
  onError,
}: CrearUsuarioAutorizadoModalProps) {
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [errorNombre, setErrorNombre] = useState("");
  const [errorRut, setErrorRut] = useState("");

  const createMutation = useCreateUsuarioAutorizado();
  // Local fijo: LA CANTERA (id: 1)
  const localId = 1;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

    if (hasErrors) return;

    try {
      await createMutation.mutateAsync({
        nombre: nombre.trim(),
        rut: rut.trim(),
        local: {
          id: localId as number,
        },
      });

      // Limpiar formulario
      setNombre("");
      setRut("");
      setErrorNombre("");
      setErrorRut("");

      onSuccess("Usuario autorizado creado exitosamente");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al crear el usuario autorizado";
      onError(errorMessage);
    }
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
      setNombre("");
      setRut("");
      setErrorNombre("");
      setErrorRut("");
      onClose();
    }
  };

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
          Crear Usuario Autorizado
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
              disabled={createMutation.isPending}
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
              disabled={createMutation.isPending}
              placeholder="12345678-9"
            />
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={handleClose}
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
        </Box>
      </Box>
    </Modal>
  );
}

