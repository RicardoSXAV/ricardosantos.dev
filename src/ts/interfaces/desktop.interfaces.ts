export interface DesktopApp {
  id: string;
  name: string;
}

export interface DesktopWindow {
  appId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  minimized?: boolean;
}

export type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
