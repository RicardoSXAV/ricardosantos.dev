import { useRef, useEffect } from "react";

import { ResizeDirection } from "@/ts/interfaces/desktop.interfaces";

interface ResizeHandleProps {
  direction: ResizeDirection;
  onResizeStart: () => void;
  onResize: (direction: ResizeDirection, deltaX: number, deltaY: number) => void;
  onResizeEnd: () => void;
}

export default function ResizeHandle({
  direction,
  onResizeStart,
  onResize,
  onResizeEnd,
}: ResizeHandleProps) {
  const handleRef = useRef<HTMLDivElement>(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const isResizing = useRef(false);
  
  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;
    
    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      isResizing.current = true;
      lastPosition.current = { x: e.clientX, y: e.clientY };
      handle.setPointerCapture(e.pointerId);
      onResizeStart();
      
      document.body.style.cursor = getComputedStyle(handle).cursor;
    };
    
    const onPointerMove = (e: PointerEvent) => {
      if (!isResizing.current) return;
      
      const deltaX = e.clientX - lastPosition.current.x;
      const deltaY = e.clientY - lastPosition.current.y;
      
      onResize(direction, deltaX, deltaY);
      
      lastPosition.current = { x: e.clientX, y: e.clientY };
    };
    
    const onPointerUp = (e: PointerEvent) => {
      if (!isResizing.current) return;
      
      isResizing.current = false;
      handle.releasePointerCapture(e.pointerId);
      onResizeEnd();
      
      document.body.style.cursor = '';
    };
    
    handle.addEventListener('pointerdown', onPointerDown);
    handle.addEventListener('pointermove', onPointerMove);
    handle.addEventListener('pointerup', onPointerUp);
    handle.addEventListener('pointercancel', onPointerUp);
    
    return () => {
      handle.removeEventListener('pointerdown', onPointerDown);
      handle.removeEventListener('pointermove', onPointerMove);
      handle.removeEventListener('pointerup', onPointerUp);
      handle.removeEventListener('pointercancel', onPointerUp);
    };
  }, [direction, onResize, onResizeStart, onResizeEnd]);
  
  return (
    <div 
      ref={handleRef}
      className={`resize-handle ${direction}`}
    />
  );
}
