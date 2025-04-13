"use client";

import { useState } from "react";

export function useSnackbar() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error" | "info" | "warning">("info");

  const showSnackbar = (text: string, type: "success" | "error" | "info" | "warning" = "info") => {
    setMessage(text);
    setSeverity(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return { open, message, severity, showSnackbar, handleClose };
}
