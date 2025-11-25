import { create } from 'zustand';

import { DesktopApp, DesktopWindow } from '@/ts/interfaces/desktop.interfaces';
import { DEFAULT_NAV_APPS } from './data/desktop.data';

export type NavigatorOrientation = 'bottom' | 'top' | 'left' | 'right';

interface DesktopStore {
  navApps: DesktopApp[];
  windows: DesktopWindow[];
  activeWindowId: string | null;
  navigatorOrientation: NavigatorOrientation;

  setNavApps: (navApps: DesktopApp[]) => void;
  setWindows: (windows: DesktopWindow[]) => void;
  setActiveWindowId: (id: string | null) => void;
  setNavigatorOrientation: (orientation: NavigatorOrientation) => void;
}

export const useDesktopStore = create<DesktopStore>((set) => ({
  navApps: DEFAULT_NAV_APPS,
  windows: [],
  activeWindowId: null,
  navigatorOrientation: 'bottom',

  setWindows: (windows: DesktopWindow[]) => set({ windows }),
  setNavApps: (navApps: DesktopApp[]) => set({ navApps }),
  setActiveWindowId: (activeWindowId: string | null) => set({ activeWindowId }),
  setNavigatorOrientation: (navigatorOrientation: NavigatorOrientation) => set({ navigatorOrientation }),
}));
