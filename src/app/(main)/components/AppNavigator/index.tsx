import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, PanInfo } from "framer-motion";

import "./index.styles.scss";
import { useDesktopStore } from "@/stores/desktop.store";
import appIcons from "@/assets/icons/apps";

export default function AppNavigator() {
  const { navApps, setNavApps } = useDesktopStore();
  const trashRef = useRef<HTMLDivElement>(null);
  const [draggedItemNearTrash, setDraggedItemNearTrash] = useState<string | null>(null);

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
      setNavApps(navApps.filter((app) => app.id !== id));

      const audio = new Audio("/sounds/trash-sound.mp3");
      audio.play();
    }
    setDraggedItemNearTrash(null);
  };

  return (
    <nav className="app-navigator">
      <AnimatePresence mode="popLayout">
        {navApps.map(({ id, name }) => {
          const icon = appIcons[id as keyof typeof appIcons];
          const isNearTrashBin = draggedItemNearTrash === id;

          return (
            <motion.div
              key={id}
              layoutId={id}
              layout
              className="app-item"
              drag
              dragSnapToOrigin
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: isNearTrashBin ? 0.8 : 1,
                opacity: isNearTrashBin ? 0.5 : 1
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileDrag={{ scale: isNearTrashBin ? 0.8 : 1.1 }}
              onDrag={(_, info) => {
                setDraggedItemNearTrash(isNearTrash(info.point) ? id : null);
              }}
              onDragEnd={(_, info) => handleDragEnd(id, info)}
            >
              {icon && (
                <Image
                  src={icon}
                  className="app-icon"
                  alt={name}
                  objectFit="cover"
                  fill
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      <motion.div
        ref={trashRef}
        className="app-item trash"
        whileHover={{ scale: 1.05 }}
        animate={{ opacity: 1 }}
      >
        <Image src={appIcons.trash} className="app-icon" alt="Trash" fill />
      </motion.div>
    </nav>
  );
}
