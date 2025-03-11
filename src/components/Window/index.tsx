import "./index.styles.scss";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useDragControls, useMotionValue, animate } from "framer-motion";

import { DesktopWindow } from "@/ts/interfaces/desktop.interfaces";
import { useDesktopStore } from "@/stores/desktop.store";
import Image from "next/image";
import appIcons from "@/assets/icons/apps";

interface WindowProps {
  window: DesktopWindow;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onSizeChange: (id: string, size: { width: number; height: number }) => void;
  onFocus: () => void;
  isActive: boolean;
}

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export default function Window({
  window: desktopWindow,
  onPositionChange,
  onSizeChange,
  onFocus,
  isActive,
}: WindowProps) {
  const { windows, setWindows, navApps } = useDesktopStore();

  const dragControls = useDragControls();
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximizing, setIsMaximizing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(desktopWindow.minimized || false);
  const [constraints, setConstraints] = useState({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  });
  const [isMaximized, setIsMaximized] = useState(false);
  const previousSize = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const [minimizeTarget, setMinimizeTarget] = useState({ x: 0, y: 0 });
  const previousPosition = useRef({ x: 0, y: 0 });

  const x = useMotionValue(desktopWindow.position.x);
  const y = useMotionValue(desktopWindow.position.y);
  const width = useMotionValue(desktopWindow.size.width);
  const height = useMotionValue(desktopWindow.size.height);

  // Update local state when window props change
  useEffect(() => {
    setIsMinimized(desktopWindow.minimized || false);
  }, [desktopWindow.minimized]);

  // Find the exact position of the app icon in the dock
  useEffect(() => {
    const findAppIconPosition = () => {
      const appId = desktopWindow.appId;
      const appElement = document.querySelector(`[data-app-id="${appId}"]`);
      
      if (appElement) {
        const rect = appElement.getBoundingClientRect();
        setMinimizeTarget({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      } else {
        // Fallback if app icon not found
        setMinimizeTarget({
          x: window.innerWidth / 2,
          y: window.innerHeight - 40
        });
      }
    };

    findAppIconPosition();
    
    // Update position on window resize
    window.addEventListener('resize', findAppIconPosition);
    
    return () => {
      window.removeEventListener('resize', findAppIconPosition);
    };
  }, [desktopWindow.appId]);

  const handleResize = (
    direction: ResizeDirection,
    deltaX: number,
    deltaY: number
  ) => {
    const minWidth = 200;
    const minHeight = 150;
    const windowManager = windowRef.current?.parentElement;
    if (!windowManager) return;

    const managerRect = windowManager.getBoundingClientRect();
    const maxWidth = managerRect.width;
    const maxHeight = managerRect.height;

    let newWidth = width.get();
    let newHeight = height.get();
    let newX = x.get();
    let newY = y.get();

    if (direction.includes("e")) {
      const possibleWidth = Math.max(minWidth, width.get() + deltaX);
      newWidth = Math.min(maxWidth - x.get(), possibleWidth);
    } else if (direction.includes("w")) {
      const possibleWidth = Math.max(minWidth, width.get() - deltaX);
      const maxPossibleX = maxWidth - width.get();
      if (possibleWidth !== width.get()) {
        newWidth = possibleWidth;
        newX = Math.min(maxPossibleX, Math.max(0, x.get() + deltaX));
      }
    }

    if (direction.includes("s")) {
      const possibleHeight = Math.max(minHeight, height.get() + deltaY);
      newHeight = Math.min(maxHeight - y.get(), possibleHeight);
    } else if (direction.includes("n")) {
      const possibleHeight = Math.max(minHeight, height.get() - deltaY);
      const maxPossibleY = maxHeight - height.get();
      if (possibleHeight !== height.get()) {
        newHeight = possibleHeight;
        newY = Math.min(maxPossibleY, Math.max(0, y.get() + deltaY));
      }
    }

    x.set(newX);
    y.set(newY);
    width.set(newWidth);
    height.set(newHeight);

    updateConstraints();
  };

  const updateConstraints = useCallback(() => {
    const windowManager = windowRef.current?.parentElement;
    if (windowManager) {
      const managerRect = windowManager.getBoundingClientRect();
      const maxX = Math.max(0, managerRect.width - width.get());
      const maxY = Math.max(0, managerRect.height - height.get());

      setConstraints({
        left: 0,
        top: 0,
        right: maxX,
        bottom: maxY,
      });

      x.set(Math.min(maxX, Math.max(0, x.get())));
      y.set(Math.min(maxY, Math.max(0, y.get())));
    }
  }, [width, height, x, y, setConstraints]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(updateConstraints);
    const windowManager = windowRef.current?.parentElement;

    if (windowManager) {
      resizeObserver.observe(windowManager);
    }

    window.addEventListener("resize", updateConstraints);
    updateConstraints();

    return () => {
      if (windowManager) {
        resizeObserver.unobserve(windowManager);
      }
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateConstraints);
    };
  }, [updateConstraints]);

  const handleClose = (appId: string) => {
    console.log("Close window", appId);
    setWindows(windows.filter((w) => w.appId !== appId));
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    onPositionChange(desktopWindow.appId, { x: x.get(), y: y.get() });
    onSizeChange(desktopWindow.appId, {
      width: width.get(),
      height: height.get(),
    });
  };

  const handleMaximize = () => {
    const windowManager = windowRef.current?.parentElement;
    if (!windowManager) return;

    setIsMaximizing(true);

    if (!isMaximized) {
      // Store current position and size
      previousSize.current = {
        x: x.get(),
        y: y.get(),
        width: width.get(),
        height: height.get(),
      };

      // Maximize
      x.set(0);
      y.set(0);
      width.set(windowManager.clientWidth);
      height.set(windowManager.clientHeight);
    } else {
      // Restore previous position and size
      x.set(previousSize.current.x);
      y.set(previousSize.current.y);
      width.set(previousSize.current.width);
      height.set(previousSize.current.height);
    }

    setIsMaximized(!isMaximized);
    setTimeout(() => setIsMaximizing(false), 300);
    updateConstraints();
  };

  const handleMinimize = () => {
    // Store the current position before minimizing
    previousPosition.current = {
      x: x.get(),
      y: y.get()
    };
    
    // Animate to the target position
    animate(x, minimizeTarget.x - width.get() / 2, {
      type: "spring",
      stiffness: 300,
      damping: 20,
      mass: 0.8,
      duration: 0.4
    });
    
    animate(y, minimizeTarget.y - height.get() / 2, {
      type: "spring",
      stiffness: 300,
      damping: 20,
      mass: 0.8,
      duration: 0.4
    });
    
    setIsMinimized(true);
    
    // Update the window state in the store
    const updatedWindows = windows.map(w => 
      w.appId === desktopWindow.appId 
        ? { ...w, minimized: true } 
        : w
    );
    setWindows(updatedWindows);
  };

  useEffect(() => {
    // If the window was minimized and is now being restored
    if (!desktopWindow.minimized && isMinimized) {
      // Restore to the previous position
      animate(x, previousPosition.current.x, {
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.8,
        duration: 0.4
      });
      
      animate(y, previousPosition.current.y, {
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.8,
        duration: 0.4
      });
      
      setIsMinimized(false);
    }
  }, [desktopWindow.minimized, isMinimized, x, y]);

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
      <div
        className="window-header"
        onPointerDown={(e) => {
          e.stopPropagation();
          dragControls.start(e);
        }}
        onDoubleClick={handleMaximize}
      >
        <div className="window-title">
          <Image
            className="window-icon"
            src={appIcons[desktopWindow.appId as keyof typeof appIcons]}
            alt={desktopWindow.appId}
            width={24}
            height={24}
          />
          {navApps.find((app) => app.id === desktopWindow.appId)?.name}
        </div>
        <div className="window-controls">
          <button
            className="close"
            onClick={(e) => {
              e.stopPropagation();
              handleClose(desktopWindow.appId);
            }}
          />
          <button
            className="minimize"
            onClick={(e) => {
              e.stopPropagation();
              handleMinimize();
            }}
          />
          <button
            className="maximize"
            onClick={(e) => {
              e.stopPropagation();
              handleMaximize();
            }}
          />
        </div>
      </div>

      <div className="window-content">
        Content for window {desktopWindow.appId}
      </div>

      <ResizeHandle direction="n" />
      <ResizeHandle direction="s" />
      <ResizeHandle direction="e" />
      <ResizeHandle direction="w" />
      <ResizeHandle direction="ne" />
      <ResizeHandle direction="nw" />
      <ResizeHandle direction="se" />
      <ResizeHandle direction="sw" />
    </motion.div>
  );
}
