import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeCtx = createContext({ theme: "system", resolved: "light", setTheme: () => {} });

const getSystem = () =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export function ThemeProvider({ children, storageKey = "yamato.theme" }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(storageKey) || "system");
  const [sys, setSys] = useState(() => (typeof window === "undefined" ? "light" : getSystem()));

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSys(getSystem());
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const resolved = theme === "system" ? sys : theme;

  useEffect(() => {
    // Put theme on <html> so CSS can use [data-theme=...]
    document.documentElement.setAttribute("data-theme", resolved);
  }, [resolved]);

  const value = useMemo(() => ({ theme, resolved, setTheme }), [theme, resolved]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}

export function ThemeToggle() {
  const { theme, resolved, setTheme } = useTheme();
  const cycle = () => setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light");
  const label = theme === "system" ? `System (${resolved})` : theme;
  return (
    <button className="btn" onClick={cycle} aria-label="Toggle theme">
      {resolved === "dark" ? "☾" : "☀︎"} {label}
    </button>
  );
}
