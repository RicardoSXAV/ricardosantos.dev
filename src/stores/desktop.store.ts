import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { DesktopApp, DesktopWindow } from '@/ts/interfaces/desktop.interfaces';
import { DEFAULT_NAV_APPS } from './data/desktop.data';
import { AccentColor, DEFAULT_ACCENT_COLOR } from '@/theme/accentColors';

export type NavigatorOrientation = 'bottom' | 'top' | 'left' | 'right';
export type ThemeVariant = 'light' | 'dark';

interface DesktopStore {
  navApps: DesktopApp[];
  trashedApps: DesktopApp[];
  windows: DesktopWindow[];
  activeWindowId: string | null;
  navigatorOrientation: NavigatorOrientation;
  theme: ThemeVariant;
  accentColor: AccentColor;
  windowGradient: string;

  setNavApps: (navApps: DesktopApp[]) => void;
  setTrashedApps: (trashedApps: DesktopApp[]) => void;
  setWindows: (windows: DesktopWindow[]) => void;
  setActiveWindowId: (id: string | null) => void;
  setNavigatorOrientation: (orientation: NavigatorOrientation) => void;
  setTheme: (theme: ThemeVariant) => void;
  setAccentColor: (accentColor: AccentColor) => void;
  setWindowGradient: (gradient: string) => void;
}

export const useDesktopStore = create<DesktopStore>()(
  persist(
    (set) => ({
      navApps: DEFAULT_NAV_APPS,
      trashedApps: [],
      windows: [],
      activeWindowId: null,
      navigatorOrientation: 'bottom',
      theme: 'light',
      accentColor: DEFAULT_ACCENT_COLOR,
      windowGradient: 'default',

      setWindows: (windows: DesktopWindow[]) => set({ windows }),
      setNavApps: (navApps: DesktopApp[]) => set({ navApps }),
      setTrashedApps: (trashedApps: DesktopApp[]) => set({ trashedApps }),
      setActiveWindowId: (activeWindowId: string | null) => set({ activeWindowId }),
      setNavigatorOrientation: (navigatorOrientation: NavigatorOrientation) => set({ navigatorOrientation }),
      setTheme: (theme: ThemeVariant) => set({ theme }),
      setAccentColor: (accentColor: AccentColor) => set({ accentColor }),
      setWindowGradient: (windowGradient: string) => set({ windowGradient }),
    }),
    {
      name: 'desktop-preferences',
      partialize: (state) => ({
        navigatorOrientation: state.navigatorOrientation,
        theme: state.theme,
        accentColor: state.accentColor,
        windowGradient: state.windowGradient,
      }),
    }
  )
);
