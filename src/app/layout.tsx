'use client';

import { QueryProvider } from '@/providers/QueryProvider';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext'; // Cambió aquí
import { CssBaseline } from '@mui/material';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

