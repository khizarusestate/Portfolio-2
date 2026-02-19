// Theme-aware color utilities
export const themeColors = {
  accent: {
    dark: 'amber-400',
    light: 'sky-600',
  },
  accentBg: {
    dark: 'amber-500',
    light: 'sky-500',
  },
  accentBorder: {
    dark: 'amber-400',
    light: 'sky-300',
  },
}

export function getThemeClass(property, isDark) {
  return `theme-dark:${property.replace('sky', 'amber').replace('blue', 'amber')} theme-light:${property}`
}
