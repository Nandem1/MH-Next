"use client";

import { TextField, Button, Typography, Box, Snackbar, Alert, CircularProgress, Paper, Link } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInViewAnimations } from "@/hooks/useAnimations";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { AxiosError } from "axios";
import { forgotPassword } from "@/services/authService";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Animaciones individuales por elemento cuando entran en vista
  const { ref: logoRef, ...logoInView } = useInViewAnimations({ threshold: 0.3 });
  const { ref: titleRef, ...titleInView } = useInViewAnimations({ threshold: 0.3 });
  const { ref: formRef, ...formInView } = useInViewAnimations({ threshold: 0.2 });
  const { ref: footerRef, ...footerInView } = useInViewAnimations({ threshold: 0.3 });

  /* helpers */
  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Validación en tiempo real
  useEffect(() => {
    if (email && !isEmailValid(email)) {
      setErrorEmail("El correo electrónico no es válido.");
    } else {
      setErrorEmail("");
    }
  }, [email]);

  /* submit */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (errorEmail || !email) return;

    try {
      setLoading(true);
      const response = await forgotPassword(email);

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
      const message = axiosError.response?.data?.message || "❌ Error al enviar el enlace de restablecimiento.";

      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || !email || !!errorEmail;

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
                🔐 Restablecer Contraseña
              </Typography>
              
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mb: 3 }}
              >
                {success 
                  ? "Revisa tu correo electrónico para continuar con el restablecimiento"
                  : "Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña"
                }
              </Typography>
            </motion.div>

            {!success ? (
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errorEmail}
                  helperText={errorEmail}
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
                  {loading ? <CircularProgress size={24} /> : 'Enviar Enlace'}
                </Button>
              </Box>
            ) : (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="success.main" sx={{ mb: 2 }}>
                  ✅ Enlace Enviado
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
