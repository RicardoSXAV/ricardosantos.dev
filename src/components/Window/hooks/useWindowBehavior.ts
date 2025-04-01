import { useRef, useState, useEffect, useCallback } from "react";
import { useDragControls, useMotionValue, animate } from "framer-motion";
import { DesktopWindow } from "@/ts/interfaces/desktop.interfaces";
import { useDesktopStore } from "@/stores/desktop.store";

export type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export function useWindowBehavior(
  desktopWindow: DesktopWindow,
  onPositionChange: (id: string, position: { x: number; y: number }) => void,
  onSizeChange: (id: string, size: { width: number; height: number }) => void,
  onFocus: () => void
) {
  const { windows, setWindows } = useDesktopStore();
  
  // Refs and state
  const windowRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const previousSize = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const previousPosition = useRef({ x: 0, y: 0 });
  
  // UI states
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximizing, setIsMaximizing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(desktopWindow.minimized || false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [constraints, setConstraints] = useState({
    left: 0, top: 0, right: 0, bottom: 0,
  });
  const [minimizeTarget, setMinimizeTarget] = useState({ x: 0, y: 0 });
  
  // Motion values
  const x = useMotionValue(desktopWindow.position.x);
  const y = useMotionValue(desktopWindow.position.y);
  const width = useMotionValue(desktopWindow.size.width);
  const height = useMotionValue(desktopWindow.size.height);

  // Sync minimized state with window props
  useEffect(() => {
    setIsMinimized(desktopWindow.minimized || false);
  }, [desktopWindow.minimized]);

  // Find app icon position for minimize animation
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
        setMinimizeTarget({
          x: window.innerWidth / 2,
          y: window.innerHeight - 40
        });
      }
    };

    findAppIconPosition();
    window.addEventListener('resize', findAppIconPosition);
    
    return () => {
      window.removeEventListener('resize', findAppIconPosition);
    };
  }, [desktopWindow.appId]);

  // Update constraints when window size changes
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
  }, [width, height, x, y]);

  // Set up resize observer
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

  // Handle window resize
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

  // Handle resize end
  const handleResizeEnd = () => {
    setIsResizing(false);
    onPositionChange(desktopWindow.appId, { x: x.get(), y: y.get() });
    onSizeChange(desktopWindow.appId, {
      width: width.get(),
      height: height.get(),
    });
  };

  // Handle window close
  const handleClose = () => {
    setWindows(windows.filter((w) => w.appId !== desktopWindow.appId));
  };

  // Handle window maximize
  const handleMaximize = () => {
    const windowManager = windowRef.current?.parentElement;
    if (!windowManager) return;

    setIsMaximizing(true);

    if (!isMaximized) {
      previousSize.current = {
        x: x.get(),
        y: y.get(),
        width: width.get(),
        height: height.get(),
      };

      x.set(0);
      y.set(0);
      width.set(windowManager.clientWidth);
      height.set(windowManager.clientHeight);
    } else {
      x.set(previousSize.current.x);
      y.set(previousSize.current.y);
      width.set(previousSize.current.width);
      height.set(previousSize.current.height);
    }

    setIsMaximized(!isMaximized);
    setTimeout(() => setIsMaximizing(false), 300);
    updateConstraints();
  };

  // Handle window minimize
  const handleMinimize = () => {
    previousPosition.current = {
      x: x.get(),
      y: y.get()
    };

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

    const updatedWindows = windows.map(w => 
      w.appId === desktopWindow.appId 
        ? { ...w, minimized: true } 
        : w
    );
    setWindows(updatedWindows);
  };

  // Handle window restore from minimized state
  useEffect(() => {
    if (!desktopWindow.minimized && isMinimized) {
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

  return {
    // Refs
    windowRef,
    dragControls,
    
    // Motion values
    x, y, width, height,
    
    // States
    isDragging,
    isResizing,
    isMaximizing,
    isMinimized,
    constraints,
    
    // Actions
    setIsDragging,
    setIsResizing,
    handleResize,
    handleResizeEnd,
    handleClose,
    handleMaximize,
    handleMinimize,
    onFocus,
  };
}
