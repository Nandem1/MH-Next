"use client";

import { TextField, Button, Typography, Box, Snackbar, Alert, CircularProgress, Paper, Link } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInViewAnimations } from "@/hooks/useAnimations";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { AxiosError } from "axios";
import { register } from "@/services/authService";
import SeleccionarUsuarioModal from "@/components/usuarios/SeleccionarUsuarioModal";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalSeleccionarOpen, setModalSeleccionarOpen] = useState(false);
  const [authUserId, setAuthUserId] = useState<number | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Animaciones individuales por elemento cuando entran en vista
  const { ref: logoRef, ...logoInView } = useInViewAnimations({ threshold: 0.3 });
  const { ref: titleRef, ...titleInView } = useInViewAnimations({ threshold: 0.3 });
  const { ref: formRef, ...formInView } = useInViewAnimations({ threshold: 0.2 });
  const { ref: footerRef, ...footerInView } = useInViewAnimations({ threshold: 0.3 });

  /* helpers */
  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Validación en tiempo real como en el modal
  useEffect(() => {
    if (email && !isEmailValid(email)) {
      setErrorEmail("El correo electrónico no es válido.");
    } else {
      setErrorEmail("");
    }
  }, [email]);

  useEffect(() => {
    if (password && password.length < 6) {
      setErrorPassword("La contraseña debe tener al menos 6 caracteres.");
    } else {
      setErrorPassword("");
    }
  }, [password]);

  /* submit */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (errorEmail || errorPassword || !email || !password) return;

    try {
      setLoading(true);
      const response = await register(email, password);

      // Guardar el authUserId y abrir modal de selección
      setAuthUserId(response.user.id);
      setModalSeleccionarOpen(true);
      
      // Mostrar mensaje de éxito
      setSnackbarOpen(true);
      
      // Limpiar formulario
      setEmail("");
      setPassword("");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data?.message || "❌ Error al registrar.";

      if (message?.toLowerCase().includes("correo")) setErrorEmail(message);
      else if (message?.toLowerCase().includes("contraseña")) setErrorPassword(message);
    } finally {
      setLoading(false);
    }
  };

  const disabled =
    loading || !email || !password || !!errorEmail || !!errorPassword;

  const handleSeleccionarUsuarioSuccess = () => {
    setModalSeleccionarOpen(false);
    setAuthUserId(null);
    setIsRedirecting(true);
    
    // Redirigir a login después de completar el registro con transición suave
    setTimeout(() => {
      router.push("/login");
    }, 600);
  };

  const handleSeleccionarUsuarioError = (message: string) => {
    // En caso de error, mostrar mensaje y permitir reintentar
    console.error("Error en selección de usuario:", message);
    // El modal maneja sus propios errores internamente
  };

  /* layout */
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
        position: "relative",
        opacity: isRedirecting ? 0.7 : 1,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      {/* centro ---------------------------------------------------------- */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 4,
          marginBottom: '32px',
        }}
      >
        {/* Logo fuera del formulario */}
        <motion.div
          ref={logoRef}
          {...logoInView}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ 
            textAlign: 'center', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Image
            src="/assets/multihouse-logo-black.png"
            alt="Multihouse Logo"
            width={340}
            height={210}
            style={{
              filter: 'invert(1)',
              objectFit: 'contain'
            }}
            priority
          />
        </motion.div>

        <motion.div
          ref={formRef}
          {...formInView}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <Paper
            component={motion.div}
            whileHover={{ 
              y: -4,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
            elevation={4}
            sx={{
              width: { xs: "100%", sm: "420px", md: "380px" },
              maxWidth: "100%",
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
            }}
          >
            {/* Título */}
            <motion.div
              ref={titleRef}
              {...titleInView}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            >
              <Typography variant="h5" fontWeight={700} textAlign="center" mb={3}>
                Crear nuevo usuario
              </Typography>
            </motion.div>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
              >
                <TextField
                  label="Correo electrónico"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errorEmail}
                  helperText={errorEmail}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
              >
                <TextField
                  label="Contraseña"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errorPassword}
                  helperText={errorPassword}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 3, py: 1.25, fontWeight: 600 }}
                  disabled={disabled}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Crear usuario"
                  )}
                </Button>
              </motion.div>
            </Box>


            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={() => setSnackbarOpen(false)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert severity="success" sx={{ width: "100%" }}>
                Cuenta registrada exitosamente
              </Alert>
            </Snackbar>
          </Paper>
        </motion.div>
      </Box>

      {/* Indicador de redirección */}
      {isRedirecting && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              backgroundColor: "background.paper",
              p: 3,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress size={24} />
            <Typography variant="body1">
              Redirigiendo al login...
            </Typography>
          </Box>
        </Box>
      )}

      {/* footer ---------------------------------------------------------- */}
      <motion.div
        ref={footerRef}
        {...footerInView}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Box
          component="footer"
          sx={{
            py: 2,
            textAlign: "center",
            fontSize: "0.8rem",
            color: "text.secondary",
          }}
        >
          © 2025 Mercado House SPA · Desarrollado por{" "}
          <Link
            href="https://github.com/Nandem1"
            target="_blank"
            underline="hover"
          >
            Nandev
          </Link>
        </Box>
      </motion.div>

      {/* Modal de selección de usuario */}
      {modalSeleccionarOpen && authUserId && (
        <SeleccionarUsuarioModal
          open={modalSeleccionarOpen}
          authUserId={authUserId}
          onSuccess={handleSeleccionarUsuarioSuccess}
          onError={handleSeleccionarUsuarioError}
        />
      )}
    </Box>
  );
}
