import { create } from 'zustand';

import { DesktopApp, DesktopWindow } from '@/ts/interfaces/desktop.interfaces';

interface DesktopStore {
  navApps: DesktopApp[];
  windows: DesktopWindow[];

  setNavApps: (navApps: DesktopApp[]) => void;
  setWindows: (windows: DesktopWindow[]) => void;
}

export const useDesktopStore = create<DesktopStore>((set) => ({
  navApps: [{ id: 'store', name: 'Store' }, { id: 'settings', name: 'Settings' }],
  windows: [],
  setWindows: (windows: DesktopWindow[]) => set({ windows }),
  setNavApps: (navApps: DesktopApp[]) => set({ navApps }),
}));
