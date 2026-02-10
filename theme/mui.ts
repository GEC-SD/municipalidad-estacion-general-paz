import { createTheme } from '@mui/material/styles';

// ============================================================================
// THEME MUI - MUNICIPALIDAD GENERAL PAZ
// ============================================================================
// Paleta basada en el logo institucional:
// - Azul (espiral interior) → Primary
// - Rojo ladrillo (espiral exterior) → Secondary
// - Naranja/Ámbar (espiral media) → Warning / Accent
// - Gris oscuro (texto del logo) → Text
// ============================================================================

const theme = createTheme({
  palette: {
    // Azul institucional - Espiral interior del logo
    primary: {
      main: '#2E86C1',
      light: '#5DA9D9',
      dark: '#1A5F8B',
      contrastText: '#FFFFFF',
    },
    // Rojo ladrillo - Espiral exterior del logo
    secondary: {
      main: '#B52A1C',
      light: '#D4554A',
      dark: '#8C1F14',
      contrastText: '#FFFFFF',
    },
    // Estados y feedback
    success: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#2E86C1',
      light: '#5DA9D9',
      dark: '#1A5F8B',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#F5A623',
      light: '#F7BC5A',
      dark: '#C4841B',
      contrastText: '#333333',
    },
    error: {
      main: '#B52A1C',
      light: '#D4554A',
      dark: '#8C1F14',
      contrastText: '#FFFFFF',
    },
    // Backgrounds
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    // Textos
    text: {
      primary: '#333333',
      secondary: '#666666',
      disabled: '#BDBDBD',
    },
    // Divisores
    divider: '#E0E0E0',
  },

  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),

    // Títulos y encabezados
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0em',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.6,
      letterSpacing: '0.0075em',
    },

    // Subtítulos
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.75,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: '0.00714em',
    },

    // Textos
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0.01071em',
    },

    // Botones y labels
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
      letterSpacing: '0.03333em',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 2.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
    },
  },

  shape: {
    borderRadius: 8,
  },

  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 2px 8px rgba(0, 0, 0, 0.1)',
    '0px 4px 12px rgba(0, 0, 0, 0.1)',
    '0px 4px 16px rgba(0, 0, 0, 0.12)',
    '0px 8px 20px rgba(0, 0, 0, 0.15)',
    '0px 8px 24px rgba(0, 0, 0, 0.15)',
    '0px 12px 28px rgba(0, 0, 0, 0.15)',
    '0px 12px 32px rgba(0, 0, 0, 0.15)',
    '0px 16px 36px rgba(0, 0, 0, 0.15)',
    '0px 16px 40px rgba(0, 0, 0, 0.15)',
    '0px 20px 44px rgba(0, 0, 0, 0.15)',
    '0px 20px 48px rgba(0, 0, 0, 0.15)',
    '0px 24px 52px rgba(0, 0, 0, 0.15)',
    '0px 24px 56px rgba(0, 0, 0, 0.15)',
    '0px 28px 60px rgba(0, 0, 0, 0.15)',
    '0px 28px 64px rgba(0, 0, 0, 0.15)',
    '0px 32px 68px rgba(0, 0, 0, 0.15)',
    '0px 32px 72px rgba(0, 0, 0, 0.15)',
    '0px 36px 76px rgba(0, 0, 0, 0.15)',
    '0px 36px 80px rgba(0, 0, 0, 0.15)',
    '0px 40px 84px rgba(0, 0, 0, 0.15)',
    '0px 40px 88px rgba(0, 0, 0, 0.15)',
    '0px 44px 92px rgba(0, 0, 0, 0.15)',
    '0px 44px 96px rgba(0, 0, 0, 0.15)',
  ],

  components: {
    // Botones
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          },
          '&:active': {
            boxShadow: 'none',
          },
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.8125rem',
        },
        sizeLarge: {
          padding: '10px 20px',
          fontSize: '0.9375rem',
        },
      },
    },

    // Cards
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: 12,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },

    // AppBar / Navbar
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },

    // Paper
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        },
        elevation2: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },

    // Inputs
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },

    // Chips
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },

    // Tabs
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },

    // Links
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },

    // Dividers
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#E0E0E0',
        },
      },
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme;

