import "./index.styles.scss";

import { AnimatePresence } from "framer-motion";

import { useDesktopStore } from "@/stores/desktop.store";
import Window from "@/components/Window";

export default function WindowManager() {
  const { windows, setWindows, activeWindowId, setActiveWindowId } = useDesktopStore();

  const handlePositionChange = (id: string, position: { x: number; y: number }) => {
    setWindows(
      windows.map((window) =>
        window.appId === id ? { ...window, position } : window
      )
    );
  };

  const handleSizeChange = (id: string, size: { width: number; height: number }) => {
    setWindows(
      windows.map((window) =>
        window.appId === id ? { ...window, size } : window
      )
    );
  };

  const handleWindowFocus = (id: string) => {
    setActiveWindowId(id);

    const maxZIndex = Math.max(0, ...windows.map(w => w.zIndex));
    setWindows(
      windows.map((window) =>
        window.appId === id ? { ...window, zIndex: maxZIndex + 1 } : window
      )
    );
  };

  const sortedWindows = [...windows].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="window-manager" onClick={() => setActiveWindowId(null)}>
      <AnimatePresence mode="popLayout">
        {sortedWindows.map((window) => (
          <Window
            key={window.appId}
            window={window}
            onPositionChange={handlePositionChange}
            onSizeChange={handleSizeChange}
            onFocus={() => handleWindowFocus(window.appId)}
            isActive={window.appId === activeWindowId}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
