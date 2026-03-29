export const theme = {
  colors: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    border: '#E5E5E5',
    borderDark: '#CCCCCC',

    textPrimary: '#111111',
    textSecondary: '#757575',
    textDisabled: '#BDBDBD',
    textInverse: '#FFFFFF',

    brand: '#111111',
    brandHover: '#333333',

    accentGreen: '#00A651',
    accentRed: '#E53935',
    accentGold: '#F5A623',

    white: '#FFFFFF',
    black: '#000000',

    adminBg: '#1A1A2E',
    adminSidebar: '#16213E',
    adminAccent: '#0F3460',
    adminText: '#E0E0E0',
  },

  typography: {
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",

    size: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      md: '1.125rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '2rem',
      '3xl': '2.5rem',
      '4xl': '3rem',
    },

    weight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },

    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      loose: 1.75,
    },

    letterSpacing: {
      tight: '-0.01em',
      normal: '0em',
      wide: '0.05em',
      wider: '0.1em',
    },
  },

  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },

  borderRadius: {
    none: '0',
    sm: '2px',
    base: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(0,0,0,0.06)',
    base: '0 2px 8px rgba(0,0,0,0.10)',
    md: '0 4px 16px rgba(0,0,0,0.12)',
    lg: '0 8px 32px rgba(0,0,0,0.16)',
    xl: '0 16px 48px rgba(0,0,0,0.20)',
  },

  breakpoints: {
    xs: '375px',
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1440px',
  },

  transitions: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '400ms ease',
  },

  zIndex: {
    base: 0,
    raised: 10,
    dropdown: 20,
    sticky: 30,
    overlay: 40,
    modal: 50,
    toast: 60,
  },
}
