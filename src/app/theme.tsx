/**
 * Material-UI Theme Configuration
 * 
 * This file defines the custom theme for the Material-UI components.
 * It includes color palette, typography, and component styling overrides.
 * 
 * Purpose: Centralized theme configuration for consistent UI design
 * Dependencies: @mui/material/styles
 */

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
    background: { default: '#f6f7fb', paper: '#fff' }
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

export default theme;
