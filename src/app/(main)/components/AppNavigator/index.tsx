import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, PanInfo, Reorder } from "framer-motion";

import "./index.styles.scss";
import { useDesktopStore } from "@/stores/desktop.store";
import appIcons from "@/assets/icons/apps";

export default function AppNavigator() {
  const { 
    navApps,
    trashedApps,
    setNavApps,
    setTrashedApps,
    windows,
    setWindows,
    setActiveWindowId,
    navigatorOrientation
  } = useDesktopStore();
  const trashRef = useRef<HTMLDivElement>(null);
  const [draggedItemNearTrash, setDraggedItemNearTrash] = useState<string | null>(null);
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);

  const isNearTrash = (point: { x: number; y: number }) => {
    if (!trashRef.current) return false;
    const trashRect = trashRef.current.getBoundingClientRect();
    const { x, y } = point;

    return (
      x >= trashRect.left - 20 &&
      x <= trashRect.right + 20 &&
      y >= trashRect.top - 20 &&
      y <= trashRect.bottom + 20
    );
  };

  const handleDragEnd = (id: string, info: PanInfo) => {
    if (isNearTrash(info.point)) {
      const removedApp = navApps.find((app) => app.id === id);
      setNavApps(navApps.filter((app) => app.id !== id));

      if (removedApp) {
        const updatedTrashedApps = [
          ...trashedApps.filter((app) => app.id !== removedApp.id),
          removedApp,
        ];
        setTrashedApps(updatedTrashedApps);
      }

      const audio = new Audio("/sounds/trash-sound.mp3");
      audio.play();
    }
    setDraggedItemNearTrash(null);
    setDraggingItemId(null);
  };

  const getNextZIndex = () => Math.max(0, ...windows.map((w) => w.zIndex)) + 1;

  const openWindow = (id: string) => {
    const nextZIndex = getNextZIndex();
    const minimizedWindow = windows.find((w) => w.appId === id && w.minimized);

    if (minimizedWindow) {
      const updatedWindows = windows.map((w) =>
        w.appId === id
          ? { ...w, minimized: false, zIndex: nextZIndex }
          : w
      );
      setWindows(updatedWindows);
      setActiveWindowId(id);
      return;
    }

    if (!windows.some((window) => window.appId === id)) {
      const newWindow = {
        appId: id,
        position: { x: 300, y: 300 },
        size: { width: 450, height: 300 },
        zIndex: nextZIndex,
      };
      setWindows([...windows, newWindow]);
      setActiveWindowId(id);
      return;
    }

    const updatedWindows = windows.map((w) => ({
      ...w,
      zIndex: w.appId === id ? nextZIndex : w.zIndex,
    }));
    setWindows(updatedWindows);
    setActiveWindowId(id);
  };

  const handleAppClick = (id: string) => {
    if (draggingItemId) return;
    openWindow(id);
  };

  const handleTrashClick = () => {
    if (draggingItemId) return;
    openWindow("trash");
  };

  const isVertical = navigatorOrientation === 'left' || navigatorOrientation === 'right';
  const dragAxis = isVertical ? 'y' : 'x';

  return (
    <nav className={`app-navigator app-navigator--${navigatorOrientation}`}>
      <Reorder.Group as="div" axis={dragAxis} values={navApps} onReorder={setNavApps} className="app-list">
        <AnimatePresence mode="popLayout">
          {navApps.map((app) => {
            const icon = appIcons[app.id as keyof typeof appIcons];
            const isNearTrashBin = draggedItemNearTrash === app.id;
            const hasMinimizedWindow = windows.some(w => w.appId === app.id && w.minimized);
            const isBeingDragged = draggingItemId === app.id;

            return (
              <Reorder.Item
                key={app.id}
                value={app}
                as="div"
                layoutId={app.id}
                className="app-item"
                data-app-id={app.id}
                drag
                dragSnapToOrigin
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: isNearTrashBin ? 0.8 : 1,
                  opacity: isNearTrashBin ? 0.5 : 1
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileDrag={{ scale: isNearTrashBin ? 0.8 : 1.1, zIndex: 3 }}
                onClick={() => handleAppClick(app.id)}
                onDragStart={() => setDraggingItemId(app.id)}
                onDrag={(_, info) => {
                  setDraggedItemNearTrash(isNearTrash(info.point) ? app.id : null);
                }}
                onDragEnd={(_, info) => handleDragEnd(app.id, info)}
                whileHover={{ scale: 1.05 }}
                transition={{
                  layout: { type: "spring", stiffness: 300, damping: 30 }
                }}
              >
                {icon && (
                  <Image
                    src={icon}
                    className="app-icon"
                    alt={app.name}
                    style={{ objectFit: "cover" }}
                    fill
                  />
                )}

                {hasMinimizedWindow && !isBeingDragged && (
                  <motion.div
                    className="minimized-indicator"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  />
                )}
              </Reorder.Item>
            );
          })}
        </AnimatePresence>
      </Reorder.Group>

      <motion.div
        ref={trashRef}
        className="app-item trash"
        data-app-id="trash"
        role="button"
        tabIndex={0}
        whileHover={{ scale: 1.05 }}
        animate={{ opacity: 1 }}
        onClick={handleTrashClick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleTrashClick();
          }
        }}
      >
        <Image src={appIcons.trash} className="app-icon" alt="Trash" fill />
      </motion.div>
    </nav>
  );
}
