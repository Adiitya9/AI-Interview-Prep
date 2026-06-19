import { createTheme, alpha } from '@mui/material/styles';

const glassEffect = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
};

const glassEffectHover = {
  background: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  boxShadow: '0 8px 32px rgba(124, 58, 237, 0.15)',
};

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C3AED',
      light: '#A78BFA',
      dark: '#5B21B6',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#06B6D4',
      light: '#22D3EE',
      dark: '#0891B2',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0F0A1A',
      paper: 'rgba(255, 255, 255, 0.05)',
    },
    surface: {
      main: 'rgba(255, 255, 255, 0.05)',
      light: 'rgba(255, 255, 255, 0.08)',
      dark: 'rgba(255, 255, 255, 0.03)',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
    text: {
      primary: '#F1F5F9',
      secondary: 'rgba(241, 245, 249, 0.7)',
      disabled: 'rgba(241, 245, 249, 0.38)',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.02em',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.03em',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 2px 8px rgba(0, 0, 0, 0.15)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 6px 24px rgba(0, 0, 0, 0.25)',
    '0 8px 32px rgba(0, 0, 0, 0.3)',
    '0 12px 40px rgba(0, 0, 0, 0.35)',
    '0 16px 48px rgba(0, 0, 0, 0.4)',
    '0 20px 56px rgba(0, 0, 0, 0.45)',
    '0 24px 64px rgba(0, 0, 0, 0.5)',
    '0 28px 72px rgba(0, 0, 0, 0.55)',
    '0 32px 80px rgba(0, 0, 0, 0.6)',
    ...Array(14).fill('0 32px 80px rgba(0, 0, 0, 0.6)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0F0A1A 0%, #1A0A2E 50%, #0F0A1A 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
        '*::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '*::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.03)',
        },
        '*::-webkit-scrollbar-thumb': {
          background: 'rgba(124, 58, 237, 0.3)',
          borderRadius: '3px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(124, 58, 237, 0.5)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          ...glassEffect,
          borderRadius: 16,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            ...glassEffectHover,
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          ...glassEffect,
          borderRadius: 16,
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.9rem',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
        },
        contained: {
          background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
          boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #6D28D9 0%, #0891B2 100%)',
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&.Mui-disabled': {
            background: 'rgba(255, 255, 255, 0.12)',
            color: 'rgba(255, 255, 255, 0.3)',
          },
        },
        outlined: {
          borderColor: 'rgba(124, 58, 237, 0.5)',
          color: '#A78BFA',
          '&:hover': {
            borderColor: '#7C3AED',
            background: 'rgba(124, 58, 237, 0.1)',
          },
        },
        text: {
          color: '#A78BFA',
          '&:hover': {
            background: 'rgba(124, 58, 237, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            transition: 'all 0.3s ease',
            '& fieldset': {
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'border-color 0.3s ease',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(124, 58, 237, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#7C3AED',
              borderWidth: '2px',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 4px rgba(124, 58, 237, 0.1)',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(241, 245, 249, 0.5)',
            '&.Mui-focused': {
              color: '#A78BFA',
            },
            '&.MuiInputLabel-shrink': {
              padding: '0 8px',
              marginLeft: '-4px',
            },
          },
          '& .MuiInputBase-input': {
            color: '#F1F5F9',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          ...glassEffect,
          '&.MuiChip-colorPrimary': {
            background: 'rgba(124, 58, 237, 0.2)',
            borderColor: 'rgba(124, 58, 237, 0.3)',
            color: '#A78BFA',
          },
          '&.MuiChip-colorSuccess': {
            background: 'rgba(16, 185, 129, 0.2)',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            color: '#34D399',
          },
          '&.MuiChip-colorError': {
            background: 'rgba(239, 68, 68, 0.2)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            color: '#F87171',
          },
          '&.MuiChip-colorWarning': {
            background: 'rgba(245, 158, 11, 0.2)',
            borderColor: 'rgba(245, 158, 11, 0.3)',
            color: '#FBBF24',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          ...glassEffect,
          borderRadius: 20,
          background: 'rgba(15, 10, 26, 0.95)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          ...glassEffect,
          borderRadius: 12,
          background: 'rgba(15, 10, 26, 0.95)',
          marginTop: 8,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          ...glassEffect,
          background: 'rgba(15, 10, 26, 0.9)',
          borderRadius: 8,
          fontSize: '0.8rem',
          padding: '8px 14px',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
        bar: {
          borderRadius: 8,
          background: 'linear-gradient(90deg, #7C3AED, #06B6D4)',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          ...glassEffect,
          borderRadius: '16px !important',
          marginBottom: 12,
          '&:before': { display: 'none' },
          '&.Mui-expanded': {
            margin: '0 0 12px 0',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          '&.Mui-expanded': {
            minHeight: 56,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.9rem',
          minHeight: 48,
          '&.Mui-selected': {
            color: '#A78BFA',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          background: 'linear-gradient(90deg, #7C3AED, #06B6D4)',
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 52,
          height: 30,
          padding: 0,
        },
        switchBase: {
          padding: 3,
          '&.Mui-checked': {
            transform: 'translateX(22px)',
            '& + .MuiSwitch-track': {
              backgroundColor: '#7C3AED',
              opacity: 1,
            },
          },
        },
        thumb: {
          width: 24,
          height: 24,
        },
        track: {
          borderRadius: 15,
          backgroundColor: 'rgba(255,255,255,0.15)',
          opacity: 1,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.06)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(124, 58, 237, 0.15)',
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
          fontWeight: 600,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          ...glassEffect,
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7C3AED',
      light: '#A78BFA',
      dark: '#5B21B6',
    },
    secondary: {
      main: '#06B6D4',
      light: '#22D3EE',
      dark: '#0891B2',
    },
    background: {
      default: '#F8FAFC',
      paper: 'rgba(255, 255, 255, 0.8)',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          borderRadius: 16,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(124, 58, 237, 0.1)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(135deg, #6D28D9 0%, #0891B2 100%)',
          },
        },
      },
    },
  },
});
