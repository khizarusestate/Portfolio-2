import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const isDark = true;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    document.body.classList.remove("theme-dark", "theme-light");
    document.body.classList.add("theme-dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
