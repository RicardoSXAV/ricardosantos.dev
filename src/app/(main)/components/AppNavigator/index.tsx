import { useRef } from "react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";

import "./index.styles.scss";
import { useDesktopStore } from "@/stores/desktop.store";

export default function AppNavigator() {
  const { navApps, setNavApps } = useDesktopStore();

  const trashRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (id: string, info: PanInfo) => {
    if (trashRef.current) {
      const trashRect = trashRef.current.getBoundingClientRect();
      const { x, y } = info.point;

      if (
        x >= trashRect.left &&
        x <= trashRect.right &&
        y >= trashRect.top &&
        y <= trashRect.bottom
      ) {
        setNavApps(navApps.filter((app) => app.id !== id));
      }
    }
  };

  return (
    <nav className="app-navigator">
      <AnimatePresence mode="popLayout">
        {navApps.map(({ id, name }) => (
          <motion.div
            key={id}
            layoutId={id}
            layout
            className="app-item"
            drag
            dragSnapToOrigin
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileDrag={{ scale: 1.1, zIndex: 1 }}
            onDragEnd={(_, info) => handleDragEnd(id, info)}
          >
            <p>{name[0]}</p>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        ref={trashRef}
        className="app-item"
        whileHover={{ scale: 1.05 }}
        animate={{ opacity: 1 }}
      >
        <p>Trash</p>
      </motion.div>
    </nav>
  );
}
