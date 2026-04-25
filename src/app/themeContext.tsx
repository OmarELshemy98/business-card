'use client';

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

// Define the shape of our theme context
interface ThemeContextProps {
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// A custom hook to use the theme context easily
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProviderWrapper');
  }
  return context;
};

// The wrapper component that provides the theme
export const ThemeProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  }, []);

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: themeMode,
        primary: { main: '#1976d2' },
        secondary: { main: '#9c27b0' },
        background: { default: themeMode === 'light' ? '#f6f7fb' : '#121212', paper: themeMode === 'light' ? '#fff' : '#1e1e1e' }
      },
      shape: { borderRadius: 12 },
      typography: {
        fontFamily: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'].join(','),
        h6: { fontWeight: 700 },
        button: { textTransform: 'none', fontWeight: 600 }
      },
      components: {
        MuiButton: {
          defaultProps: { disableElevation: true }
        },
        MuiPaper: {
          styleOverrides: { root: { borderRadius: 12 } }
        },
        MuiTextField: {
          defaultProps: { size: 'small', variant: 'outlined' }
        }
      }
    });
  }, [themeMode]);

  const value = useMemo(() => ({ themeMode, toggleTheme }), [themeMode, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
