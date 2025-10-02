"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type NextThemeProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: NextThemeProps) {
  //1.- Delegate the theming logic to next-themes while preserving the component API.
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
