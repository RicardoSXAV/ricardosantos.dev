import { create } from 'zustand';

import { DesktopApp, DesktopWindow } from '@/ts/interfaces/desktop.interfaces';
import { DEFAULT_NAV_APPS } from './data/desktop.data';

interface DesktopStore {
  navApps: DesktopApp[];
  windows: DesktopWindow[];
  activeWindowId: string | null;

  setNavApps: (navApps: DesktopApp[]) => void;
  setWindows: (windows: DesktopWindow[]) => void;
  setActiveWindowId: (id: string | null) => void;
}

export const useDesktopStore = create<DesktopStore>((set) => ({
  navApps: DEFAULT_NAV_APPS,
  windows: [],
  activeWindowId: null,
  
  setWindows: (windows: DesktopWindow[]) => set({ windows }),
  setNavApps: (navApps: DesktopApp[]) => set({ navApps }),
  setActiveWindowId: (activeWindowId: string | null) => set({ activeWindowId }),
}));
