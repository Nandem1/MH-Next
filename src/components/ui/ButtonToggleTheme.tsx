'use client';

import Button from "@mui/material/Button";
import { useThemeContext } from '@/context/ThemeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export function ButtonToggleTheme() {
  const { toggleTheme, mode } = useThemeContext();

  return (
    <Button 
      onClick={toggleTheme}
      variant="outlined"
      size="small"
      startIcon={mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
    >
      {mode === 'light' ? 'Dark' : 'Light'}
    </Button>
  );
}
