import React from "react";
import { useTheme } from "./ThemeProvider"; // adjust path if needed

export function ThemeToggle() {
  const { theme, isDark, toggle } = useTheme();

  return (
    <button
      className={`theme-toggle ${isDark ? "is-dark" : "is-light"}`}
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle theme"
      type="button"
      onClick={toggle}
      title={isDark ? "Dark" : "Light"}
    >
      <span className="theme-toggle__icon theme-toggle__icon--sun" aria-hidden>☀︎</span>
      <span className="theme-toggle__icon theme-toggle__icon--moon" aria-hidden>☾</span>
      <span className="theme-toggle__thumb" aria-hidden />
      <span className="sr-only">{theme === "dark" ? "Dark mode" : "Light mode"}</span>
    </button>
  );
}
