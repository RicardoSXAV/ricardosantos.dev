import { DesktopApp } from "@/ts/interfaces/desktop.interfaces";

export const DEFAULT_NAV_APPS: DesktopApp[] = [
  { id: 'resume', name: 'Resume' },
  { id: 'github', name: 'GitHub' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'settings', name: 'Settings' },
];

export const STATIC_APP_NAMES: Record<string, string> = {
  trash: "Trash",
};