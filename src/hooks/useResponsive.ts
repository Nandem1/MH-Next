// src/hooks/useResponsive.ts
import { useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

export function useResponsive(query: string): boolean {
  const media = useMediaQuery(query);
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    // Esto asegura que se evalúe *después* del mount inicial
    setIsMatch(media);
  }, [media]);

  return isMatch;
}
