"use client";

import { TextField, Button, Typography, Box, Snackbar, Alert, CircularProgress, Paper, Link } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInViewAnimations } from "@/hooks/useAnimations";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AxiosError } from "axios";
import { verifyResetToken, resetPassword } from "@/services/authService";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [success, setSuccess] = useState(false);

  // Animaciones individuales por elemento cuando entran en vista
  const { ref: logoRef, ...logoInView } = useInViewAnimations({ threshold: 0.3 });
  const { ref: titleRef, ...titleInView } = useInViewAnimations({ threshold: 0.3 });
  const { ref: formRef, ...formInView } = useInViewAnimations({ threshold: 0.2 });
  const { ref: footerRef, ...footerInView } = useInViewAnimations({ threshold: 0.3 });

  // Obtener token de la URL
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      verifyToken(tokenFromUrl);
    } else {
      setSnackbarMessage('Token no encontrado en la URL');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setVerifying(false);
    }
  }, [searchParams]);

  // Verificar token
  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await verifyResetToken(tokenToVerify);
      
      if (response.success) {
        setTokenValid(true);
        setUserEmail(response.data?.email || "");
      } else {
        setSnackbarMessage(response.message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setTokenValid(false);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data?.message || "Error verificando token";
      setSnackbarMessage(message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setTokenValid(false);
    } finally {
      setVerifying(false);
    }
  };

  // Validación en tiempo real
  useEffect(() => {
    if (newPassword && newPassword.length < 8) {
      setErrorPassword("La contraseña debe tener al menos 8 caracteres.");
    } else {
      setErrorPassword("");
    }
  }, [newPassword]);

  useEffect(() => {
    if (confirmPassword && newPassword && confirmPassword !== newPassword) {
      setErrorConfirmPassword("Las contraseñas no coinciden.");
    } else {
      setErrorConfirmPassword("");
    }
  }, [confirmPassword, newPassword]);

  /* submit */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (errorPassword || errorConfirmPassword || !newPassword || !confirmPassword) return;

    try {
      setLoading(true);
      const response = await resetPassword(token, newPassword);

      if (response.success) {
        setSuccess(true);
        setSnackbarMessage(response.message);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        
        // Redirigir a login después de 3 segundos
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setSnackbarMessage(response.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data?.message || "❌ Error al restablecer la contraseña.";

      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || !newPassword || !confirmPassword || !!errorPassword || !!errorConfirmPassword;

  // Estado de verificación
  if (verifying) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "background.default",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="h6">Verificando token...</Typography>
        </Box>
      </Box>
    );
  }

  // Token inválido
  if (!tokenValid) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "background.default",
          px: 2,
        }}
      >
        <motion.div
          ref={logoRef}
          {...logoInView}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ 
            textAlign: 'center', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '2rem'
          }}
        >
          <Image
            src="/assets/multihouse-logo-black.png"
            alt="Multihouse Logo"
            width={280}
            height={170}
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
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              backgroundColor: "background.paper",
              textAlign: "center",
            }}
          >
            <Typography variant="h5" color="error" gutterBottom sx={{ mb: 2 }}>
              ❌ Token Inválido
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              El enlace de restablecimiento no es válido o ha expirado.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() => router.push("/forgot-password")}
              sx={{ mb: 2 }}
            >
              Solicitar Nuevo Enlace
            </Button>
            <Button
              variant="text"
              fullWidth
              onClick={() => router.push("/login")}
            >
              Volver al Login
            </Button>
          </Paper>
        </motion.div>
      </Box>
    );
  }

  /* layout */
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
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
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              backgroundColor: "background.paper",
            }}
          >
            <motion.div
              ref={titleRef}
              {...titleInView}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                align="center"
                sx={{ mb: 2, fontWeight: 600 }}
              >
                🔑 Nueva Contraseña
              </Typography>
              
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mb: 3 }}
              >
                {success 
                  ? "¡Contraseña restablecida exitosamente!"
                  : `Ingresa tu nueva contraseña para: ${userEmail}`
                }
              </Typography>
            </motion.div>

            {!success ? (
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Nueva Contraseña"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={!!errorPassword}
                  helperText={errorPassword || "Mínimo 8 caracteres"}
                  required
                  disabled={loading}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Confirmar Contraseña"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!errorConfirmPassword}
                  helperText={errorConfirmPassword}
                  required
                  disabled={loading}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={disabled}
                  sx={{ mb: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Restablecer Contraseña'}
                </Button>
              </Box>
            ) : (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="success.main" sx={{ mb: 2 }}>
                  ✅ Contraseña Restablecida
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Te redirigiremos al login en unos segundos...
                </Typography>
                <CircularProgress size={24} />
              </Box>
            )}

            <Button
              fullWidth
              variant="text"
              onClick={() => router.push("/login")}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              Volver al Login
            </Button>
          </Paper>
        </motion.div>
      </Box>

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

      {/* snackbar ---------------------------------------------------------- */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "background.default",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="h6">Cargando...</Typography>
        </Box>
      </Box>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
