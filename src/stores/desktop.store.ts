import { create } from 'zustand';

import { DesktopApp, DesktopWindow } from '@/ts/interfaces/desktop.interfaces';
import { DEFAULT_NAV_APPS } from './data/desktop.data';

export type NavigatorOrientation = 'bottom' | 'top' | 'left' | 'right';
export type ThemeVariant = 'light' | 'dark';

interface DesktopStore {
  navApps: DesktopApp[];
  trashedApps: DesktopApp[];
  windows: DesktopWindow[];
  activeWindowId: string | null;
  navigatorOrientation: NavigatorOrientation;
  theme: ThemeVariant;

  setNavApps: (navApps: DesktopApp[]) => void;
  setTrashedApps: (trashedApps: DesktopApp[]) => void;
  setWindows: (windows: DesktopWindow[]) => void;
  setActiveWindowId: (id: string | null) => void;
  setNavigatorOrientation: (orientation: NavigatorOrientation) => void;
  setTheme: (theme: ThemeVariant) => void;
}

export const useDesktopStore = create<DesktopStore>((set) => ({
  navApps: DEFAULT_NAV_APPS,
  trashedApps: [],
  windows: [],
  activeWindowId: null,
  navigatorOrientation: 'bottom',
  theme: 'light',

  setWindows: (windows: DesktopWindow[]) => set({ windows }),
  setNavApps: (navApps: DesktopApp[]) => set({ navApps }),
  setTrashedApps: (trashedApps: DesktopApp[]) => set({ trashedApps }),
  setActiveWindowId: (activeWindowId: string | null) => set({ activeWindowId }),
  setNavigatorOrientation: (navigatorOrientation: NavigatorOrientation) => set({ navigatorOrientation }),
  setTheme: (theme: ThemeVariant) => set({ theme }),
}));
