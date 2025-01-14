import "./index.styles.scss";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useDesktopStore } from "@/stores/desktop.store";
import Window from "@/components/Window";

export default function WindowManager() {
  const { windows, setWindows } = useDesktopStore();
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

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
    setWindows([
      ...windows.filter(w => w.appId !== id),
      windows.find(w => w.appId === id)!
    ]);
  };

  return (
    <div className="window-manager" onClick={() => setActiveWindowId(null)}>
      <AnimatePresence mode="popLayout">
        {windows.map((window) => (
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
