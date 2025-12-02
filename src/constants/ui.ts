/**
 * UI Constants
 * Centralized constants for colors, spacing, breakpoints, and other UI values
 */

export const COLORS = {
  background: {
    primary: "#202020",
    secondary: "#2a2a2a",
    tertiary: "#1a1a1a",
    dark: "#0e0e16",
  },
  text: {
    primary: "#ffffff",
    secondary: "#999999",
    muted: "#666666",
  },
  accent: {
    primary: "#d34836",
    secondary: "#dd4837",
    hover: "#b83a2a",
  },
  border: {
    default: "#333333",
    light: "#444444",
    accent: "#d34836",
  },
  status: {
    success: "#1a4d1a",
    error: "#4d1a1a",
  },
} as const;

export const SPACING = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  "2xl": "2rem",
  "3xl": "3rem",
  "4xl": "4rem",
} as const;

export const BREAKPOINTS = {
  mobile: "768px",
  tablet: "1024px",
  desktop: "1280px",
  smallMobile: "350px",
} as const;

export const HEADER_HEIGHT = {
  desktop: 70,
  mobile: 50,
} as const;

export const BORDER_RADIUS = {
  sm: "6px",
  md: "8px",
  lg: "12px",
  full: "50%",
} as const;

export const TRANSITIONS = {
  fast: "0.1s",
  normal: "0.2s",
  slow: "0.3s",
} as const;

export const FONT_SIZES = {
  xs: "0.75rem",
  sm: "0.85rem",
  base: "0.9rem",
  md: "1rem",
  lg: "1.1rem",
  xl: "1.5rem",
  "2xl": "2rem",
} as const;

export const Z_INDEX = {
  base: 1,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modal: 1000,
  header: 10000,
  modalOverlay: 99999,
} as const;

