"use client";

import { useEffect } from "react";

import { useDesktopStore } from "@/stores/desktop.store";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useDesktopStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
  }, [theme]);

  return <>{children}</>;
}

