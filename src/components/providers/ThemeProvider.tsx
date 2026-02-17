"use client";

import { useEffect } from "react";

import { useDesktopStore } from "@/stores/desktop.store";
import { getAccentCssVariables } from "@/theme/accentColors";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useDesktopStore((state) => state.theme);
  const accentColor = useDesktopStore((state) => state.accentColor);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.accentColor = accentColor;

    const accentVariables = getAccentCssVariables(accentColor, theme);
    Object.entries(accentVariables).forEach(([variable, value]) => {
      root.style.setProperty(variable, value);
    });
  }, [accentColor, theme]);

  return <>{children}</>;
}
