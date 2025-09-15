import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeCtx = createContext({
  theme: "light",
  resolved: "light",
  isDark: false,
  setTheme: () => {},
  toggle: () => {},
});

export function ThemeProvider({ children, storageKey = "yamato.theme" }) {
  const init = () => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem(storageKey) === "dark" ? "dark" : "light";
  };

  const [theme, setTheme] = useState(init);

  useEffect(() => {
    localStorage.setItem(storageKey, theme);
    document.documentElement.setAttribute("data-theme", theme); // use in CSS: [data-theme='dark']
  }, [theme, storageKey]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const value = useMemo(
    () => ({ theme, resolved: theme, isDark: theme === "dark", setTheme, toggle }),
    [theme]
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}
