export const colors = {
  primary: {
    DEFAULT: "#0EA5E9",
    dark: "#0284C7",
    light: "#E0F2FE",
    50: "#F0F9FF",
    100: "#E0F2FE",
    200: "#BAE6FD",
    300: "#7DD3FC",
    400: "#38BDF8",
    500: "#0EA5E9",
    600: "#0284C7",
    700: "#0369A1",
    800: "#075985",
    900: "#0C4A6E",
  },
  secondary: {
    DEFAULT: "#1E293B",
    light: "#334155",
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },
  accent: {
    DEFAULT: "#F59E0B",
    dark: "#D97706",
    light: "#FEF3C7",
  },
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
} as const

export const typography = {
  fontFamily: {
    sans: "'Inter', system-ui, -apple-system, sans-serif",
    arabic: "'Cairo', system-ui, -apple-system, sans-serif",
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
  },
} as const

export const spacing = {
  section: {
    sm: "py-12 md:py-16",
    DEFAULT: "py-16 md:py-20",
    lg: "py-20 md:py-24",
    xl: "py-24 md:py-32",
  },
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
} as const

export const animation = {
  duration: {
    fast: 0.2,
    DEFAULT: 0.3,
    slow: 0.5,
    slower: 0.7,
  },
  ease: [0.25, 0.1, 0.25, 1],
} as const
