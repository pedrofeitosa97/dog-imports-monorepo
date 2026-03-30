const base = {
  typography: {
    fontFamily: "'Manrope', 'Helvetica Neue', Arial, sans-serif",
    size: {
      xs:   '0.70rem',
      sm:   '0.8125rem',
      base: '0.9375rem',
      md:   '1.0625rem',
      lg:   '1.1875rem',
      xl:   '1.375rem',
      '2xl':'1.875rem',
      '3xl':'2.375rem',
      '4xl':'3rem',
    },
    weight: { light:300, regular:400, medium:500, semibold:600, bold:700, extrabold:800 },
    lineHeight: { tight:1.15, normal:1.55, loose:1.75 },
    letterSpacing: { tight:'-0.02em', normal:'0em', wide:'0.04em', wider:'0.09em' },
  },
  spacing: {
    0:'0', 1:'0.25rem', 2:'0.5rem', 3:'0.75rem', 4:'1rem',
    5:'1.25rem', 6:'1.5rem', 8:'2rem', 10:'2.5rem',
    12:'3rem', 16:'4rem', 20:'5rem', 24:'6rem',
  },
  borderRadius: {
    none:'0', sm:'4px', base:'8px', md:'12px', lg:'16px', xl:'24px', full:'9999px',
  },
  transitions: { fast:'140ms ease', normal:'240ms ease', slow:'380ms ease' },
  zIndex: { base:0, raised:10, dropdown:20, sticky:30, overlay:40, modal:50, toast:60 },
  breakpoints: { xs:'375px', sm:'480px', md:'768px', lg:'1024px', xl:'1280px', '2xl':'1440px' },

  // admin colors — fixos
  adminColors: {
    bg:        '#080808',
    sidebar:   '#141416',
    accent:    '#2563eb',
    text:      '#f5f5f7',
    textMuted: 'rgba(255,255,255,0.45)',
    border:    'rgba(255,255,255,0.07)',
  },
}

const orange = {
  brand:      '#f97316',
  brandHover: '#ea6c0a',
  brandLight: 'rgba(249,115,22,0.12)',
  brandGlow:  'rgba(249,115,22,0.25)',
}

export const darkTheme = {
  ...base,
  mode: 'dark',

  shadows: {
    sm:     '0 1px 3px rgba(0,0,0,0.4)',
    base:   '0 4px 16px rgba(0,0,0,0.5)',
    md:     '0 8px 32px rgba(0,0,0,0.6)',
    lg:     '0 16px 48px rgba(0,0,0,0.7)',
    xl:     '0 24px 64px rgba(0,0,0,0.85)',
    orange: '0 8px 32px rgba(249,115,22,0.30)',
  },

  colors: {
    // admin
    adminBg:        '#080808',
    adminSidebar:   '#141416',
    adminAccent:    '#2563eb',
    adminText:      '#f5f5f7',
    adminTextMuted: 'rgba(255,255,255,0.45)',
    adminBorder:    'rgba(255,255,255,0.07)',

    // brand
    ...orange,

    // surfaces
    background:   '#080808',
    surface:      '#111111',
    surfaceHover: '#161616',
    card:         '#111111',

    // borders
    border:       'rgba(255,255,255,0.08)',
    borderMedium: 'rgba(255,255,255,0.13)',

    // text
    textPrimary:   '#f5f5f7',
    textSecondary: 'rgba(255,255,255,0.5)',
    textDisabled:  'rgba(255,255,255,0.25)',
    textInverse:   '#080808',

    // accents
    accentGreen: '#22c55e',
    accentRed:   '#ef4444',
    accentGold:  '#f59e0b',

    white: '#ffffff',
    black: '#000000',

    // header
    headerBg:     'rgba(8,8,8,0.85)',
    headerBorder: 'rgba(255,255,255,0.07)',
    mobileMenuBg: '#0d0d0d',
  },
}

export const lightTheme = {
  ...base,
  mode: 'light',

  shadows: {
    sm:     '0 1px 3px rgba(0,0,0,0.08)',
    base:   '0 4px 16px rgba(0,0,0,0.09)',
    md:     '0 8px 32px rgba(0,0,0,0.11)',
    lg:     '0 16px 48px rgba(0,0,0,0.13)',
    xl:     '0 24px 64px rgba(0,0,0,0.16)',
    orange: '0 8px 32px rgba(249,115,22,0.22)',
  },

  colors: {
    // admin (always dark)
    adminBg:        '#080808',
    adminSidebar:   '#141416',
    adminAccent:    '#2563eb',
    adminText:      '#f5f5f7',
    adminTextMuted: 'rgba(255,255,255,0.45)',
    adminBorder:    'rgba(255,255,255,0.07)',

    // brand
    ...orange,

    // surfaces
    background:   '#fafafa',
    surface:      '#f2f2f2',
    surfaceHover: '#ebebeb',
    card:         '#ffffff',

    // borders
    border:       'rgba(0,0,0,0.08)',
    borderMedium: 'rgba(0,0,0,0.14)',

    // text
    textPrimary:   '#0a0a0a',
    textSecondary: 'rgba(0,0,0,0.5)',
    textDisabled:  'rgba(0,0,0,0.25)',
    textInverse:   '#ffffff',

    // accents
    accentGreen: '#16a34a',
    accentRed:   '#dc2626',
    accentGold:  '#d97706',

    white: '#ffffff',
    black: '#000000',

    // header
    headerBg:     'rgba(250,250,250,0.88)',
    headerBorder: 'rgba(0,0,0,0.07)',
    mobileMenuBg: '#ffffff',
  },
}

// compatibilidade — exporta dark como default
export const theme = darkTheme
