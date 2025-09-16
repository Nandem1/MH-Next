"use client";

import { TextField, Button, Typography, Box, Snackbar, Alert, CircularProgress, Paper, Link } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInViewAnimations } from "@/hooks/useAnimations";

import { useAuth } from "@/hooks/useAuth";
import { useSnackbar } from "@/hooks/useSnackbar";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const { open, message, severity, showSnackbar, handleClose } = useSnackbar();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  // Animaciones individuales por elemento cuando entran en vista
  const { ref: logoRef, ...logoInView } = useInViewAnimations({ threshold: 0.3 });
  const { ref: titleRef, ...titleInView } = useInViewAnimations({ threshold: 0.3 });
  const { ref: formRef, ...formInView } = useInViewAnimations({ threshold: 0.2 });
  const { ref: footerRef, ...footerInView } = useInViewAnimations({ threshold: 0.3 });

  // Verificar si hay un token válido al cargar la página (sin bloquear el render)
  useEffect(() => {
    // Pequeño delay para permitir que las animaciones se inicialicen
    const timer = setTimeout(() => {
      const token = localStorage.getItem("authToken");
      const user = localStorage.getItem("usuario");
      
      if (token && user) {
        router.push("/dashboard/inicio");
      }
    }, 100); // Delay mínimo para evitar parpadeos

    return () => clearTimeout(timer);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.success) showSnackbar(result.message, "error");
  };

  /* mensaje post‑logout --------------------------------------------------- */
  useEffect(() => {
    if (localStorage.getItem("showLogoutMessage") === "true") {
      showSnackbar("Sesión cerrada exitosamente", "success");
      localStorage.removeItem("showLogoutMessage");
    }
  }, [showSnackbar]);


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
                Iniciar Sesión
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
                  type="email"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
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
                  disabled={loading}
                  required
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
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.9 }}
              >
                <Button
                  fullWidth
                  variant="text"
                  onClick={() => router.push("/forgot-password")}
                  disabled={loading}
                  sx={{ 
                    mt: 2,
                    color: "text.secondary",
                    fontSize: "0.875rem"
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </Button>
              </motion.div>
            </Box>
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
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
