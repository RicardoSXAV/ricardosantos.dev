import "./index.styles.scss";

import { motion } from "framer-motion";

import { DesktopWindow, ResizeDirection } from "@/ts/interfaces/desktop.interfaces";
import { useWindowBehavior } from "./hooks/useWindowBehavior";
import WindowContent from "./components/WindowContent";
import WindowHeader from "./components/WindowHeader";

interface WindowProps {
  window: DesktopWindow;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onSizeChange: (id: string, size: { width: number; height: number }) => void;
  onFocus: () => void;
  isActive: boolean;
}

export default function Window({
  window: desktopWindow,
  onPositionChange,
  onSizeChange,
  onFocus,
  isActive,
}: WindowProps) {
  const {
    windowRef,
    dragControls,
    x, y, width, height,
    isDragging,
    isResizing,
    isMaximizing,
    isMinimized,
    constraints,
    setIsDragging,
    setIsResizing,
    handleResize,
    handleResizeEnd,
    handleClose,
    handleMaximize,
    handleMinimize
  } = useWindowBehavior(
    desktopWindow,
    onPositionChange,
    onSizeChange,
    onFocus
  );

  const directions: ResizeDirection[] = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

  const ResizeHandle = ({ direction }: { direction: ResizeDirection }) => (
    <motion.div
      className={`resize-handle ${direction}`}
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => {
        setIsResizing(true);
        onFocus();
      }}
      onDrag={(_, info) => {
        handleResize(direction, info.delta.x, info.delta.y);
      }}
      onDragEnd={handleResizeEnd}
    />
  );

  return (
    <motion.div
      ref={windowRef}
      className={`window ${isActive ? "active" : ""} ${
        isDragging ? "dragging" : ""
      } ${isResizing ? "resizing" : ""} ${isMaximizing ? "maximizing" : ""} ${
        isMinimized ? "minimized" : ""
      }`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{
        scale: isMinimized ? 0.2 : 1,
        opacity: isMinimized ? 0 : 1,
        rotateX: isMinimized ? 45 : 0,
        rotateY: isMinimized ? 10 : 0,
        zIndex: desktopWindow.zIndex,
        transition: { 
          type: "spring",
          stiffness: 300,
          damping: 20,
          mass: 0.8,
          duration: 0.4
        },
      }}
      exit={{ scale: 0.9, opacity: 0 }}
      drag={!isMinimized}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={1}
      dragListener={false}
      dragConstraints={constraints}
      style={{ 
        x, 
        y, 
        width, 
        height,
        pointerEvents: isMinimized ? "none" : "auto",
        transformPerspective: 1000
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!isMinimized) onFocus();
      }}
      onDragStart={() => {
        if (isMinimized) return;
        setIsDragging(true);
        onFocus();
      }}
      onDragEnd={() => {
        if (isMinimized) return;
        setIsDragging(false);
        onPositionChange(desktopWindow.appId, {
          x: x.get(),
          y: y.get(),
        });
      }}
    >
      <WindowHeader
        appId={desktopWindow.appId}
        dragControls={dragControls}
        onClose={handleClose}
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
      />

      <WindowContent appId={desktopWindow.appId} />

      {directions.map((direction) => (
        <ResizeHandle key={direction} direction={direction} />
      ))}
    </motion.div>
  );
}
